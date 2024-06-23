import mongoose, { Schema } from "mongoose";
import { z } from "zod";

// Schema for the "bescha" collection
const tedSchema = new Schema(
  {
    any: Schema.Types.Mixed,
  },
  { strict: false }
);

export const tedSyncSchema = z.object({
  startDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
  endDate: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/)
    .optional()
    .or(z.literal("")),
  shouldReset: z.boolean().optional(),
});

const Ted = mongoose.model("ted", tedSchema);

export default Ted;
