import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export type IMetaView = {
  source: "ted" | "bescha";
  entryId: string;
  publishDate: string;
  title: string;
  description: string;
  buyers: {
    id?: string;
    name: string;
    address: string;
    country: string;
    contact: {
      email: string;
      phone: string;
    };
  }[];
  sellers: {
    id?: string;
    name: string;
    address: string;
    country: string;
    contact: {
      email: string;
      phone: string;
    };
  }[];
  amount: {
    amount: number;
    currency: string;
  };
};

const MetaViewSchema = new mongoose.Schema<IMetaView>(
  {
    entryId: { type: String, required: true },
    source: { type: String, required: true },
    publishDate: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    buyers: [
      {
        id: { type: String, required: false },
        name: { type: String, required: true },
        address: { type: String, required: true },
        country: { type: String, required: true },
        contact: {
          email: { type: String, required: true },
          phone: { type: String, required: true },
        },
      },
    ],
    sellers: [
      {
        id: { type: String, required: false },
        name: { type: String, required: true },
        address: { type: String, required: true },
        country: { type: String, required: true },
        contact: {
          email: { type: String, required: true },
          phone: { type: String, required: true },
        },
      },
    ],
    amount: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
  },
  { strict: false, autoCreate: false }
);

// paginate with this plugin
MetaViewSchema.plugin(aggregatePaginate);

// create the paginated model
export default mongoose.models.metaView ||
  mongoose.model<IMetaView>("metaView", MetaViewSchema, "metaView");
