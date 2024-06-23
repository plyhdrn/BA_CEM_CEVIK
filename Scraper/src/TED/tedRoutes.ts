import { RequestHandler, Router } from "express";
import { getTedProcessStatus, syncTedTimeFrame } from "./syncTedTimeFrame.js";
import { logTedCreate } from "../util/logger.js";
import { tedSyncSchema } from "./Ted.js";

const router: Router = Router();

router.get("/status", (async (req, res) => {
  res.json(getTedProcessStatus());
}) as RequestHandler);

router.get("/", (async (req, res) => {
  const {
    startDate,
    endDate,
    shouldReset,
  }: {
    startDate: string;
    endDate: string;
    shouldReset?: string;
  } = req.query as {
    startDate: string;
    endDate: string;
    shouldReset?: string;
  };

  try {
    tedSyncSchema.parse({ startDate, endDate, shouldReset });

    const loggerId = await logTedCreate(
      "Ted",
      "manual",
      new Date(startDate),
      endDate ? new Date(endDate) : new Date()
    );

    const r = await syncTedTimeFrame(
      startDate,
      loggerId,
      endDate,
      shouldReset === "true"
    );

    res.send(r);
  } catch (e) {
    res.status(400).send("Invalid input");
    return;
  }
}) as RequestHandler);

export const TedRoutes: Router = router;
