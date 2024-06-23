import { ObjectId } from "mongoose";
import { normalizeURL } from "../util/normalizeURL.js";
import Companies from "./Company.js";
import { google } from "googleapis";
import {
  logSyncWebsiteMarkAsError,
  logUpdate,
  logWebsiteSuccess,
} from "../util/logger.js";
const customsearch = google.customsearch("v1");

const getCompanyFromId = async (
  id: ObjectId
): Promise<
  Array<{
    name: string;
    id: string;
    url?: string;
  }>
> => {
  const companiesWithoutWebsite: Array<{
    name: string;
    id: string;
    url?: string;
  }> = [];

  await Companies.aggregate([
    {
      $match: {
        _id: id,
      },
    },
  ]).then((docs) => {
    docs.forEach(
      (doc: { name: string; _id: string; internetAddress?: string }) => {
        companiesWithoutWebsite.push({
          name: doc.name,
          id: doc._id,
          url: doc.internetAddress,
        });
      }
    );
  });

  return companiesWithoutWebsite;
};

const getCompaniesWithoutWebsite = async (
  limit: number
): Promise<
  Array<{
    name: string;
    id: string;
  }>
> => {
  const companiesWithoutWebsite: Array<{
    name: string;
    id: string;
  }> = [];

  await Companies.aggregate([
    {
      $match: {
        internetAddress: {
          $exists: false,
        },
      },
    },
    { $limit: limit },
  ]).then((docs) => {
    docs.forEach((doc: { name: string; _id: string }) => {
      companiesWithoutWebsite.push({
        name: doc.name,
        id: doc._id,
      });
    });
  });

  return companiesWithoutWebsite;
};

const findWebsites = async (
  companiesWithoutWebsite: Array<{
    name: string;
    id: string;
  }>,
  loggerId: ObjectId
): Promise<
  Array<{ name: string; id: string; url?: string; status: "success" | "error" }>
> => {
  const foundWebsites: Array<{
    name: string;
    id: string;
    url?: string;
    status: "success" | "error";
  }> = [];

  for (let i = 0; i < companiesWithoutWebsite.length; i++) {
    const res = await customsearch.cse.list({
      cx: "369260ddb30d247b8",
      q: companiesWithoutWebsite[i].name,
      auth: process.env.SEARCH_API_KEY,
      fields: "items(title,displayLink)",
    });

    if (
      res.data.items != null &&
      res.data.items.length > 0 &&
      res.data.items[0]?.displayLink != null
    ) {
      foundWebsites.push({
        name: companiesWithoutWebsite[i].name,
        id: companiesWithoutWebsite[i].id,
        url: normalizeURL(res.data.items[0].displayLink),
        status: "success",
      });
    } else {
      foundWebsites.push({
        name: companiesWithoutWebsite[i].name,
        id: companiesWithoutWebsite[i].id,
        status: "error",
      });
    }

    await updateCompanySiteStatus({
      status: "Running",
      message: `Fetching websites for company ${i + 1} of ${
        companiesWithoutWebsite.length
      }`,
      loggerId,
    });
  }
  return foundWebsites;
};

const updateCompanyWebsites = async (
  foundWebsites: Array<{
    name: string;
    id: string;
    url?: string;
    status: "success" | "error";
  }>
): Promise<
  Array<{
    name: string;
    id: string;
    url?: string;
    status: "success" | "error";
  }>
> => {
  // Check if the company website is already in the database
  // If it is; add all the buyers and sellers to the found company
  // Then remove the company from the collection
  // If it is not; add website to the company

  const successWebsites = foundWebsites.filter(
    (website) => website.status === "success"
  );

  const updatedWebsites: Array<{
    name: string;
    id: string;
    url?: string;
    status: "success" | "error";
  }> = [];

  for await (const website of successWebsites) {
    const foundCompany: any = await Companies.findOne({
      internetAddress: website.url,
    });

    if (foundCompany != null) {
      const company: any = await Companies.findOne({
        _id: website.id,
      });

      if (company == null) {
        continue;
      }

      updatedWebsites.push({
        id: foundCompany.id,
        name: foundCompany.name,
        url: foundCompany.url,
        status: "success",
      });

      const addToSet: any = {};

      if (company.buys != null) {
        addToSet.buys = { $each: company.buys };
      }

      if (company.sells != null) {
        addToSet.sells = { $each: company.sells };
      }

      if (company.alternativeNames != null) {
        addToSet.alternativeNames = {
          $each: [...company.alternativeNames, company.name],
        };
      } else {
        addToSet.alternativeNames = {
          $each: [company.name],
        };
      }

      await Companies.updateOne(
        { internetAddress: website.url },
        {
          $addToSet: addToSet,
        }
      );

      await Companies.deleteOne({
        _id: website.id,
      });
    } else {
      updatedWebsites.push({
        id: website.id,
        name: website.name,
        url: website.url,
        status: "success",
      });
      await Companies.updateOne(
        { _id: website.id },
        {
          internetAddress: website.url,
        }
      );
    }
  }

  return updatedWebsites;
};

export const syncSpesificCompanyWebsites = async (
  id: ObjectId,
  loggerId: ObjectId
): Promise<
  Array<{
    id: string;
    name: string;
    url?: string;
    status: "success" | "error";
  }>
> => {
  await updateCompanySiteStatus({
    status: "Running",
    message: "Fetching companies without website",
    loggerId,
  });

  const companiesWithoutWebsite = await getCompanyFromId(id);

  if (companiesWithoutWebsite.length === 0) {
    await logSyncWebsiteMarkAsError(loggerId, "Invalid company id");
    return [
      {
        id: "",
        name: "",
        status: "error",
      },
    ];
  }

  const foundWebsites = await findWebsites(companiesWithoutWebsite, loggerId);

  if (foundWebsites.length === 0) {
    await logSyncWebsiteMarkAsError(loggerId, "Website not found");
    return [
      {
        id: "",
        name: "",
        status: "error",
      },
    ];
  }

  await updateCompanySiteStatus({
    status: "Running",
    message: "Updating company websites",
    loggerId,
  });

  const companyList = await updateCompanyWebsites(foundWebsites);

  await updateCompanySiteStatus({
    status: "Idle",
    message: "-",
    loggerId,
  });

  await logWebsiteSuccess(loggerId, companyList, 1);

  return companyList;
};

export const syncCompanyWebsites = async (
  limit: number,
  loggerId: ObjectId
): Promise<
  Array<{
    id: string;
    name: string;
    url?: string;
    status: "success" | "error";
  }>
> => {
  await updateCompanySiteStatus({
    status: "Running",
    message: "Fetching companies without website",
    loggerId,
  });

  const companiesWithoutWebsite = await getCompaniesWithoutWebsite(limit);
  const foundWebsites = await findWebsites(companiesWithoutWebsite, loggerId);

  await updateCompanySiteStatus({
    status: "Running",
    message: "Updating company websites",
    loggerId,
  });

  const companyList = await updateCompanyWebsites(foundWebsites);

  await updateCompanySiteStatus({
    status: "Idle",
    message: "-",
    loggerId,
  });

  await logWebsiteSuccess(loggerId, companyList, limit);

  return companyList;
};

let processStatus = {
  status: "Idle",
  message: "-",
};

// Update process status
const updateCompanySiteStatus = async (status: {
  status: string;
  message: string;
  loggerId: ObjectId;
}): Promise<void> => {
  await logUpdate(status.loggerId, status.message);
  processStatus = status;
};

export const getCompanySiteStatus = (): {
  status: string;
  message: string;
} => processStatus;
