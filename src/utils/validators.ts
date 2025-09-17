import { z, ZodType } from "zod";
import { zValidator as zValidatorHono } from "@hono/zod-validator";
import { ValidationTargets } from "hono/types";

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zValidatorHono(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: "InvalidParameters",
          message: JSON.parse(result.error.message)[0].message,
        },
        400,
      );
    }
    return;
  });

export const workingDaysSchema = z
  .object({
    days: z.coerce.number().int().positive().optional(),
    hours: z.coerce.number().int().positive().optional(),
    date: z.iso.datetime().optional(),
  })
  .refine((data) => data.days !== undefined || data.hours !== undefined, {
    message: "Either days or hours parameter is required",
    path: ["days", "hours"],
  });
