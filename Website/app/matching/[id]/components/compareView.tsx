import Matching from "@/models/Matching";
import mongoose from "mongoose";
import DataViewer from "./dataViewer";
import SearchCompany from "@/components/searchCompany";
import ResultPagination from "@/components/resultPagination";
import SearchRealTime from "@/components/searchRealTime";
import Ted from "@/models/Ted";
import Bescha from "@/models/Bescha";
import SearchResultInfo from "@/components/searchResultInfo";
import { Separator } from "@/components/ui/separator";

const { ObjectId } = mongoose.Types;

interface SearchParams extends URLSearchParams {
  search?: string;
  page?: string;
}

const CompareView = async ({
  id,
  searchParams,
}: {
  id: mongoose.Types.ObjectId;
  searchParams?: SearchParams;
}) => {
  const options = {
    page: searchParams?.page || 1,
    limit: 10,
  };

  const matchingAggregate = Matching.aggregate();

  const match = {};

  if (searchParams?.search) {
    match["data.name"] = { $regex: ".*" + searchParams?.search + ".*" };
  }

  const m = Matching.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $project: {
        data: "$data",
      },
    },
    {
      $unwind: {
        path: "$data",
        preserveNullAndEmptyArrays: false,
      },
    },
    // {
    //   $lookup: {
    //     from: "beschas",
    //     let: {
    //       id: {
    //         $toObjectId: "$data.pocodat_localId",
    //       },
    //       source: "$data.pocodat_source",
    //     },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               {
    //                 $eq: ["$$source", "bescha"],
    //               },
    //               {
    //                 $eq: ["$_id", "$$id"],
    //               },
    //             ],
    //           },
    //         },
    //       },
    //     ],
    //     as: "bechaMatch",
    //   },
    // },
    // {
    //   $lookup: {
    //     from: "ted",
    //     let: {
    //       id: {
    //         $toObjectId: "$data.pocodat_localId",
    //       },
    //       source: "$data.pocodat_source",
    //     },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               {
    //                 $eq: ["$$source", "ted"],
    //               },
    //               {
    //                 $eq: ["$publication-number", "$$id"],
    //               },
    //             ],
    //           },
    //         },
    //       },
    //     ],
    //     as: "tedMatch",
    //   },
    // },
    // {
    //   $addFields: {
    //     match: {
    //       $ifNull: [
    //         {
    //           $arrayElemAt: ["$bechaMatch", 0],
    //         },
    //         {
    //           $arrayElemAt: ["$tedMatch", 0],
    //         },
    //       ],
    //     },
    //   },
    // },
    {
      $project: {
        data: "$data",
        match: "$match",
      },
    },
    {
      $match: match,
    },
  ]);

  const {
    docs: data,
    totalDocs,
    totalPages,
  } = await Matching.aggregatePaginate(m, options)
    .then(async (result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  const res = [];

  for await (const item of data) {
    if (item.data.pocodat_source === "bescha") {
      const bescha = await Bescha.findById(item.data.pocodat_localId);
      item.match = bescha;
      if (bescha) {
        item.match = bescha;
      }
    } else if (item.data.pocodat_source === "ted") {
      const ted = await Ted.findById(item.data.pocodat_localId);

      if (ted) {
        item.match = ted;
      }
    }

    if (item.match) {
      res.push(item);
    }
  }

  return (
    <div className="flex flex-col">
      {res.length > 0 && (
        <div className="flex flex-col w-full mt-4">
          <SearchResultInfo
            totalDocs={totalDocs}
            totalPages={totalPages}
            searchParams={searchParams}
          />
          <Separator className="my-2" />
        </div>
      )}
      {res.length === 0 && <div>No results found</div>}
      <DataViewer data={JSON.parse(JSON.stringify(res))} />
      <div className="py-4">
        {res.length > 0 && (
          <ResultPagination
            searchParams={searchParams}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default CompareView;
