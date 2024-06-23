import { ObjectId } from "mongoose";
import { syncSellsCompanies } from "./syncSellsCompanies.js";
import { syncBuysCompanies } from "./syncBuysCompanies.js";
import { logCompanySuccess } from "../util/logger.js";

export const syncCompanies = async (loggerId: ObjectId): Promise<void> => {
  await syncSellsCompanies(loggerId);
  await syncBuysCompanies(loggerId);

  await logCompanySuccess(loggerId);
};
