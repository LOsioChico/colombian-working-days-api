import { Hono } from "hono";
import { workingDaysSchema, zValidator } from "../utils/validators";

const workingDaysController = new Hono();

workingDaysController.get("/", zValidator("query", workingDaysSchema), (c) => {
  const { days, hours, date } = c.req.valid("query");
  console.log({ days, hours, date });

  return c.json({}, 200);
});

export default workingDaysController;
