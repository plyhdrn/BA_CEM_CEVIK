import dbConnect from "@/lib/dbConnect";
import Bescha, { IBescha } from "@/models/Bescha";
import ResultBeschaCard from "./resultBeschaCard";
import Ted, { ITed } from "@/models/Ted";
import ResultTedCard from "./resultTedCard";
import Meta, { IMetaView } from "@/models/Meta";
import ResultCard from "./resultCard";
import ExportButton from "./exportButton";
import { Separator } from "./ui/separator";
import ExportOverviewDetail from "./exportOverviewDetail";
import getOverviewDetail from "@/actions/getOverviewDetail";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import ResultPagination from "./resultPagination";
import { Fade } from "react-awesome-reveal";
import ResultCardWrapper from "./resultCardWrapper";
import SearchResultInfo from "./searchResultInfo";
import ResultSorter from "./resultSorter";
import getFullOverview from "@/actions/getFullOverview";
import getFullMetadata from "@/actions/getFullMetadata";

interface SearchParams extends URLSearchParams {
  search?: string;
  source?: string;
  from?: string;
  to?: string;
  amount?: string;
  page?: string;
  seller?: string;
  sort?: "relevant" | "newest" | "oldest" | "az" | "za";
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Results = async ({ searchParams }: { searchParams?: SearchParams }) => {
  await dbConnect();

  if (!searchParams?.search) return <div></div>;

  const fetchOverviewDetail = async (searchParams: SearchParams) => {
    "use server";
    const data = await getFullOverview(searchParams);

    return JSON.stringify(data);
  };
  const fetchMetaDetail = async (searchParams: SearchParams) => {
    "use server";
    const data = await getFullMetadata(searchParams);

    return JSON.stringify(data);
  };

  const options = {
    page: searchParams?.page || 1,
    limit: 10,
  };

  const metaAggregate = Meta.aggregate();

  const match = {
    $and: [
      { title: { $regex: new RegExp(searchParams?.search), $options: "i" } },
      {
        source:
          searchParams?.source === "both" || !searchParams?.source
            ? { $in: ["bescha", "ted"] }
            : searchParams?.source,
      },
    ],
  };

  let sort;

  if (searchParams?.sort === "newest") {
    sort = { publishDate: -1 };
  } else if (searchParams?.sort === "oldest") {
    sort = { publishDate: 1 };
  } else if (searchParams?.sort === "az") {
    sort = { title: 1 };
  } else if (searchParams?.sort === "za") {
    sort = { title: -1 };
  }

  if (searchParams?.from) {
    match.$and.push({ publishDate: { $gte: searchParams?.from } });
  }

  if (searchParams?.to) {
    match.$and.push({ publishDate: { $lte: searchParams?.to } });
  }

  if (searchParams?.amount && isNumeric(searchParams?.amount)) {
    match.$and.push({
      "amount.amount": { $gt: parseFloat(searchParams?.amount) },
    });
  }

  if (searchParams?.seller) {
    match.$and.push({ sellers: { $exists: true } });
  }

  const aggregate = [
    {
      $match:
        /**
         * query: The query in MQL.
         */
        match,
    },
  ];

  if (sort) {
    aggregate.push({
      $sort: sort,
    });
  }

  const m = Meta.aggregate(aggregate);

  const {
    docs: meta,
    totalDocs,
    totalPages,
  } = await Meta.aggregatePaginate(m, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <ExportButton
          searchParams={searchParams}
          fetchMetaDetail={fetchMetaDetail}
        />
        {searchParams && (
          <ExportOverviewDetail
            searchParams={searchParams}
            fetchOverviewDetail={fetchOverviewDetail}
          />
        )}
        <div className="sm:w-[180px] w-full sm:flex-grow-0 flex-grow">
          <ResultSorter />
        </div>
      </div>
      <Separator className="my-4" />
      <SearchResultInfo
        totalDocs={totalDocs}
        totalPages={totalPages}
        searchParams={searchParams}
      />
      <div className="flex gap-2 flex-col">
        <ResultCardWrapper metas={JSON.parse(JSON.stringify(meta))} />
      </div>
      <ResultPagination searchParams={searchParams} totalPages={totalPages} />
    </>
  );
};

export default Results;
