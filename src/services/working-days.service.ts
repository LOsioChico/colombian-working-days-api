import { addHours, setHours, addDays, nextMonday, isWeekend } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

import { BUSINESS_HOURS } from "../constants";
import {
  isAfterWorkingHour,
  isBeforeWorkingHour,
  isHoliday,
  isLunchTime,
  isWorkingTime,
  setDateTime,
} from "../utils/working-utils";
import { WorkingDaysInput, ColombianHoliday } from "../types";

export const calculateWorkingDays = async (
  input: WorkingDaysInput,
  holidays: ColombianHoliday[],
): Promise<string> => {
  const startDate = input.date
    ? toZonedTime(new Date(input.date), BUSINESS_HOURS.TIMEZONE)
    : toZonedTime(new Date(), BUSINESS_HOURS.TIMEZONE);
  const cleanedDate = setDateTime(startDate, {
    hour: startDate.getHours(),
    minute: startDate.getMinutes(),
  });

  const addBusinessDaysFromInput = (date: Date): Date =>
    input.days ? addBusinessDays(date, input.days, holidays) : date;

  const addWorkingHoursFromInput = (date: Date): Date =>
    input.hours ? addWorkingHours(date, input.hours) : date;

  const adjustedStart = adjustBackwards(cleanedDate, holidays);
  const addedDays = addBusinessDaysFromInput(adjustedStart);
  const addedHours = addWorkingHoursFromInput(addedDays);
  const finalResult = addHourIfMinutesRemain(addedHours);
  return fromZonedTime(finalResult, BUSINESS_HOURS.TIMEZONE).toISOString();
};

const adjustForward = (date: Date): Date => {
  if (isWeekend(date)) {
    return setHours(nextMonday(date), BUSINESS_HOURS.WORK_START_HOUR);
  }

  if (isBeforeWorkingHour(date)) {
    return setHours(date, BUSINESS_HOURS.WORK_START_HOUR);
  }

  if (isLunchTime(date)) {
    return setHours(date, BUSINESS_HOURS.LUNCH_END_HOUR);
  }

  if (isAfterWorkingHour(date)) {
    return adjustForward(
      setHours(addDays(date, 1), BUSINESS_HOURS.WORK_START_HOUR),
    );
  }

  return date;
};

const addBusinessDays = (
  date: Date,
  days: number,
  holidays: string[],
): Date => {
  if (days <= 0) return date;

  const nextDay = addDays(date, 1);

  if (isWeekend(nextDay) || isHoliday(nextDay, holidays)) {
    return addBusinessDays(nextDay, days, holidays);
  }

  return addBusinessDays(nextDay, days - 1, holidays);
};

const addWorkingHours = (date: Date, hours: number): Date => {
  if (hours <= 0) return date;

  if (isWorkingTime(date)) {
    return addWorkingHours(addHours(date, 1), hours - 1);
  }

  return addWorkingHours(adjustForward(date), hours);
};

const adjustBackwards = (date: Date, holidays: string[]): Date => {
  if (
    isBeforeWorkingHour(date) ||
    isHoliday(date, holidays) ||
    isWeekend(date)
  ) {
    const adjustedTime = setDateTime(date, {
      hour: BUSINESS_HOURS.WORK_END_HOUR,
    });
    return adjustBackwards(addDays(adjustedTime, -1), holidays);
  }

  if (isLunchTime(date)) {
    return setDateTime(date, {
      hour: BUSINESS_HOURS.LUNCH_START_HOUR,
    });
  }

  if (isAfterWorkingHour(date)) {
    return setDateTime(date, {
      hour: BUSINESS_HOURS.WORK_END_HOUR,
    });
  }

  return date;
};

const addHourIfMinutesRemain = (date: Date): Date => {
  const minutes = date.getMinutes();
  if (minutes > 0 && isAfterWorkingHour(date)) {
    return adjustForward(addHours(date, 1));
  }
  return date;
};
