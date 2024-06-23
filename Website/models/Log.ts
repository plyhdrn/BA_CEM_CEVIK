import mongoose, { ObjectId, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

type IMatchingDetail = {
  matchingId: ObjectId;
};

type ISetupDetail = {
  source: "ted" | "bescha" | "company";
  from?: Date;
  to?: Date;
};

type IProfileDetail = {
  companies: {
    id: ObjectId;
    name: string;
    url: string;
    status: "success" | "error";
  }[];
  size: number;
};

type IWebsiteDetail = {
  companies: {
    id: ObjectId;
    name: string;
    url?: string;
    status: "success" | "error";
  }[];
  size: number;
};

export type ILog = {
  type: "setup" | "profile" | "website" | "matching";
  startedBy: "automation" | "manual";
  startDateTime: Date;
  name: string;
  status: "running" | "done" | "error";
  message: string;
} & (
  | { status: "running" }
  | ({ status: "done" | "error" } & { endDateTime: Date })
  | ({ type: "setup" } & {
      setupDetail: ISetupDetail;
    })
  | ({ type: "profile"; status: "done" } & { profileDetail: IProfileDetail })
  | ({ type: "website"; status: "done" } & { websiteDetail: IWebsiteDetail })
  | ({ type: "matching"; status: "done" } & { matchingDetail: IMatchingDetail })
);

const LogSchema = new mongoose.Schema<ILog>(
  {
    type: { type: String, required: true },
    startedBy: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    name: { type: String, required: true },
    endDateTime: { type: Date },
    status: { type: String, required: true },
    message: { type: String, required: true },
    setupDetail: {
      source: { type: String },
      from: { type: Date },
      to: { type: Date },
    },
    profileDetail: {
      companies: [
        {
          id: { type: String },
          name: { type: String },
          url: { type: String },
          status: { type: String },
        },
      ],
      size: { type: Number },
    },
    websiteDetail: {
      companies: [
        {
          id: { type: String },
          name: { type: String },
          url: { type: String },
          status: { type: String },
        },
      ],
      size: { type: Number },
    },
    matchingDetail: {
      matchingId: { type: Schema.Types.ObjectId, ref: "Matching" },
    },
  },
  { timestamps: true }
);

LogSchema.plugin(aggregatePaginate);

export default mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);
