import { Hono } from "hono";
import { workingDaysSchema, zValidator } from "../utils/validators";
import { calculateWorkingDays } from "../services/working-days.service";
import { WorkingDaysInput } from "../types";
import { getHolidays } from "../services/holidays.service";

const workingDaysController = new Hono();

workingDaysController.get(
  "/",
  zValidator("query", workingDaysSchema),
  async (c) => {
    try {
      const input = c.req.valid("query") as WorkingDaysInput;
      const holidays = await getHolidays();
      const result = await calculateWorkingDays(input, holidays);
      return c.json({ date: result }, 200);
    } catch {
      return c.json(
        {
          error: "InternalError",
          message: "Failed to calculate working days",
        },
        500,
      );
    }
  },
);

export default workingDaysController;
