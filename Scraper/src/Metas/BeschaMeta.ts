import mongoose, { Schema } from "mongoose";

const beschaMetaSchema = new Schema(
  {
    any: Schema.Types.Mixed,
  },
  { strict: false }
);

const BeschaMeta = mongoose.model("beschaMeta", beschaMetaSchema, "beschaMeta");

export default BeschaMeta;
