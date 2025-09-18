import { BUSINESS_HOURS } from "../constants";

export const isWorkingTime = (hour: number): boolean => {
  return isWorkingHour(hour) && !isLunchTime(hour);
};

export const isLunchTime = (hour: number): boolean => {
  const { LUNCH_START_HOUR, LUNCH_END_HOUR } = BUSINESS_HOURS;
  return hour >= LUNCH_START_HOUR && hour < LUNCH_END_HOUR;
};

export const isWorkingHour = (hour: number): boolean => {
  const { WORK_START_HOUR, WORK_END_HOUR } = BUSINESS_HOURS;
  return hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
};

export const isBeforeWorkingHour = (hour: number): boolean => {
  const { WORK_START_HOUR } = BUSINESS_HOURS;
  return hour < WORK_START_HOUR;
};

export const isAfterWorkingHour = (hour: number): boolean => {
  const { WORK_END_HOUR } = BUSINESS_HOURS;
  return hour >= WORK_END_HOUR;
};
