import express from "express";
import { syncBeschaTimeFrame } from "./BESCHA/syncBeschaTimeFrame.js";
import { syncTedTimeFrame } from "./TED/syncTedTimeFrame.js";
import mongoose from "mongoose";
import { syncCompanyWebsites } from "./Companies/syncWebsites.js";
import cron from "node-cron";
import { format } from "date-fns";
import "dotenv/config";
import { MainRouter } from "./routes/index.js";
import fileUpload from "express-fileupload";
import {
  logBeschaCreate,
  logCompanyCreate,
  logMarkAsError,
  logSyncWebsiteCreate,
  logTedCreate,
} from "./util/logger.js";
import { syncCompanies } from "./Companies/syncCompanies.js";
const app = express();

const port = 3001;

cron.schedule("0 0 3 * * *", async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const beschaLoggerId = await logBeschaCreate(
    "Bescha",
    "automation",
    yesterday,
    new Date()
  );

  await syncBeschaTimeFrame(yesterday, beschaLoggerId);

  const tedLoggerId = await logTedCreate(
    "Ted",
    "automation",
    yesterday,
    new Date()
  );

  await syncTedTimeFrame(format(yesterday, "MM-dd-yyyy"), tedLoggerId);

  const companyLoggerId = await logCompanyCreate("Company", "automation");

  await syncCompanies(companyLoggerId);

  const companyWebsiteLoggerId = await logSyncWebsiteCreate(
    "Company Website Finder",
    "automation"
  );

  await syncCompanyWebsites(10, companyWebsiteLoggerId);
});

app.use((req, res, next) => {
  const apiKey = req.get("API-KEY");
  if (req.path.startsWith("/company/backup/image")) {
    next();
    return;
  }

  if (
    apiKey === null ||
    apiKey === undefined ||
    apiKey !== process.env.API_KEY
  ) {
    res.status(401).json({ error: "Unauthorised" });
  } else {
    next();
  }
});

app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, //10mb
    },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
  })
);

app.use("/", MainRouter);

app.listen(port, async () => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/BA";
  await mongoose.connect(url);
  await logMarkAsError();
  console.log(`Example app listening on port ${port}`);
});
