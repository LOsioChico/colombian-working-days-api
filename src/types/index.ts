import z from "zod";

import { workingDaysSchema } from "../utils/validators";

export type WorkingDaysInput = z.infer<typeof workingDaysSchema>;

export type ColombianHoliday = string & {
  readonly __brand: "ColombianHoliday";
};

export interface SetDateTimeProps {
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}
