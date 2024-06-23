import mongoose, { Schema } from "mongoose";
import { z } from "zod";

const companiesSchema = new Schema(
  {
    any: Schema.Types.Mixed,
  },
  { strict: false }
);

export const companyLimitSchema = z.object({
  limit: z.coerce.number().min(1).max(100),
});

export const companyIdAndFilenameSchema = z.object({
  id: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
  filename: z.string(),
});

const Companies = mongoose.model("companies", companiesSchema);

export default Companies;
