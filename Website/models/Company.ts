import mongoose, { ObjectId, Schema } from "mongoose";
import { IMetaView } from "./Meta";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export type ICompany = {
  _id: string;
  name: string;
  internetAddress: string;
  address?: string;
  country?: string;
  contact?: {
    phone: string;
    email: string;
  };
  buys: {
    id: string;
    source: "ted" | "bescha";
  }[];
  sells: {
    id: string;
    source: "ted" | "bescha";
  }[];
  tedResults?: IMetaView[];
  beschaResults?: IMetaView[];
  alternativeNames?: string[];
  profile?: {
    date: Date;
    filename: string;
    imageId: ObjectId;
  }[];
  isSeller?: boolean;
  isBuyer?: boolean;
};

const CompanySchema = new mongoose.Schema<ICompany>(
  {
    name: { type: String, required: true },
    internetAddress: { type: String, required: true },
    address: { type: String },
    country: { type: String },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    buys: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Meta" },
        source: { type: String, enum: ["ted", "bescha"] },
      },
    ],
    sells: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Meta" },
        source: { type: String, enum: ["ted", "bescha"] },
      },
    ],
    alternativeNames: [String],
    // Array of MetaView
    tedResults: [
      {
        type: Schema.Types.ObjectId,
        ref: "Meta",
      },
    ],
    beschaResults: [
      {
        type: Schema.Types.ObjectId,
        ref: "Meta",
      },
    ],
    profile: [
      {
        date: { type: Date, required: true },
        filename: { type: String, required: true },
        imageId: { type: Schema.Types.ObjectId, required: true },
      },
    ],
  },
  { collection: "companies" }
);

CompanySchema.plugin(aggregatePaginate);

export default mongoose.models.Company ||
  mongoose.model<ICompany>("Company", CompanySchema);
