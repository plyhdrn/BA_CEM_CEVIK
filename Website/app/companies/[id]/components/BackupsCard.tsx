import Company from "@/models/Company";
import { ObjectId } from "mongoose";
import React from "react";
import { saveAs } from "file-saver";
import BackupDownload from "./BackupDownload";
import mongoose from "mongoose";
import ResultPagination from "@/components/resultPagination";
import { auth } from "@/auth";
import FetchProfile from "./FetchProfile";
import { createProfileSync } from "@/actions/createProfileSync";

const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

const BackupsCard = async ({
  searchParams,
  id,
}: {
  searchParams?: {
    page?: string;
  };
  id: string;
}) => {
  const session = await auth();

  const altId = new mongoose.Types.ObjectId(id);

  const aggregate = [
    {
      $match: {
        _id: altId,
      },
    },
    {
      $unwind: {
        path: "$profile",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];

  const c = Company.aggregate(aggregate);

  const options = {
    page: searchParams?.page || 1,
    limit: 8,
  };

  const {
    docs: profiles,
    totalDocs,
    totalPages,
  } = await Company.aggregatePaginate(c, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  const downloadBackup = async (id: string, filename: string) => {
    "use server";

    const res = await fetch(
      `${process.env.BACKEND_URL}/company/backup/download?id=${id}&filename=${filename}`,
      {
        headers: {
          "API-KEY": process.env.API_KEY || "",
        },
      }
    );
    const blob = await res.arrayBuffer();
    return Buffer.from(blob).toString("base64");
  };

  if (!profiles) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-semibold mb-2">Profiles</h1>
        <FetchProfile
          id={id as unknown as ObjectId}
          createProfileSync={createProfileSync}
          authorized={!!session}
        />
      </div>
      <div className="flex">
        {profiles.length === 0 && (
          <div className="text-sm">No entries found</div>
        )}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
          {profiles.map((result) => (
            <BackupDownload
              key={result.profile.date}
              filename={result.profile.filename}
              date={result.profile.date}
              downloadBackup={downloadBackup}
              imagePath={`${
                process.env.BACKEND_URL
              }/company/backup/image?id=${id.toString()}&filename=${
                result.profile.filename
              }`}
              id={id.toString()}
            />
          ))}
        </div>
      </div>
      <ResultPagination searchParams={searchParams} totalPages={totalPages} />
    </div>
  );
};

export default BackupsCard;
