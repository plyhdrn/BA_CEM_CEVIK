import mongoose, { Schema } from "mongoose";

const tedMetaSchema = new Schema(
  {
    any: Schema.Types.Mixed,
  },
  { strict: false }
);

const TedMeta = mongoose.model("tedMeta", tedMetaSchema, "tedMeta");

export default TedMeta;
