import { backupCompanyWebsites } from "./Companies/backupWebsites.js";
import { logProfileCreate, logProfileMarkAsError } from "./util/logger.js";
import "dotenv/config";
import mongoose from "mongoose";
import pm2 from "pm2";

const url = process.env.MONGO_URL || "mongodb://localhost:27017/BA";

void (async function main() {
  await mongoose.connect(url);
  await logProfileMarkAsError();

  try {
    const companyWebsiteLoggerId = await logProfileCreate(
      "Company Profile Backup",
      "automation"
    );
    console.log("Backup company websites");
    await backupCompanyWebsites(1, companyWebsiteLoggerId);
    // sleep for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } catch (err) {
    // handle error
  }
  pm2.connect(function (err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.restart("all", (err) => {
      pm2.disconnect(); // Disconnects from PM2
      if (err) throw err;
    });
  });
})();
