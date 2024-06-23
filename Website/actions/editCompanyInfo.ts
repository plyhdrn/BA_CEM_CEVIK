"use server";

import Company from "@/models/Company";
import { companyEditSchema } from "@/models/CompanyEdit";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { auth } from "@/auth";

export type FormState = {
  message: string;
  status?: "success" | "error";
};

export async function editCompanyInfo(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const session = await auth();

  if (!session || !session.user) {
    return {
      message: "Not authorized",
      status: "error",
    };
  }

  const formData = Object.fromEntries(data);
  const parsed = companyEditSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      status: "error",
    };
  }
  const { id, internetAddress, address, phone, email } = parsed.data;
  revalidatePath(`/companies`);

  const newId = new mongoose.Types.ObjectId(id);
  await Company.findByIdAndUpdate(
    { _id: newId },
    {
      $set: {
        internetAddress,
        address,
        contact: {
          phone: phone,
          email: email,
        },
      },
    }
  );

  return { message: "Company Edited", status: "success" };
}
