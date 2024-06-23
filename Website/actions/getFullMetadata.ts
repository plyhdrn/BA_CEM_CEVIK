"use server";

import dbConnect from "@/lib/dbConnect";
import Bescha from "@/models/Bescha";
import Meta from "@/models/Meta";
import Ted from "@/models/Ted";

interface SearchParams extends URLSearchParams {
  search?: string;
  source?: string;
  from?: string;
  to?: string;
  amount?: string;
  seller?: string;
  page?: string;
  sort?: "relevant" | "newest" | "oldest" | "az" | "za";
}

export default async function getFullMetadata(
  searchParams: SearchParams
): Promise<any> {
  await dbConnect();

  const sP = new URLSearchParams(searchParams);

  const search = sP.get("search");
  const source = sP.get("source");
  const from = sP.get("from");
  const to = sP.get("to");
  const amount = sP.get("amount");
  const seller = sP.get("seller");
  const sort = sP.get("sort");
  const page = sP.get("page");

  const searchQuery = {
    title: search ? { $regex: ".*" + search + ".*" } : { $exists: true },
    source:
      source === "both" || source === null
        ? { $in: ["bescha", "ted"] }
        : source,
  };

  if (from != null) {
    searchQuery["publishDate"] = { $gte: from };
  }

  if (to != null) {
    searchQuery["publishDate"] = { $lte: to };
  }

  if (amount != null) {
    searchQuery["amount.amount"] = { $gt: parseFloat(amount) };
  }

  if (seller != null) {
    searchQuery["sellers"] = { $exists: true };
  }

  let sortQuery;

  if (sort === "newest") {
    sortQuery = { publishDate: -1 };
  } else if (sort === "oldest") {
    sortQuery = { publishDate: 1 };
  } else if (sort === "az") {
    sortQuery = { title: 1 };
  } else if (sort === "za") {
    sortQuery = { title: -1 };
  }

  const aggregate = [
    {
      $match:
        /**
         * query: The query in MQL.
         */
        searchQuery,
    },
  ];

  if (sort) {
    aggregate.push({
      $sort: sortQuery,
    });
  }

  const meta = await Meta.aggregate(aggregate);

  return meta;
}
