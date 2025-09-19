export interface WorkingDaysInput {
  days?: number;
  hours?: number;
  date?: string;
}

export type ColombianHoliday = { __brand: "ColombianHoliday" } & string;
