import { API_ENDPOINTS } from "../constants";
import { ColombianHoliday } from "../types";

export const getHolidays = async (): Promise<ColombianHoliday[]> => {
  const response = await fetch(API_ENDPOINTS.COLOMBIAN_HOLIDAYS);
  if (!response.ok) {
    throw new Error(`Failed to fetch holidays: ${response.status}`);
  }
  const data: ColombianHoliday[] = await response.json();
  return data;
};
