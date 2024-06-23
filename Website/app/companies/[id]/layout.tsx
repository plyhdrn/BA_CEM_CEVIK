import Company from "@/models/Company";
import { Metadata } from "next";
import { Suspense } from "react";
import BackupsCard from "./components/BackupsCard";
import TedsCard from "./components/TedsCard";
import BeschasCard from "./components/BeschasCard";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import mongoose, { ObjectId } from "mongoose";
import { normalizeURL } from "@/lib/utils";
import Link from "next/link";
import EditCompanyDetail from "./components/EditCompanyDetail";
import { auth } from "@/auth";
import Page404 from "@/components/page404";
import FetchWebsite from "./components/FetchWebsite";
import { createWebsiteSync } from "@/actions/createWebsiteSync";
import { revalidatePath } from "next/cache";
import FetchWebsiteOrProfile from "./components/FetchWebsite";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface CompanyLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function CompanyLayout({
  children,
  params,
}: CompanyLayoutProps) {
  const session = await auth();

  try {
    new mongoose.Types.ObjectId(params.id);
  } catch (e) {
    return <Page404 />;
  }

  const id = new mongoose.Types.ObjectId(params.id);
  const company = await Company.findOne({
    _id: id,
  });

  if (!company) return <Page404 />;

  return (
    <div className="flex flex-col">
      <div className="container">
        <div className="flex flex-col justify-end sm:py-8 py-2 gap-3">
          <div className="flex justify-between sm:flex-row flex-col-reverse">
            <div className="flex flex-col sm:w-4/5 w-full">
              <h1 className="lg:text-4xl md:text-2xl sm:text-xl font-semibold">
                {company.name}
              </h1>
              <span className="text-sm font-medium truncate mt-1">
                {company.address || "No address"}
              </span>
            </div>
            <div className="flex gap-4 sm:items-start items-end justify-end">
              {company.internetAddress ? (
                <Link
                  href={normalizeURL(company.internetAddress)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button variant="ghost">
                    {company.internetAddress}
                    <ExternalLinkIcon className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <FetchWebsite
                  id={id as unknown as ObjectId}
                  createWebsiteSync={createWebsiteSync}
                  authorized={!!session}
                />
              )}
              <EditCompanyDetail
                key={
                  company.name +
                  company.internetAddress +
                  company.address +
                  company.contact.phone +
                  company.contact.email
                }
                authorized={!!session}
                company={JSON.parse(JSON.stringify(company))}
              />
            </div>
          </div>
          <div className="grid grid-cols-6 justify-between mt-4">
            <div className="flex flex-col sm:col-span-1 col-span-2">
              <span className="text-sm">Alternative Names</span>
              <span className="text-sm font-medium">
                {company.alternativeNames && company.alternativeNames.length > 1
                  ? company.alternativeNames.length - 1
                  : 0}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2">
              <span className="text-sm">Buys</span>
              <span className="text-sm font-medium">
                {(company.buys && company.buys.length) || 0}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2 gap-1">
              <span className="text-sm">Sells</span>
              <span className="text-sm font-medium">
                {(company.sells && company.sells.length) || 0}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2 gap-1">
              <span className="text-sm">Profiles</span>
              <span className="text-sm font-medium">
                {(company.profiles && company.profiles.length) || 0}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2 gap-1">
              <span className="text-sm">Phone</span>
              <span className="text-sm font-medium">
                {(company.contact && company.contact.phone) || "No phone"}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2 gap-1">
              <span className="text-sm">Email</span>
              <span className="text-sm font-medium">
                {(company.contact && company.contact.email) || "No email"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-8 container">
        <Suspense fallback={<div>Loading...</div>}>
          <>{children}</>
        </Suspense>
      </div>
    </div>
  );
}
