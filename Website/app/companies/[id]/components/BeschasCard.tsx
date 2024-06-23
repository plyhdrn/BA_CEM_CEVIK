import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Company, { ICompany } from "@/models/Company";
import mongoose from "mongoose";
import Link from "next/link";
import React from "react";

const BeschasCard = async ({ id }: { id: mongoose.Types.ObjectId }) => {
  const companies: ICompany[] = await Company.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: "beschaMeta",
        localField: "buys.id",
        foreignField: "entryId",
        as: "beschaBuysResult",
      },
    },
    {
      $lookup: {
        from: "beschaMeta",
        localField: "sells.id",
        foreignField: "entryId",
        as: "beschaSellsResult",
      },
    },
    {
      $addFields: {
        beschaResults: {
          $concatArrays: ["$beschaBuysResult", "$beschaSellsResult"],
        },
      },
    },
    { $limit: 1 },
  ]);

  if (!companies || companies.length === 0) return <div>Company not found</div>;

  const company = companies[0];

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Bescha entries</h1>
      <div className="flex flex-wrap gap-2">
        {company.beschaResults.map((result) => (
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
                  href={`https://www.oeffentlichevergabe.de/ui/en/search/details?noticeId=${result.entryId}`}
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

export default BeschasCard;
