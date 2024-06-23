import { RequestHandler, Router } from "express";
import { getCompaniesProcessStatus } from "./syncSellsCompanies.js";
import {
  getCompanySiteStatus,
  syncCompanyWebsites,
  syncSpesificCompanyWebsites,
} from "./syncWebsites.js";
import {
  backupCompanyWebsites,
  backupSpecificCompanyWebsite,
  getCompanyBackupStatus,
} from "./backupWebsites.js";
import Company, {
  companyIdAndFilenameSchema,
  companyLimitSchema,
} from "./Company.js";
import mongoose, { ObjectId } from "mongoose";
import {
  logCompanyCreate,
  logProfileCreate,
  logSyncWebsiteCreate,
} from "../util/logger.js";
import { syncCompanies } from "./syncCompanies.js";
import { idSchema } from "../util/schemas.js";

const router: Router = Router();

router.get("/", (async (req, res) => {
  const loggerId = await logCompanyCreate("Companies", "manual");

  await syncCompanies(loggerId);

  res.sendStatus(200);
}) as RequestHandler);

router.get("/status", (async (req, res) => {
  res.json(getCompaniesProcessStatus());
}) as RequestHandler);

router.get("/site", (async (req, res) => {
  const {
    limit,
  }: {
    limit?: string;
  } = req.query;

  try {
    const parsedLimit = companyLimitSchema.parse({ limit });

    const loggerId = await logSyncWebsiteCreate(
      "Company Website Finder",
      "manual"
    );

    const result = await syncCompanyWebsites(parsedLimit.limit, loggerId);
    res.json(result);
  } catch (e) {
    res.status(400).send("Invalid limit");
    return;
  }
}) as RequestHandler);

router.get("/site/status", (async (req, res) => {
  res.json(getCompanySiteStatus());
}) as RequestHandler);

router.post("/site/create", (async (req, res) => {
  const {
    id,
  }: {
    id?: string;
  } = req.query;

  try {
    idSchema.parse({ id });

    const loggerId = await logSyncWebsiteCreate(
      "Company Manual Website Finder",
      "manual"
    );

    const ida: any = new mongoose.Types.ObjectId(id);

    const result = await syncSpesificCompanyWebsites(ida as ObjectId, loggerId);
    res.json(result);
  } catch (e) {
    res.status(400).send("Invalid limit");
    return;
  }
}) as RequestHandler);

router.post("/backup/create", (async (req, res) => {
  const {
    id,
  }: {
    id?: string;
  } = req.query;

  // Check if the id is a valid ObjectId
  try {
    idSchema.parse({ id });

    const loggerId = await logProfileCreate(
      "Company Manual Profile Backup",
      "manual"
    );

    const ida: any = new mongoose.Types.ObjectId(id);

    const result = await backupSpecificCompanyWebsite(
      ida as ObjectId,
      loggerId
    );

    res.json(result);
  } catch (e) {
    res.status(400).send("Invalid id");
    return;
  }
}) as RequestHandler);

router.get("/backup", (async (req, res) => {
  const {
    limit,
  }: {
    limit?: string;
  } = req.query;

  try {
    const parsedLimit = companyLimitSchema.parse({ limit });

    const loggerId = await logProfileCreate("Company Profile Backup", "manual");

    const result = await backupCompanyWebsites(parsedLimit.limit, loggerId);

    res.json(result);
  } catch (e) {
    res.status(400).send("Invalid limit");
    return;
  }
}) as RequestHandler);

router.get("/backup/status", (async (req, res) => {
  res.json(getCompanyBackupStatus());
}) as RequestHandler);

router.get("/backup/download", (async (req, res) => {
  const {
    id,
    filename,
  }: {
    id?: string;
    filename?: string;
  } = req.query;

  try {
    companyIdAndFilenameSchema.parse({ id, filename });

    const company: any = await Company.findOne({
      _id: id,
    });

    if (company == null) {
      res.status(404).send("Company not found");
      return;
    }

    if (company.profile == null) {
      res.status(404).send("Company profile not found");
      return;
    }

    const selectedFile = company.profile.find(
      (w: any) => w.filename === filename
    );

    console.log(selectedFile);
    if (!selectedFile) {
      res.status(404).send("File not found");
      return;
    }

    res.download(selectedFile.filename);
  } catch (e) {
    res.status(400).send("Invalid id or filename");
    return;
  }
}) as RequestHandler);

router.get("/backup/image", (async (req, res) => {
  const { id, filename } = req.query;

  try {
    companyIdAndFilenameSchema.parse({ id, filename });

    const company: any = await Company.findOne({
      _id: id,
    });

    if (!company) {
      res.status(404).send("Company not found");
      return;
    }

    if (company.profile == null) {
      res.status(404).send("Company profile not found");
      return;
    }

    const selectedImage = company.profile.find(
      (w: any) => w.filename === filename
    );

    if (!selectedImage) {
      res.status(404).send("Image not found");
      return;
    }

    const gridSFBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "images",
      }
    );

    const downloadStream = gridSFBucket.openDownloadStream(
      new mongoose.Types.ObjectId(selectedImage.imageId)
    );

    downloadStream.pipe(res);
  } catch (e) {
    res.status(400).send("Invalid id or filename");
    return;
  }
}) as RequestHandler);

export const CompanyRoutes: Router = router;
