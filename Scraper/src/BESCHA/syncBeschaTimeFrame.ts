// @ts-ignore
import etl from "etl";
import fs from "fs";
import { Error, ObjectId } from "mongoose";
import Bescha from "./Bescha.js";
import unzipper from "unzipper";
import { createBeschaMeta } from "./beschaMeta.js";
import { logBeschaSuccess, logError, logUpdate } from "../util/logger.js";

// This function adds a given number of months to a given date
const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const isDate = (val: any): boolean => !isNaN(new Date(val).getTime());

// Create array of months to be scraped
// It should start from the given date and end at the current date
// The array should contain the months in the format "YYYY-MM"
// Example: ["2023-10", "2023-11", "2023-12"]
const createMonthArray = (startDate: Date, endDate?: Date): string[] => {
  const months = [];
  const currentDate =
    isDate(endDate) && endDate !== undefined ? endDate : new Date();
  while (startDate <= currentDate) {
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    months.push(`${year}-${month.toString().padStart(2, "0")}`);
    startDate = addMonths(startDate, 1);
  }
  return months;
};

// This function downloads the OCDS files for the given "YYYY-MM" month
// It should return the file name of the downloaded file in the format "notices_YYYY-MM_OCDS.zip"
// If an error occurs, it should throw an error with the message "Failed to download OCDS files for {date}"
const downloadOCDSFiles = async (date: string): Promise<string> => {
  const response = await fetch(
    `https://www.oeffentlichevergabe.de/api/notice-exports?pubMonth=${date}&format=ocds.zip`,
    {
      headers: {
        accept: "application/vnd.bekanntmachungsservice.ocds.zip+zip",
      },
    }
  );

  if (response.body == null) {
    throw new Error(`Failed to download OCDS files for ${date}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(
    `./src/BESCHA/sync/notices_${date}_OCDS.zip`,
    Buffer.from(buffer)
  );

  return `notices_${date}_OCDS.zip`;
};

// Download the OCDS files for each month
const OCDSFileDownload = async (
  months: string[],
  loggerId: ObjectId
): Promise<string[]> => {
  const results = [];
  for await (const month of months) {
    try {
      const result = await downloadOCDSFiles(month);
      results.push(result);
      // Update process status
      await updateProcessStatus({
        status: "Running",
        message: `${results.length}/${months.length} files downloaded`,
        loggerId,
      });
    } catch (error) {
      await logError(loggerId, "Error downloading files");
      console.error(error);
    }
  }

  // Update process status
  await updateProcessStatus({
    status: "Running",
    message: `Finished downloading files`,
    loggerId,
  });

  return results;
};

// Remove all documents from the "bescha" collection
const removeOldDocuments = async (loggerId: ObjectId): Promise<void> => {
  // Update process status
  await updateProcessStatus({
    status: "Running",
    message: `Removing old documents`,
    loggerId,
  });

  await Bescha.deleteMany({}).catch((error: Error) => {
    console.error(error);
  });
};

// Add the downloaded OCDS file to the "bescha" collection
const addOCDSFileToCollection = async (file: string): Promise<void> => {
  const entries: any[] = [];

  await fs
    .createReadStream(`./src/BESCHA/sync/${file}`)
    .pipe(unzipper.Parse())
    .pipe(
      etl.map(async (file: unzipper.Entry) => {
        const fileName = file.path as string;
        const type = file.type;

        if (type === "File" && fileName.endsWith(".json")) {
          const content: Buffer = await file.buffer();
          const jsonData = JSON.parse(content.toString());
          entries.push(jsonData);
        } else {
          file.autodrain();
        }
      })
    )
    .promise()
    .catch((error: Error) => {
      console.error(error);
    });

  // await Bescha.insertMany(entries).catch(function (err) {
  //   console.log(err);
  // });
  // If entry already exists, update it
  await Bescha.bulkWrite(
    entries.map((entry) => ({
      updateOne: {
        filter: { ocid: entry.releases[0].ocid },
        update: entry,
        upsert: true,
      },
    }))
  ).catch((error: Error) => {
    console.error(error);
  });
};

// Add the downloaded OCDS files to the "bescha" collection
const addOCDSFilesToCollection = async (
  files: string[],
  loggerId: ObjectId
): Promise<string[]> => {
  // Update process status
  await updateProcessStatus({
    status: "Running",
    message: `Adding files to collection`,
    loggerId,
  });

  const results = [];
  for await (const file of files) {
    try {
      await addOCDSFileToCollection(file);
      results.push(file);
      // Update process status
      await updateProcessStatus({
        status: "Running",
        message: `${results.length}/${files.length} files added to collection`,
        loggerId,
      });
    } catch (error) {
      await logError(loggerId, "Error adding files to collection");
      console.error(error);
    }
  }

  return results;
};

// Update process status
const updateProcessStatus = async (status: {
  status: string;
  message: string;
  loggerId: ObjectId;
}): Promise<void> => {
  await logUpdate(status.loggerId, status.message);
  processStatus = status;
};

export const syncBeschaTimeFrame = async (
  startDate: Date,
  loggerId: ObjectId,
  endDate?: Date,
  shouldReset: boolean = false
): Promise<string[]> => {
  // Set process status to idle
  await updateProcessStatus({
    status: "Running",
    message: "Starting sync process",
    loggerId,
  });

  const months = createMonthArray(startDate, endDate);
  // console.log(months);

  // Remove the old sync folder and create a new one
  fs.rmSync("./src/BESCHA/sync", { recursive: true, force: true });
  fs.mkdirSync("./src/BESCHA/sync", { recursive: true });
  // Download the OCDS files for each month
  const results = await OCDSFileDownload(months, loggerId);

  await createBeschaMeta();

  // Remove all documents from the "bescha" collection
  if (shouldReset) {
    await removeOldDocuments(loggerId);
  }

  // Add the downloaded OCDS files to the "bescha" collection
  await addOCDSFilesToCollection(results, loggerId);

  // Set process status to idle
  await updateProcessStatus({
    status: "Idle",
    message: "-",
    loggerId,
  });

  await logBeschaSuccess(loggerId);

  return months;
};

let processStatus = {
  status: "Idle",
  message: "-",
};

export const getBeschaProcessStatus = (): {
  status: string;
  message: string;
} => processStatus;
