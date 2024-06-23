import ResultPagination from "@/components/resultPagination";
import React from "react";
import Table from "../table";
import Log from "@/models/Log";
import Matching from "@/models/Matching";
import SearchResultInfo from "@/components/searchResultInfo";
import { Separator } from "@/components/ui/separator";
interface SearchParams extends URLSearchParams {
  search?: string;
  page?: string;
}

const MatchingResWrapper = async ({
  searchParams,
}: {
  searchParams?: SearchParams;
}) => {
  const options = {
    page: searchParams?.page || 1,
    limit: 10,
  };

  const logAggregate = Log.aggregate();

  const match = {
    type: "matching",
  };

  if (searchParams?.search) {
    match.name = { $regex: ".*" + searchParams?.search + ".*", $options: "i" };
  }

  const m = Log.aggregate([
    {
      $match: match,
    },
    {
      $sort: { startDateTime: -1 },
    },
  ]);

  const {
    docs: log,
    totalDocs,
    totalPages,
  } = await Log.aggregatePaginate(m, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  const logLookup = [];

  for await (const entry of log) {
    if (
      entry.matchingDetail &&
      entry.matchingDetail.matchingId &&
      entry.status === "done"
    ) {
      const logEntry = await Matching.findById(entry.matchingDetail.matchingId);
      entry.matchingDetail = logEntry;
      logLookup.push(entry);
      continue;
    }
    logLookup.push(entry);
  }

  return (
    <>
      {log.length > 0 && (
        <div className="flex flex-col w-full mt-4">
          <SearchResultInfo
            totalDocs={totalDocs}
            totalPages={totalPages}
            searchParams={searchParams}
          />
          <Separator className="my-2" />
        </div>
      )}
      <Table
        res={JSON.parse(JSON.stringify(logLookup))}
        page={searchParams?.page}
      />
      {log.length === 0 && (
        <div className="flex justify-center p-5">
          <span className="text-md font-semibold">No data found</span>
        </div>
      )}
      {log.length > 0 && (
        <div className="mb-4">
          <ResultPagination
            searchParams={searchParams}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
};

export default MatchingResWrapper;
