"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const uploadMatching = async (formData: FormData) => {
  const session = await auth();

  if (!session || !session.user) throw new Error("Not authenticated");

  try {
    const res = fetch(`${process.env.BACKEND_URL}/matching/upload`, {
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
      method: "POST",
      body: formData,
    });

    // if (!res.ok) throw new Error(await res.text());
    revalidatePath("/matching");

    return {
      message: "Getting data",
    };
  } catch (e) {
    return "Image Upload failed";
  }
};
