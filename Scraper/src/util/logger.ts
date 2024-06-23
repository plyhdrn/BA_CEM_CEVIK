import { ObjectId } from "mongoose";
import Log, { ILog } from "../Log/Log.js";
import { isDate, lastDayOfMonth } from "date-fns/fp";

export const createLogger = async (log: ILog): Promise<ObjectId> => {
  const newLog = await Log.create(log);
  return newLog._id;
};

export const logCompanyCreate = async (
  name: string,
  startedBy: string
): Promise<ObjectId> => {
  if (startedBy !== "automation" && startedBy !== "manual") {
    throw new Error("Invalid startedBy");
  }

  const log: ILog = {
    type: "setup",
    startedBy,
    name,
    startDateTime: new Date(),
    status: "running",
    message: "Ted setup is starting",
    setupDetail: {
      source: "company",
    },
  };

  const objectId = await createLogger(log);
  return objectId;
};

export const logTedCreate = async (
  name: string,
  startedBy: "automation" | "manual",
  from: Date,
  to: Date
): Promise<ObjectId> => {
  if (!isDate(from) || !isDate(to)) {
    throw new Error("Invalid date");
  }

  const log: ILog = {
    type: "setup",
    startedBy,
    name,
    startDateTime: new Date(),
    status: "running",
    message: "Ted setup is starting",
    setupDetail: {
      source: "ted",
      from: from,
      to: to,
    },
  };

  const objectId = await createLogger(log);
  return objectId;
};

export const logBeschaCreate = async (
  name: string,
  startedBy: string,
  from: Date,
  to: Date
): Promise<ObjectId> => {
  if (!isDate(from) || !isDate(to)) {
    throw new Error("Invalid date");
  }

  if (startedBy !== "automation" && startedBy !== "manual") {
    throw new Error("Invalid startedBy");
  }

  const log: ILog = {
    type: "setup",
    startedBy,
    name,
    startDateTime: new Date(),
    status: "running",
    message: "Bescha setup is starting",
    setupDetail: {
      source: "bescha",
      from: from,
      to: lastDayOfMonth(to),
    },
  };

  const objectId = await createLogger(log);
  return objectId;
};

export const logProfileCreate = async (
  name: string,
  startedBy: "automation" | "manual"
): Promise<ObjectId> => {
  const log: ILog = {
    type: "profile",
    startedBy,
    name,
    startDateTime: new Date(),
    status: "running",
    message: "Profile is starting",
  };

  const objectId = await createLogger(log);
  return objectId;
};

export const logSyncWebsiteCreate = async (
  name: string,
  startedBy: "automation" | "manual"
): Promise<ObjectId> => {
  const log: ILog = {
    type: "website",
    startedBy,
    name,
    startDateTime: new Date(),
    status: "running",
    message: "Website sync is starting",
  };

  const objectId = await createLogger(log);
  return objectId;
};

export const logMatchingCreate = async (name: string): Promise<ObjectId> => {
  const log: ILog = {
    type: "matching",
    startedBy: "automation",
    name,
    startDateTime: new Date(),
    status: "running",
    message: "Matching is starting",
  };

  const objectId = await createLogger(log);
  return objectId;
};

export const logError = async (
  logId: ObjectId,
  message: string = "Operation has Failed"
): Promise<void> => {
  const log = await Log.findById(logId);
  log.status = "error";
  log.message = message;
  log.endDateTime = new Date();

  await log.save();
};

export const logSyncWebsiteMarkAsError = async (
  logId: ObjectId,
  message: string = "Operation has Failed"
): Promise<void> => {
  const log = await Log.findById(logId);
  log.status = "error";
  log.message = message;
  log.endDateTime = new Date();

  await log.save();
};

export const logProfileMarkAsError = async (): Promise<void> => {
  const log = await Log.find({ status: "running", type: "profile" });

  if (!log) {
    return;
  }

  for await (const l of log) {
    l.status = "error";
    l.message = "Operation has Failed";
    l.endDateTime = new Date();

    await l.save();
  }
};

export const logMarkAsError = async (): Promise<void> => {
  const log = await Log.find({ status: "running" });

  if (!log) {
    return;
  }

  for await (const l of log) {
    l.status = "error";
    l.message = "Operation has Failed";
    l.endDateTime = new Date();

    await l.save();
  }
};

export const logCompanySuccess = async (logId: ObjectId): Promise<void> => {
  await logSetupSuccess(logId, "Company");
};

export const logTedSuccess = async (logId: ObjectId): Promise<void> => {
  await logSetupSuccess(logId, "Ted");
};

export const logBeschaSuccess = async (logId: ObjectId): Promise<void> => {
  await logSetupSuccess(logId, "Bescha");
};

const logSetupSuccess = async (
  logId: ObjectId,
  setupName: string
): Promise<void> => {
  const log = await Log.findById(logId);
  log.status = "done";
  log.message = `${setupName} is done`;
  log.endDateTime = new Date();

  await log.save();
};

export const logMatchingSuccess = async (
  logId: ObjectId,
  matchingId: ObjectId
): Promise<void> => {
  const log = await Log.findById(logId);
  log.status = "done";
  log.message = "Matching is done";
  log.endDateTime = new Date();
  log.matchingDetail = { matchingId };

  await log.save();
};

export const logProfileSuccess = async (
  logId: ObjectId,
  companies: {
    id: ObjectId;
    url: string;
    name: string;
    status: "success" | "error";
  }[],
  size: number
): Promise<void> => {
  const log = await Log.findById(logId);
  log.status = "done";
  log.message = "Profile is done";
  log.endDateTime = new Date();
  log.profileDetail = { companies, size };

  await log.save();
};

export const logWebsiteSuccess = async (
  logId: ObjectId,
  companies: {
    id: string;
    url?: string;
    name: string;
    status: "success" | "error";
  }[],
  size: number
): Promise<void> => {
  const log = await Log.findById(logId);
  log.status = "done";
  log.message = "Website sync is done";
  log.endDateTime = new Date();
  log.websiteDetail = { companies, size };

  await log.save();
};

export const logUpdate = async (
  logId: ObjectId,
  message: string
): Promise<void> => {
  const log = await Log.findById(logId);
  log.message = message;

  await log.save();
};
