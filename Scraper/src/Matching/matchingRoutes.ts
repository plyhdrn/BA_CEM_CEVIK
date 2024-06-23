import { RequestHandler, Router } from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import { isValidExtension, startMatching } from "./matchingStarter.js";
import { logMatchingCreate, logError } from "../util/logger.js";
import Matching from "./Matching.js";
import { idSchema } from "../util/schemas.js";

const router: Router = Router();
router.get("/status", (async (req, res) => {
  res.json({ status: "OK" });
}) as RequestHandler);

router.get("/download", (async (req, res) => {
  const {
    id,
  }: {
    id?: string;
  } = req.query;

  try {
    idSchema.parse({ id });

    const matching = await Matching.findOne({
      _id: id,
    });

    if (matching == null) {
      res.status(404).send("Matching not found");
      return;
    }

    if (matching.outputFile == null) {
      res.status(404).send("File not found");
      return;
    }

    // Check if the file exists
    const filePath = `./src/Matching/matches/${matching.outputFile}`;
    if (!fs.existsSync(filePath)) {
      res.status(404).send("File not found");
      return;
    }

    res.download(filePath);
  } catch (e) {
    res.status(400).send("Invalid id");
    return;
  }
}) as RequestHandler);

router.post("/upload", (async (req, res) => {
  // If the folder doesn't exist, create it
  fs.mkdirSync("./src/Matching/matches", { recursive: true });

  let file;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "file") is used to retrieve the uploaded file
  file = req.files.file as fileUpload.UploadedFile;

  // Check for file extension
  if (!isValidExtension(file.name)) {
    return res.status(400).send("Invalid file extension");
  }

  // To block multiple file uploads with the same name and overwrite the previous one
  // We are using the current timestamp as the file name
  const tempFileName = new Date().getTime() + ".db";
  const fileName = file.name || tempFileName;

  const loggerId = await logMatchingCreate(fileName);

  try {
    await file.mv(`./src/Matching/matches/${tempFileName}`);
    const matches = await startMatching(tempFileName, fileName, loggerId);

    return res.json({ result: matches });
  } catch (err) {
    console.error(err);

    fs.rmSync(`./src/Matching/matches/${tempFileName}`);
    await logError(loggerId, "Error while uploading file");

    return res.status(400).send({ error: "Error while uploading file" });
  }
}) as RequestHandler);

export const MatchingRoutes: Router = router;
