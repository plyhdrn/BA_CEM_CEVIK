import mongoose, { Schema } from "mongoose";

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

export default mongoose.models.Matching ||
  mongoose.model<IMatching>("Matching", MatchingSchema);
