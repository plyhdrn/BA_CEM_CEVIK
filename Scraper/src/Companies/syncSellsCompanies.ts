import { ObjectId } from "mongoose";
import Companies from "../Companies/Company.js";
import MetaView from "../Metas/MetaView.js";
import { createMetaView } from "../Metas/metaViewCreate.js";
import { normalizeURL } from "../util/normalizeURL.js";
import { logUpdate } from "../util/logger.js";
import { blackListURLList } from "../util/blacklistURLs.js";

const updateCompaniesWithWebsite = async (): Promise<any[]> => {
  const newCompanies: any[] = [];

  await MetaView.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          sellers: {
            $exists: true,
          },
        },
    },
    {
      $unwind: {
        path: "$sellers",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "sellers.url": {
          $exists: true,
        },
      },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          id: "$entryId",
          url: "$sellers.url",
          source: "$source",
        },
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "companies",
          localField: "url",
          foreignField: "internetAddress",
          as: "result",
        },
    },
    {
      $match:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          result: {
            $size: 1,
          },
        },
    },
    {
      $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$result",
          preserveNullAndEmptyArrays: false,
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          id: "$result._id",
          entryId: "$id",
          source: "$source",
        },
    },
  ]).then((entries) => {
    entries.forEach((entry) => {
      newCompanies.push({
        companyId: entry.id,
        id: entry.entryId,
        source: entry.source,
      });
    });
  });

  await insertSellers(newCompanies);

  return newCompanies;
};

const insertCompaniesWithWebsite = async (): Promise<any[]> => {
  const newCompanies: any[] = [];

  await MetaView.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          sellers: {
            $exists: true,
          },
        },
    },
    {
      $unwind: {
        path: "$sellers",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "sellers.url": {
          $exists: true,
        },
      },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          id: "$entryId",
          seller: "$sellers",
          source: "$source",
        },
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "companies",
          localField: "seller.url",
          foreignField: "internetAddress",
          as: "result",
        },
    },
    {
      $match:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          result: {
            $size: 0,
          },
        },
    },
  ]).then((entries) => {
    entries.forEach((entry) => {
      newCompanies.push({
        internetAddress: normalizeURL(entry.seller.url),
        name: entry.seller.name,
        country: entry.seller.country,
        address: entry.seller.address,
        sells: [
          {
            id: entry.id,
            source: entry.source,
          },
        ],
        contact: {
          email:
            entry.seller.contact !== undefined
              ? entry.seller.contact.email
              : undefined,
          phone:
            entry.seller.contact !== undefined
              ? entry.seller.contact.phone
              : undefined,
        },
      });
    });
  });

  await insertCompany(newCompanies);

  return newCompanies;
};

const updateCompaniesWithoutWebsite = async (): Promise<any[]> => {
  const newCompanies: any[] = [];

  await MetaView.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          sellers: {
            $exists: true,
          },
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          id: "$entryId",
          seller: "$sellers",
          source: "$source",
        },
    },
    {
      $match: {
        $and: [
          {
            "seller.name": {
              $exists: true,
            },
            "seller.url": {
              $exists: false,
            },
          },
        ],
      },
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "companies",
          localField: "seller.name",
          foreignField: "name",
          as: "result",
        },
    },
    {
      $match:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          result: {
            $size: 1,
          },
        },
    },
    {
      $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$result",
          preserveNullAndEmptyArrays: false,
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          id: "$result._id",
          entryId: "$id",
          source: "$source",
        },
    },
  ]).then((entries) => {
    entries.forEach((entry) => {
      newCompanies.push({
        companyId: entry.id,
        id: entry.entryId,
        source: entry.source,
      });
    });
  });

  await insertSellers(newCompanies);

  return newCompanies;
};

