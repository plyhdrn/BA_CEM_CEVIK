import scrape from "website-scraper";
import archiver from "archiver";
import fs from "fs-extra";
import { normalizeURL } from "../util/normalizeURL.js";
import Companies from "./Company.js";
import { Duplex } from "stream";
import captureWebsite, { LaunchOptions } from "capture-website";
import mongoose, { ObjectId } from "mongoose";
import {
  logError,
  logProfileSuccess,
  logSyncWebsiteCreate,
  logUpdate,
} from "../util/logger.js";
import pTimeout from "p-timeout";
import { syncSpesificCompanyWebsites } from "./syncWebsites.js";

const bufferToStream = (buffer: Buffer) => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const getCompanyWebsiteUrl = async (
  id: ObjectId
): Promise<{
  id: ObjectId;
  url?: string;
  name?: string;
}> => {
  const company: any = await Companies.findOne({
    _id: id,
  }).exec();

  return {
    id: company._id,
    url: company.internetAddress,
    name: company.name,
  };
};

const getCompanyWebsiteUrls = async (
  limit: number
): Promise<
  Array<{
    id: ObjectId;
    url: string;
    name: string;
  }>
> => {
  //   const company = await Companies.findOne({
  //     internetAddress: { $exists: true },
  //   }).exec();
  const company = await Companies.aggregate([
    {
      $addFields:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          profile_count: {
            $size: {
              $ifNull: ["$profile", []],
            },
          },
        },
    },
    {
      $sort:
        /**
         * Provide any number of field/order pairs.
         */
        {
          profile_count: 1,
        },
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          internetAddress: {
            $exists: true,
            // Ensure the 'internetAddress' field exists
            $nin: ["", null], // Check that 'internetAddress' is not empty or null
          },
          name: {
            $nin: ["", null], // Check that 'name' is not empty or null
          },
        },
    },
    {
      $limit:
        /**
         * Provide the number of documents to limit.
         */
        limit,
    },
  ]);

  return company.map((c) => ({
    id: c._id,
    url: c.internetAddress,
    name: c.name,
  }));
};

const downloadWebsite = async (
  url: string,
  name: string,
  filename: string
): Promise<scrape.Resource[]> => {
  const output = fs.createWriteStream(filename);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  output.on("close", function () {
    return;
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
      console.log(err);
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on("error", function (err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  class MyPlugin {
    apply(registerAction: any) {
      registerAction(
        "saveResource",
        async ({
          resource,
        }: {
          resource: { getFilename: () => string; getText: () => string };
        }) => {
          const filename = resource.getFilename();
          const text = resource.getText();
          console.log("Saving resource", filename);
          archive.append(text, {
            name: filename,
          });
        }
      );
      registerAction("afterFinish", async () => {
        await archive.finalize();
      });
    }
  }

  const start = new Date().getTime();

  const options = {
    urls: [url],
    urlFilter: (returnedUrl: string) => {
      if (start + 1000 * 60 * 5 < new Date().getTime()) return false;
      return normalizeURL(url).startsWith(normalizeURL(returnedUrl));
    },
    directory: `./${name.replace(/[^\w\s]/gi, "")}`,
    recursive: true,
    maxRecursiveDepth: 10,
    filenameGenerator: "bySiteStructure",
    sources: [],
    plugins: [new MyPlugin()],
  };

  return scrape(options);
};

const downloadAndUploadImage = async (
  url: string,
  name: string
): Promise<string> => {
  const gridSFBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });

  const uploadStream = gridSFBucket.openUploadStream(name);
  const id = uploadStream.id;

  const launchOptions: LaunchOptions = {
    ignoreHTTPSErrors: true,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };

  if (process.env.NODE_ENV === "production") {
    launchOptions.executablePath = "/usr/bin/google-chrome";
  }

  const buffer = await captureWebsite
    .buffer(url, {
      fullPage: true,
      launchOptions,
    })
    .catch((e) => {
      console.log(e);
      return null;
    });

  return await new Promise((resolve, reject) => {
    if (!buffer) {
      reject();
      return;
    }

    const readStream = bufferToStream(buffer as Buffer);

    readStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      resolve(id.toString());
    });

    uploadStream.on("error", () => {
      console.log("error");
      reject();
    });
  });
};

const saveCompanyWebsiteToDB = async (
  id: string,
  filename: string,
  imageId: string
): Promise<void> => {
  await Companies.updateOne(
    { _id: id },
    {
      $push: {
        profile: {
          date: new Date(),
          filename,
          imageId,
        },
      },
    },
    { upsert: true }
  );
};

const deleteCompanyWebsiteFromDB = async (id: string) => {
  await Companies.updateOne(
    { _id: id },
    {
      $unset: {
        internetAddress: 1,
      },
    }
  );
};

