import dbConnect from "@/lib/dbConnect";
import Bescha, { IBescha } from "@/models/Bescha";
import ResultBeschaCard from "./resultBeschaCard";
import Ted, { ITed } from "@/models/Ted";
import ResultTedCard from "./resultTedCard";
import Meta, { IMetaView } from "@/models/Meta";
import ResultCard from "./resultCard";
import ExportButton from "./exportButton";
import { Separator } from "./ui/separator";
import Company, { ICompany } from "@/models/Company";
import ResultCompanyCard from "./resultCompanyCard";
import ResultPagination from "./resultPagination";
import ResultCompanyCardWrapper from "./resultCompanyCardWrapper";
import ResultSorter from "./resultSorter";

const ResultsCompany = async ({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    page?: string;
    sort?: "relevant" | "newest" | "oldest" | "az" | "za";
  };
}) => {
  await dbConnect();

  if (!searchParams?.search) return <div></div>;

  const aggregate = [
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          alternativeNames: { $regex: "(?i).*" + searchParams?.search + ".*" },
        },
    },
  ];

  let sortOptions;

  if (searchParams?.sort === "az") {
    sortOptions = { name: 1 };
  } else if (searchParams?.sort === "za") {
    sortOptions = { name: -1 };
  }

  if (sortOptions) {
    aggregate.push({
      $sort: sortOptions,
    });
  }

  const c = Company.aggregate(aggregate);

  const options = {
    page: searchParams?.page || 1,
    limit: 10,
  };

  const {
    docs: companies,
    totalDocs,
    totalPages,
  } = await Company.aggregatePaginate(c, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <>
      <div className="flex justify-end gap-2">
        <ExportButton meta={JSON.stringify(companies)} />
        <div className="w-[150px]">
          <ResultSorter allowedSorts={["az", "za"]} />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex">
        <div className="text-sm text-muted-foreground">
          {totalDocs} results found
        </div>
        <div className="flex-grow"></div>
        <div className="text-sm text-muted-foreground">
          Page {searchParams.page || 1} of {totalPages}
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        <ResultCompanyCardWrapper
          companies={JSON.parse(JSON.stringify(companies))}
        />
      </div>
      <ResultPagination searchParams={searchParams} totalPages={totalPages} />
    </>
  );
};

export default ResultsCompany;
