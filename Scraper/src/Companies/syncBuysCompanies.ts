import { ObjectId } from "mongoose";
import Companies from "../Companies/Company.js";
import MetaView from "../Metas/MetaView.js";
import { createMetaView } from "../Metas/metaViewCreate.js";
import { normalizeURL } from "../util/normalizeURL.js";
import { updateCompaniesProcessStatus } from "./syncSellsCompanies.js";
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
          buyers: {
            $exists: true,
          },
        },
    },
    {
      $unwind: {
        path: "$buyers",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "buyers.url": {
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
          url: "$buyers.url",
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

  await insertBuyers(newCompanies);

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
          buyers: {
            $exists: true,
          },
        },
    },
    {
      $unwind: {
        path: "$buyers",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "buyers.url": {
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
          buyer: "$buyers",
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
          localField: "buyer.url",
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
        internetAddress: normalizeURL(entry.buyer.url),
        name: entry.buyer.name,
        country: entry.buyer.country,
        address: entry.buyer.address,
        buys: [
          {
            id: entry.id,
            source: entry.source,
          },
        ],
        contact: {
          email:
            entry.buyer.contact !== undefined
              ? entry.buyer.contact.email
              : undefined,
          phone:
            entry.buyer.contact !== undefined
              ? entry.buyer.contact.phone
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
          buyers: {
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
          buyer: "$buyers",
          source: "$source",
        },
    },
    {
      $match: {
        $and: [
          {
            "buyer.name": {
              $exists: true,
            },
            "buyer.url": {
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
          localField: "buyer.name",
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

  await insertBuyers(newCompanies);

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
          buyers: {
            $exists: true,
          },
        },
    },
    {
      $unwind: {
        path: "$buyers",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "buyers.url": {
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
          buyer: "$buyers",
          source: "$source",
        },
    },
    {
      $match: {
        $and: [
          {
            "buyer.name": {
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
          localField: "buyer.name",
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
        name: entry.buyer.name,
        country: entry.buyer.country,
        address: entry.buyer.address,
        buys: [
          {
            id: entry.id,
            source: entry.source,
          },
        ],
        contact: {
          email:
            entry.buyer.contact !== undefined
              ? entry.buyer.contact.email
              : undefined,
          phone:
            entry.buyer.contact !== undefined
              ? entry.buyer.contact.phone
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
            buys: company.buys[0],
          },
        },
        upsert: true,
      },
    };
  });

  await Companies.bulkWrite(operations);
};

const insertBuyers = async (newCompanies: any[]): Promise<void> => {
  await Companies.bulkWrite(
    Array.from(newCompanies, (x) => ({
      updateOne: {
        filter: { _id: x.companyId },
        update: {
          $addToSet: {
            buys: {
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

export const syncBuysCompanies = async (loggerId: ObjectId): Promise<void> => {
  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Creating meta view",
    loggerId,
  });

  await createMetaView();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Buys: Syncing companies with website",
    loggerId,
  });
  await insertCompaniesWithWebsite();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Buys: Syncing companies without website",
    loggerId,
  });

  await insertCompaniesWithoutWebsite();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Buys: Updating companies with website",
    loggerId,
  });

  await updateCompaniesWithWebsite();

  await updateCompaniesProcessStatus({
    status: "Running",
    message: "Buys: Updating companies without website",
    loggerId,
  });

  await updateCompaniesWithoutWebsite();

  await updateCompaniesProcessStatus({
    status: "Idle",
    message: "-",
    loggerId,
  });
};
