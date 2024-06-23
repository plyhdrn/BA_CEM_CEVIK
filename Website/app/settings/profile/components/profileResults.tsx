import ResultPagination from "@/components/resultPagination";
import SearchResultInfo from "@/components/searchResultInfo";
import { Separator } from "@/components/ui/separator";
import Log from "@/models/Log";
import ProfileResult from "./profileResult";
import ProfileWrapper from "./profileWrapper";

interface SearchParams extends URLSearchParams {
  search?: string;
  page?: string;
}

const ProfileResults = async ({
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
    type: "profile",
  };

  if (searchParams?.search) {
    match["profileDetail.companies.name"] = {
      $regex: ".*" + searchParams?.search + ".*",
    };
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
      <ProfileWrapper
        logs={JSON.parse(JSON.stringify(log))}
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

export default ProfileResults;
