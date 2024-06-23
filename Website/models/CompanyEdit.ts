import { z } from "zod";

export const companyEditSchema = z.object({
  id: z.string(),
  internetAddress: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});
