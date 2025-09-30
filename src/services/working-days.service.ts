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
  const finalResult = addWorkingHoursFromInput(
    addBusinessDaysFromInput(adjustedStart),
  );
  return fromZonedTime(finalResult, BUSINESS_HOURS.TIMEZONE).toISOString();
};

const adjustForward = (date: Date): Date => {
  if (isWeekend(date)) {
    return setHours(nextMonday(date), BUSINESS_HOURS.WORK_START_HOUR);
  }

  const hour = date.getHours();

  if (isBeforeWorkingHour(hour)) {
    return setHours(date, BUSINESS_HOURS.WORK_START_HOUR);
  }

  if (isLunchTime(hour)) {
    return setHours(date, BUSINESS_HOURS.LUNCH_END_HOUR);
  }

  if (isAfterWorkingHour(hour)) {
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

  const hour = date.getHours();

  if (isWorkingTime(hour)) {
    return addWorkingHours(addHours(date, 1), hours - 1);
  }

  return addWorkingHours(adjustForward(date), hours);
};

const adjustBackwards = (date: Date, holidays: string[]): Date => {
  const hour = date.getHours();

  if (
    isBeforeWorkingHour(hour) ||
    isHoliday(date, holidays) ||
    isWeekend(date)
  ) {
    const adjustedTime = setDateTime(date, {
      hour: BUSINESS_HOURS.WORK_END_HOUR,
    });
    return adjustBackwards(addDays(adjustedTime, -1), holidays);
  }

  if (isLunchTime(hour)) {
    return setDateTime(date, {
      hour: BUSINESS_HOURS.LUNCH_START_HOUR,
    });
  }

  if (isAfterWorkingHour(hour)) {
    return setDateTime(date, {
      hour: BUSINESS_HOURS.WORK_END_HOUR,
    });
  }

  return date;
};
