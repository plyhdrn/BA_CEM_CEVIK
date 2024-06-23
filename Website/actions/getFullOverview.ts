"use server";

import dbConnect from "@/lib/dbConnect";
import Bescha from "@/models/Bescha";
import Meta from "@/models/Meta";
import Ted from "@/models/Ted";
import getFullMetadata from "./getFullMetadata";

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

export default async function getFullOverview(
  searchParams: SearchParams
): Promise<any> {
  const meta = await getFullMetadata(searchParams);

  const teds = meta.filter((m) => m.source === "ted").map((m) => m.entryId);
  const beschas = meta
    .filter((m) => m.source === "bescha")
    .map((m) => m.entryId);

  const collection = [];

  if (teds.length > 0) {
    const tedEntries = await Ted.find({ "publication-number": { $in: teds } });
    collection.push(...tedEntries);
  }

  if (beschas.length > 0) {
    const beschaEntries = await Bescha.find({
      "releases.id": { $in: beschas },
    });
    collection.push(...beschaEntries);
  }

  return collection;
}
