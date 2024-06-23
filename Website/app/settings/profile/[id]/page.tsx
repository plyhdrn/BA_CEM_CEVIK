import Page404 from "@/components/page404";
import ResultCompanyCard from "@/components/resultCompanyCard";
import ResultCompanyCardWrapper from "@/components/resultCompanyCardWrapper";
import SearchRealTime from "@/components/searchRealTime";
import { convertTime } from "@/lib/utils";
import Company from "@/models/Company";
import Log from "@/models/Log";
import mongoose from "mongoose";
import { Suspense } from "react";

interface SearchParams extends URLSearchParams {
  search?: string;
  page?: string;
}

const ProfileDetailPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: SearchParams;
}) => {
  try {
    new mongoose.Types.ObjectId(params.id);
  } catch (e) {
    return <Page404 />;
  }

  const id = new mongoose.Types.ObjectId(params.id);

  const profile = await Log.findOne({
    _id: id,
  });

  if (!profile) return <Page404 />;

  const options = {
    page: searchParams?.page || 1,
    limit: 10,
  };

  const logAggregate = Log.aggregate();

  const aggregate = [
    {
      $match: {
        _id: id,
      },
    },
    {
      $project: {
        companies: "$profileDetail.companies",
      },
    },
    {
      $unwind: {
        path: "$companies",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];

  if (searchParams?.search) {
    aggregate.push({
      $match: {
        "companies.name": {
          $regex: ".*" + searchParams?.search + ".*",
          $options: "i",
        },
      },
    });
  }

  const m = Log.aggregate(aggregate);

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

  const companies = [];

  for await (const company of log) {
    const c = await Company.findOne({
      _id: company.companies.id,
    });

    if(!c) continue;

    const elem = c.toObject();

    if (company.companies.status === "error") {
      elem.error = true;
    }

    if (company.companies.status === "success") {
      elem.success = true;
    }

    companies.push(elem);
  }

  return (
    <div className="flex flex-col">
      <div className="container">
        <div className="flex flex-col justify-end py-8 gap-3">
          <div className="flex sm:flex-row flex-col sm:gap-0 gap-3 justify-between">
            <h1 className="text-4xl font-semibold">{profile.name}</h1>
          </div>
          <div className="flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Found Companies</span>
              <span className="text-sm font-medium">
                {
                  profile.profileDetail.companies.filter(
                    (x) => x.status === "success"
                  ).length
                }
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Failed Companies</span>
              <span className="text-sm font-medium">
                {
                  profile.profileDetail.companies.filter(
                    (x) => x.status === "error"
                  ).length
                }
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Total Requested</span>
              <span className="text-sm font-medium">
                {profile.profileDetail.size}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Duration</span>
              <span className="text-sm font-medium">
                {convertTime(
                  (new Date(profile.endDateTime).getTime() -
                    new Date(profile.startDateTime).getTime()) /
                    1000
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Start Date</span>
              <span className="text-sm font-medium">
                {new Date(profile.createdAt).toString().slice(0, 24)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-8 container">
        <SearchRealTime />
        <Suspense
          fallback={<div>Loading...</div>}
          key={searchParams?.search ?? "0" + searchParams?.page ?? 0}
        >
          <ResultCompanyCardWrapper
            companies={JSON.parse(JSON.stringify(companies))}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
