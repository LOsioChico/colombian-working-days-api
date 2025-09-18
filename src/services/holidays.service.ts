import { API_ENDPOINTS } from "../constants";

export const getHolidays = async (): Promise<string[]> => {
  const response = await fetch(API_ENDPOINTS.COLOMBIAN_HOLIDAYS);
  const data = await response.json();
  return data as string[];
};
