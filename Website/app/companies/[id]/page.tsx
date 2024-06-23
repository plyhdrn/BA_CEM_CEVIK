import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { normalizeURL } from "@/lib/utils";
import Company from "@/models/Company";
import mongoose from "mongoose";
import Link from "next/link";
import React, { Suspense } from "react";
import TedsCard from "./components/TedsCard";
import BeschasCard from "./components/BeschasCard";
import BackupsCard from "./components/BackupsCard";
import { ExternalLinkIcon } from "lucide-react";
import Meta from "@/models/Meta";
import ResultCard from "@/components/resultCard";
import SearchRealTime from "@/components/searchRealTime";
import ResultPagination from "@/components/resultPagination";

const CompanyIdPage = async ({
  searchParams,
  params,
}: {
  searchParams?: {
    page?: string;
    search?: string;
  };
  params: { id: string };
}) => {
  const altId = new mongoose.Types.ObjectId(params.id);

  // const aggregate = [
  //   {
  //     $match:
  //       /**
  //        * query: The query in MQL.
  //        */
  //       {
  //         _id: altId,
  //       },
  //   },
  //   {
  //     $set:
  //       /**
  //        * specifications: The fields to
  //        *   include or exclude.
  //        */
  //       {
  //         "sells.sells": {
  //           $cond: [
  //             {
  //               $not: ["$sells"],
  //             },
  //             "$$REMOVE",
  //             true,
  //           ],
  //         },
  //         "buys.buys": {
  //           $cond: [
  //             {
  //               $not: ["$buys"],
  //             },
  //             "$$REMOVE",
  //             true,
  //           ],
  //         },
  //       },
  //   },
  //   {
  //     $project:
  //       /**
  //        * specifications: The fields to
  //        *   include or exclude.
  //        */
  //       {
  //         entries: {
  //           $concatArrays: [
  //             {
  //               $cond: {
  //                 if: {
  //                   $or: [
  //                     {
  //                       $eq: ["$sells", {}],
  //                     },
  //                     {
  //                       $eq: ["$sells", null],
  //                     },
  //                   ],
  //                 },
  //                 then: [],
  //                 else: "$sells",
  //               },
  //             },
  //             {
  //               $cond: {
  //                 if: {
  //                   $or: [
  //                     {
  //                       $eq: ["$buys", {}],
  //                     },
  //                     {
  //                       $eq: ["$buys", null],
  //                     },
  //                   ],
  //                 },
  //                 then: [],
  //                 else: "$buys",
  //               },
  //             },
  //           ],
  //         },
  //       },
  //   },
  //   {
  //     $unwind: {
  //       path: "$entries",
  //       includeArrayIndex: "string",
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup:
  //       /**
  //        * from: The target collection.
  //        * localField: The local join field.
  //        * foreignField: The target join field.
  //        * as: The name for the results.
  //        * pipeline: Optional pipeline to run on the foreign collection.
  //        * let: Optional variables to use in the pipeline field stages.
  //        */
  //       {
  //         from: "metaView",
  //         let: {
  //           id: "$entries.id",
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $eq: ["$entryId", "$$id"],
  //               },
  //             },
  //           },
  //         ],
  //         as: "entries.meta",
  //       },
  //   },
  // ];

  // if (searchParams?.search) {
  // aggregate.push({
  //   $match: {
  //     $or: [
  //       {
  //         "entries.meta.name": {
  //           $regex: searchParams.search,
  //           $options: "i",
  //         },
  //       },
  //       {
  //         "entries.meta.description": {
  //           $regex: searchParams.search,
  //           $options: "i",
  //         },
  //       },
  //     ],
  //   },
  // });
  // }

  const aggregate = [
    {
      $match: {
        _id: altId,
      },
    },
    {
      $set:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          "sells.sells": {
            $cond: [
              {
                $not: ["$sells"],
              },
              "$$REMOVE",
              true,
            ],
          },
          "buys.buys": {
            $cond: [
              {
                $not: ["$buys"],
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
                        $eq: ["$sells", {}],
                      },
                      {
                        $eq: ["$sells", null],
                      },
                    ],
                  },
                  then: [],
                  else: "$sells",
                },
              },
              {
                $cond: {
                  if: {
                    $or: [
                      {
                        $eq: ["$buys", {}],
                      },
                      {
                        $eq: ["$buys", null],
                      },
                    ],
                  },
                  then: [],
                  else: "$buys",
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

  const c = Company.aggregate(aggregate);

  const options = {
    page: searchParams?.page || 1,
    limit: 4,
  };

  const {
    docs: entries,
    totalDocs,
    totalPages,
  } = await Company.aggregatePaginate(c, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  if (!entries || entries.length === 0) return <div>Company not found</div>;

  const metaResults = [];

  for await (const entry of entries) {
    const meta = await Meta.findOne({
      entryId: entry.entries.id,
    });

    if (meta) {
      if (entry.entries.sells) {
        meta.sells = true;
      }

      if (entry.entries.buys) {
        meta.buys = true;
      }

      metaResults.push(meta);
    }
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-semibold mb-2">Entries</h1>
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
          {metaResults.map((meta) => (
            <ResultCard key={meta._id} meta={meta} />
          ))}
        </div>
      </Suspense>
      <div className="mb-2">
        <ResultPagination searchParams={searchParams} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default CompanyIdPage;
