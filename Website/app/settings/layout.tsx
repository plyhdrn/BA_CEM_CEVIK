import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Image from "next/image";
import { SignIn } from "./components/sign-in";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex w-full h-full">
        <SignIn />
      </div>
    );
  }

  return (
    <>
      {/* <div className="space-y-6 p-10 pb-16 md:block container">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div> */}
      {children}
    </>
  );
}
