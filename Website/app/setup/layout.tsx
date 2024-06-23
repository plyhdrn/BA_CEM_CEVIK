import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Image from "next/image";
import { auth } from "@/auth";
import { SignIn } from "../settings/components/sign-in";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SetupLayoutProps {
  children: React.ReactNode;
}

export default async function SetupLayout({ children }: SetupLayoutProps) {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex w-full h-full">
        <SignIn />
      </div>
    );
  }

  return <>{children}</>;
}
