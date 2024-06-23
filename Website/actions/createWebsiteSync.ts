"use server";

import { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";

export const createWebsiteSync = async (id: ObjectId) => {
  const res = await fetch(
    `${process.env.BACKEND_URL}/company/site/create?id=${id}`,
    {
      method: "POST",
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
    }
  );
  const json = await res.json();
  revalidatePath(`/companies`);
  return json;
};
