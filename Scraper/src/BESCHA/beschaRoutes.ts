import { RequestHandler, Router } from "express";
import {
  getBeschaProcessStatus,
  syncBeschaTimeFrame,
} from "./syncBeschaTimeFrame.js";
import { logBeschaCreate } from "../util/logger.js";
import { beschaSyncSchema } from "./Bescha.js";

const router: Router = Router();

router.get("/status", (async (req, res) => {
  res.json(getBeschaProcessStatus());
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
    beschaSyncSchema.parse({ startDate, endDate, shouldReset });
    const loggerId = await logBeschaCreate(
      "Bescha",
      "manual",
      new Date(startDate),
      endDate ? new Date(endDate) : new Date()
    );

    const r = await syncBeschaTimeFrame(
      new Date(startDate),
      loggerId,
      new Date(endDate),
      shouldReset === "true"
    );
    res.send(r);
  } catch (e) {
    res.status(400).send("Invalid parameters");
    return;
  }
}) as RequestHandler);

export const BeschaRoutes: Router = router;
