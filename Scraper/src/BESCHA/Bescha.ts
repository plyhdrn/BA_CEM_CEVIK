import mongoose, { Schema } from "mongoose";
import { z } from "zod";

// Schema for the "bescha" collection
const beschaSchema = new Schema(
  {
    any: Schema.Types.Mixed,
  },
  { strict: false }
);

export const beschaSyncSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}$/),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  shouldReset: z.boolean().optional(),
});

const Bescha = mongoose.model("bescha", beschaSchema);

export default Bescha;
