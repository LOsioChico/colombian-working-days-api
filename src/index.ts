import { Hono } from "hono";

import workingDaysController from "./constrollers/working-days.controller";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/working-days", workingDaysController);

export default app;
