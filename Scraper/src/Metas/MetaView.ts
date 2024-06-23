import mongoose, { Schema } from "mongoose";

const metaViewSchema = new Schema(
  {
    any: Schema.Types.Mixed,
  },
  { strict: false, autoCreate: false }
);

const MetaView = mongoose.model("metaView", metaViewSchema, "metaView");

export default MetaView;
