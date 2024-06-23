import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Company, { ICompany } from "@/models/Company";
import mongoose from "mongoose";
import Link from "next/link";
import React from "react";

const TedsCard = async ({ id }: { id: mongoose.Types.ObjectId }) => {
  const companies: ICompany[] = await Company.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: "tedMeta",
        localField: "buys.id",
        foreignField: "entryId",
        as: "tedBuysResult",
      },
    },
    {
      $lookup: {
        from: "tedMeta",
        localField: "sells.id",
        foreignField: "entryId",
        as: "tedSellsResult",
      },
    },
    {
      $addFields: {
        tedResults: {
          $concatArrays: ["$tedBuysResult", "$tedSellsResult"],
        },
      },
    },
    { $limit: 1 },
  ]);

  if (!companies || companies.length === 0) return <div>Company not found</div>;

  const company = companies[0];

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Ted entries</h1>
      <div className="flex flex-wrap gap-2">
        {company.tedResults.length === 0 && (
          <div className="text-sm">No entries found</div>
        )}
        {company.tedResults.map((result) => (
          <Card key={result._id} className="w-[400px] h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>{result.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="rounded-lg ">
                <p className="text-sm">{result.description.slice(0, 500)}</p>
              </div>
              <div className="flex flex-grow mt-5 items-end">
                <Link
                  href={`https://ted.europa.eu/de/notice/-/detail/${result.entryId}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="w-full"
                >
                  <Button variant="secondary" className="shadow-none w-full">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TedsCard;
