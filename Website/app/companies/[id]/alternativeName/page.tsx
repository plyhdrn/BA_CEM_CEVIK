import ResultPagination from "@/components/resultPagination";
import SearchCompany from "@/components/searchCompany";
import SearchRealTime from "@/components/searchRealTime";
import { Separator } from "@/components/ui/separator";
import Company from "@/models/Company";
import mongoose from "mongoose";

const CompanyDetailPage = async ({
  searchParams,
  params,
}: {
  searchParams?: {
    search?: string;
    page?: string;
  };
  params: { id: string };
}) => {
  const altId = new mongoose.Types.ObjectId(params.id);

  const search = searchParams?.search;

  const filterQuery = [
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          _id: altId,
        },
    },
  ];

  if (search) {
    filterQuery.push({
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          name: {
            $filter: {
              input: "$alternativeNames",
              as: "name",
              cond: {
                $regexMatch: {
                  input: "$$name",
                  regex: search,
                  options: "i",
                },
              },
            },
          },
        },
    });
  } else {
    filterQuery.push({
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          name: "$alternativeNames",
        },
    });
  }

  const aggregate = [
    ...filterQuery,
    {
      $unwind: {
        path: "$name",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];

  const c = Company.aggregate(aggregate);

  const options = {
    page: searchParams?.page || 1,
    limit: 10,
  };

  const {
    docs: alternativeNames,
    totalDocs,
    totalPages,
  } = await Company.aggregatePaginate(c, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  if (alternativeNames.length === 0) {
    return (
      <div className="flex flex-col justify-end gap-2">
        <h1 className="text-3xl font-semibold mb-2">Alternative Names</h1>
        <div className="text-sm">No alternative names found</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-end gap-2">
        <h1 className="text-3xl font-semibold mb-2">Alternative Names</h1>
        <SearchRealTime />
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
        {alternativeNames.map((alternativeName) => (
          <div key={alternativeName._id}>
            <span className="text-md font-medium">{alternativeName.name}</span>
          </div>
        ))}
      </div>
      <ResultPagination searchParams={searchParams} totalPages={totalPages} />
    </>
  );
};

export default CompanyDetailPage;
