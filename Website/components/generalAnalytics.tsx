import dbConnect from "@/lib/dbConnect";
import Bescha from "@/models/Bescha";
import Meta from "@/models/Meta";
import Ted from "@/models/Ted";

const GeneralAnalytics = async () => {
  await dbConnect();

  const tedCount = await Ted.countDocuments();
  const beschaCount = await Bescha.countDocuments();

  // const data = await Meta.aggregate([
  //   {
  //     $group:
  //       /**
  //        * _id: The id of the group.
  //        * fieldN: The first field name.
  //        */
  //       {
  //         _id: {
  //           source: "$source",
  //         },
  //         total: {
  //           $sum: 1,
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
  //         source: "$_id.source",
  //         total: "$total",
  //         _id: 0,
  //       },
  //   },
  // ]);

  return (
    <div className="flex sm:flex-row flex-col sm:gap-0 gap-5 sm:justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Total Entries</span>
        <span className="text-4xl font-medium">
          {tedCount + beschaCount || 0}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Total TED Entries</span>
        <span className="text-4xl font-medium">{tedCount || 0}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Total BESCHA Entries</span>
        <span className="text-4xl font-medium">{beschaCount || 0}</span>
      </div>
    </div>
  );
};

export default GeneralAnalytics;
