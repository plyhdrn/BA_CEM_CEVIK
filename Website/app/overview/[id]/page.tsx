import ResultCompanyCardWrapper from "@/components/resultCompanyCardWrapper";
import ResultPagination from "@/components/resultPagination";
import SearchRealTime from "@/components/searchRealTime";
import { Separator } from "@/components/ui/separator";
import Company from "@/models/Company";
import Meta from "@/models/Meta";
import mongoose from "mongoose";
import { Suspense } from "react";

const OverviewDetailPage = async ({
  searchParams,
  params,
}: {
  searchParams?: {
    page?: string;
    search?: string;
  };
  params: { id: string };
}) => {
  const id = new mongoose.Types.ObjectId(params.id);
  const meta = await Meta.findOne({
    _id: id,
  });

  if (!meta) return <div>meta not found</div>;

  const aggregate = [
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          _id: id,
        },
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          "buyers.buys": {
            $cond: [
              {
                $not: ["$buyers"],
              },
              "$$REMOVE",
              true,
            ],
          },
          "sellers.sells": {
            $cond: [
              {
                $not: ["$sellers"],
              },
              "$$REMOVE",
              true,
            ],
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
          entries: {
            $concatArrays: [
              {
                $cond: {
                  if: {
                    $or: [
                      {
                        $eq: ["$sellers", {}],
                      },
                      {
                        $eq: ["$sellers", null],
                      },
                    ],
                  },
                  then: [],
                  else: "$sellers",
                },
              },
              {
                $cond: {
                  if: {
                    $or: [
                      {
                        $eq: ["$buyers", {}],
                      },
                      {
                        $eq: ["$buyers", null],
                      },
                    ],
                  },
                  then: [],
                  else: "$buyers",
                },
              },
            ],
          },
        },
    },
    {
      $unwind: {
        path: "$entries",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];

  if (searchParams?.search) {
    aggregate.push({
      $match: {
        "entries.name": {
          $regex: "(?i).*" + searchParams?.search + ".*",
        },
      },
    });
  }

  const c = Meta.aggregate(aggregate);

  const options = {
    page: searchParams?.page || 1,
    limit: 4,
  };

  const {
    docs: entries,
    totalDocs,
    totalPages,
  } = await Meta.aggregatePaginate(c, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  if (!entries || entries.length === 0) return <div>Entry not found</div>;

  const companyResults = [];

  for await (const entry of entries) {
    if (!entry.entries.name) continue;

    let company = await Company.findOne({
      alternativeNames: { $regex: "(?i).*" + entry.entries.name + ".*" },
    });

    if (company) {
      console.log(entry.entries);
      if (entry.entries.sells) {
        company = {
          ...company.toObject(),
          isSeller: true,
        };
      }

      if (entry.entries.buys) {
        company = {
          ...company.toObject(),
          isBuyer: true,
        };
      }

      companyResults.push(company);
    }
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-semibold mb-2">Companies</h1>
      <SearchRealTime />
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
      <Suspense
        fallback={<div>Loading...</div>}
        key={searchParams?.search + searchParams?.page}
      >
        <div className="flex flex-col gap-2 my-4">
          <ResultCompanyCardWrapper
            companies={JSON.parse(JSON.stringify(companyResults))}
          />
        </div>
      </Suspense>
      <div className="mb-2">
        <ResultPagination searchParams={searchParams} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default OverviewDetailPage;
