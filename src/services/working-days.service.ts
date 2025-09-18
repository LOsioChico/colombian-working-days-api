import { addHours, isWeekend, setHours, addDays, nextMonday } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

import { BUSINESS_HOURS } from "../constants";
import {
  isAfterWorkingHour,
  isBeforeWorkingHour,
  isLunchTime,
  isWorkingTime,
} from "../utils/working-utils";
import { WorkingDaysInput } from "../types";

export const calculateWorkingDays = async (
  input: WorkingDaysInput,
  holidays: string[],
): Promise<string> => {
  const startDate = input.date
    ? toZonedTime(new Date(input.date), BUSINESS_HOURS.TIMEZONE)
    : toZonedTime(new Date(), BUSINESS_HOURS.TIMEZONE);

  const adjustedDate = adjustToWorkingTime(startDate);

  const addDaysIfNeeded = (date: Date): Date =>
    input.days
      ? addBusinessDaysWithHolidays(date, input.days, holidays)
      : adjustedDate;

  const addHoursIfNeeded = (date: Date): Date =>
    input.hours ? addWorkingHours(date, input.hours) : adjustedDate;

  const finalResult = addHoursIfNeeded(addDaysIfNeeded(adjustedDate));
  return fromZonedTime(finalResult, BUSINESS_HOURS.TIMEZONE).toISOString();
};

const adjustToWorkingTime = (date: Date): Date => {
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
    return setHours(addDays(date, 1), BUSINESS_HOURS.WORK_START_HOUR);
  }

  return date;
};

const addBusinessDaysWithHolidays = (
  date: Date,
  days: number,
  holidays: string[],
): Date => {
  if (days <= 0) return date;

  const nextDate = addDays(date, 1);
  const dateString = nextDate.toISOString().split("T")[0];
  const isHoliday = dateString && holidays.includes(dateString);

  if (isWeekend(nextDate) || isHoliday) {
    return addBusinessDaysWithHolidays(nextDate, days, holidays);
  }

  return addBusinessDaysWithHolidays(nextDate, days - 1, holidays);
};

const addWorkingHours = (date: Date, hours: number): Date => {
  if (hours <= 0) return date;

  const hour = date.getHours();

  if (isWorkingTime(hour)) {
    return addWorkingHours(addHours(date, 1), hours - 1);
  }

  return addWorkingHours(adjustToWorkingTime(date), hours);
};
