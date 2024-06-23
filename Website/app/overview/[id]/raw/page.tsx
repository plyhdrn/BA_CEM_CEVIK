import Bescha from "@/models/Bescha";
import Meta from "@/models/Meta";
import Ted from "@/models/Ted";
import mongoose from "mongoose";
import RawView from "./components/rawView";

const OverviewRawPage = async ({ params }: { params: { id: string } }) => {
  const id = new mongoose.Types.ObjectId(params.id);
  const meta = await Meta.findOne({
    _id: id,
  });

  if (!meta) return <div>meta not found</div>;

  let entry;

  if (meta.source === "ted") {
    entry = await Ted.findOne({
      "publication-number": meta.entryId,
    });
  } else if (meta.source === "bescha") {
    entry = await Bescha.findOne({
      "releases.id": meta.entryId,
    });
  }

  if (!entry) {
    return <div>entry not found</div>;
  }

  return (
    <div className="flex flex-col pb-2">
      <h1 className="text-3xl font-semibold mb-2">Raw JSON</h1>
      <RawView entry={JSON.parse(JSON.stringify(entry))} />
    </div>
  );
};

export default OverviewRawPage;