const saveCompanyWebsite = async (
  id: string,
  url: string,
  name: string,
  loggerId: ObjectId
): Promise<void> => {
  const normalizedUrl = normalizeURL(url);
  const folder = `./websiteContents/${name.replace(/[^\w\s]/gi, "")}`;
  const filename = `${folder}/${name.replace(/[^\w\s]/gi, "")}-${new Date().getTime()}.zip`;
  fs.ensureDirSync(folder);

  await updateCompanyBackupStatus({
    status: "Running",
    message: `Fetching ${url}`,
    loggerId,
  });

  const promise = downloadWebsite(normalizedUrl, name, filename);

  // Timeout after 5 minutes
  await pTimeout(promise, {
    milliseconds: 1000 * 60 * 5,
  })
    .then(async () => {
      const imageId = await downloadAndUploadImage(normalizedUrl, name);
      await saveCompanyWebsiteToDB(id, filename, imageId);
    })
    .catch(async (e) => {
      await deleteCompanyWebsiteFromDB(id);
      console.log("Error downloading website", e);
      throw e;
    });
};

export const backupCompanyWebsites = async (
  limit: number,
  loggerId: ObjectId
): Promise<
  Array<{
    name: string;
    url: string;
    id: ObjectId;
    status: "success" | "error";
  }>
> => {
  await updateCompanyBackupStatus({
    status: "Running",
    message: "Fetching company websites",
    loggerId,
  });

  const savedCompanies: Array<{
    name: string;
    url: string;
    id: ObjectId;
    status: "success" | "error";
  }> = [];

  const companyUrls = await getCompanyWebsiteUrls(limit);

  let i = 0;

  for (const { id, url, name } of companyUrls) {
    await saveCompanyWebsite(id.toString(), url, name, loggerId)
      .then(() => {
        savedCompanies.push({
          name,
          url,
          id,
          status: "success",
        });
      })
      .catch((e) => {
        savedCompanies.push({
          name,
          url,
          id,
          status: "error",
        });
        console.log("Error saving company website");
        console.log(e);
      });
    i++;

    await updateCompanyBackupStatus({
      status: "Running",
      message: `Backing up website for ${name} queue ${i} of ${companyUrls.length}`,
      loggerId,
    });
  }

  await updateCompanyBackupStatus({
    status: "Idle",
    message: "-",
    loggerId,
  });

  await logProfileSuccess(loggerId, savedCompanies, limit);

  return savedCompanies;
};

export const backupSpecificCompanyWebsite = async (
  id: ObjectId,
  loggerId: ObjectId
): Promise<
  Array<{
    name: string;
    url: string;
    id: ObjectId;
    status: "success" | "error";
  }>
> => {
  await updateCompanyBackupStatus({
    status: "Running",
    message: "Fetching company websites",
    loggerId,
  });

  const savedCompanies: Array<{
    name: string;
    url: string;
    id: ObjectId;
    status: "success" | "error";
  }> = [];

  let companyUrl = await getCompanyWebsiteUrl(id);

  if (!companyUrl || !companyUrl.name) {
    savedCompanies.push({
      name: "",
      url: "",
      id,
      status: "error",
    });

    await logError(loggerId, "Invalid company id");

    return savedCompanies;
  }

  if (!companyUrl.url) {
    const loggerId = await logSyncWebsiteCreate(
      "Company Manual Website Finder",
      "manual"
    );
    await syncSpesificCompanyWebsites(id, loggerId);
  }

  companyUrl = await getCompanyWebsiteUrl(id);

  if (!companyUrl.url || !companyUrl.name) {
    savedCompanies.push({
      name: companyUrl.name || "",
      url: "",
      id,
      status: "error",
    });

    await logError(loggerId, "Company does not have a website");

    return savedCompanies;
  }

  const { url, name } = companyUrl;

  await saveCompanyWebsite(id.toString(), url, name, loggerId)
    .then(() => {
      savedCompanies.push({
        name,
        url,
        id,
        status: "success",
      });
    })
    .catch((e) => {
      savedCompanies.push({
        name,
        url,
        id,
        status: "error",
      });
      console.log("Error saving company website");
      console.log(e);
    });

  await updateCompanyBackupStatus({
    status: "Running",
    message: `Backing up website for ${name} queue 1 of 1`,
    loggerId,
  });

  await updateCompanyBackupStatus({
    status: "Idle",
    message: "-",
    loggerId,
  });

  await logProfileSuccess(loggerId, savedCompanies, 1);

  return savedCompanies;
};

let processStatus = {
  status: "Idle",
  message: "-",
};

// Update process status
const updateCompanyBackupStatus = async (status: {
  status: string;
  message: string;
  loggerId: ObjectId;
}): Promise<void> => {
  await logUpdate(status.loggerId, status.message);
  processStatus = status;
};

export const getCompanyBackupStatus = (): {
  status: string;
  message: string;
} => processStatus;
