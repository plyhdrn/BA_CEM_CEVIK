import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

type IMatching = {
  _id: string;
  name: string;
  outputFile: string;
  totalEntries: number;
  matchedTedEntries: number;
  matchedBeschaEntries: number;
  data: any;
};

const MatchingSchema = new mongoose.Schema<IMatching>(
  {
    name: { type: String, required: true },
    outputFile: { type: String, required: true },
    totalEntries: { type: Number, required: true },
    matchedTedEntries: { type: Number, required: true },
    matchedBeschaEntries: { type: Number, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

MatchingSchema.plugin(aggregatePaginate);

export default mongoose.models.Matching ||
  mongoose.model<IMatching>("Matching", MatchingSchema);