const insertCompaniesWithoutWebsite = async (): Promise<any[]> => {
  const newCompanies: any[] = [];

  await MetaView.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          sellers: {
            $exists: true,
          },
        },
    },
    {
      $unwind: {
        path: "$sellers",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "sellers.url": {
          $exists: false,
        },
      },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          id: "$entryId",
          seller: "$sellers",
          source: "$source",
        },
    },
    {
      $match: {
        $and: [
          {
            "seller.name": {
              $exists: true,
            },
          },
        ],
      },
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "companies",
          localField: "seller.name",
          foreignField: "name",
          as: "result",
        },
    },
    {
      $match:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          result: {
            $size: 0,
          },
        },
    },
  ]).then((entries) => {
    entries.forEach((entry) => {
      newCompanies.push({
        name: entry.seller.name,
        country: entry.seller.country,
        address: entry.seller.address,
        sells: [
          {
            id: entry.id,
            source: entry.source,
          },
        ],
        contact: {
          email:
            entry.seller.contact !== undefined
              ? entry.seller.contact.email
              : undefined,
          phone:
            entry.seller.contact !== undefined
              ? entry.seller.contact.phone
              : undefined,
        },
      });
    });
  });

  await insertCompany(newCompanies);

  return newCompanies;
};

const insertCompany = async (newCompanies: any[]): Promise<void> => {
  // await Companies.insertMany(newCompany);

  const operations = newCompanies.map((company) => {
    const setOnInsertArr: {
      internetAddress?: string;
      name: string;
      country: string;
      address: string;
      contact: {
        email?: string;
        phone?: string;
      };
    } = {
      name: company.name,
      country: company.country,
      address: company.address,
      contact: company.contact,
    };

    if (
      company.internetAddress !== undefined &&
      company.internetAddress !== "" &&
      !blackListURLList.has(normalizeURL(company.internetAddress))
    ) {
      setOnInsertArr.internetAddress = normalizeURL(company.internetAddress);
    }

    const filter =
      setOnInsertArr.internetAddress !== undefined
        ? { internetAddress: company.internetAddress }
        : {
            $or: [
              { name: company.name },
              { alternativeNames: { $in: [company.name] } },
            ],
          };

    return {
      updateOne: {
        filter,
        update: {
          $setOnInsert: setOnInsertArr,
          $addToSet: {
            alternativeNames: company.name,
            sells: company.sells[0],
          },
        },
        upsert: true,
      },
    };
  });

  try {
    await Companies.bulkWrite(operations);
  } catch (e) {
    console.log(e);
  }
};

const insertSellers = async (newCompanies: any[]): Promise<void> => {
  await Companies.bulkWrite(
    Array.from(newCompanies, (x) => ({
      updateOne: {
        filter: { _id: x.companyId },
        update: {
          $addToSet: {
            sells: {
              id: x.id,
              source: x.source,
            },
          },
        },
        upsert: true,
      },
    }))
  );
};

export const syncSellsCompanies = async (loggerId: ObjectId): Promise<void> => {
  // Set process status to idle
  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Creating meta view",
    loggerId,
  });

  await createMetaView();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Sells: Syncing companies with website",
    loggerId,
  });
  await insertCompaniesWithWebsite();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Sells: Syncing companies without website",
    loggerId,
  });
  await insertCompaniesWithoutWebsite();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Sells: Updating companies with website",
    loggerId,
  });

  await updateCompaniesWithWebsite();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Sells: Updating companies without website",
    loggerId,
  });

  await updateCompaniesWithoutWebsite();

  await updateCompaniesProcessStatus({
    status: "Idle",
    message: "-",
    loggerId,
  });
};

let processStatus = {
  status: "Idle",
  message: "-",
};

// Update process status
export const updateCompaniesProcessStatus = async (status: {
  status: string;
  message: string;
  loggerId: ObjectId;
}): Promise<void> => {
  await logUpdate(status.loggerId, status.message);
  processStatus = status;
};

export const getCompaniesProcessStatus = (): {
  status: string;
  message: string;
} => processStatus;
