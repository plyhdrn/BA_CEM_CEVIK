"use server";
import { signIn } from "@/auth";
import { action } from "@/lib/safe-action";
import { signInSchema } from "@/lib/zod";

export const loginUser = action(
  signInSchema,
  async ({
    password,
  }): Promise<{
    message: string;
    status: string;
  }> => {
    try {
      await signIn("credentials", { password, redirect: false });
      return {
        message: "Successfully logged in",
        status: "success",
      };
    } catch (error) {
      return { message: "Incorrect credentials", status: "error" };
    }
  }
);
