import { Metadata } from "next";
import mongoose from "mongoose";
import Meta from "@/models/Meta";
import { Suspense } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, DownloadIcon, EyeIcon } from "lucide-react";
import Page404 from "@/components/page404";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface MetaLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function MetaLayout({
  children,
  params,
}: MetaLayoutProps) {
  try {
    new mongoose.Types.ObjectId(params.id);
  } catch (e) {
    return <Page404 />;
  }
  const id = new mongoose.Types.ObjectId(params.id);

  const meta = await Meta.findOne({
    _id: id,
  });

  if (!meta) return <Page404 />;

  return (
    <div className="flex flex-col">
      <div className="container">
        <div className="flex flex-col justify-end sm:py-8 py-2 gap-3">
          <div className="flex justify-between sm:flex-row flex-col-reverse">
            <div className="flex flex-col sm:w-4/5 w-full">
              <div className="flex justify-start items-center gap-2 sm:mt-0 mt-5">
                {meta.source === "bescha" ? (
                  <div className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-700/10">
                    BESCHA - {meta.entryId}
                  </div>
                ) : (
                  <div className="inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    TED - {meta.entryId}
                  </div>
                )}
              </div>
              <h1 className="lg:text-4xl md:text-2xl sm:text-xl font-semibold">
                {meta.title}
              </h1>
              <span className="text-sm font-medium truncate mt-1">
                {meta.description.slice(0, 100) || "No description"}
              </span>
            </div>
            <div className="flex gap-4 sm:items-start items-end justify-end">
              <div className="mt-6 flex flex-row border bg-green-50 border-green-600/20 rounded-md items-center justify-center">
                {meta.source === "bescha" ? (
                  <Link
                    href={`https://www.oeffentlichevergabe.de/ui/en/search/details?noticeId=${meta.entryId}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="w-full"
                  >
                    <Button
                      variant="secondary"
                      className="shadow-none w-full hover:bg-blue-100 bg-blue-50 ring-blue-700/10 text-blue-500"
                    >
                      <EyeIcon className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`https://ted.europa.eu/de/notice/-/detail/${meta.entryId}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="w-full"
                    >
                      <Button
                        variant="secondary"
                        className="shadow-none w-full hover:bg-green-100 bg-green-50 rounded-r-none text-green-700 "
                      >
                        <EyeIcon className="mr-2 h-4 w-4 text-green-700 " />
                        View
                      </Button>
                    </Link>
                    <Separator
                      orientation="vertical"
                      className="h-[20px] bg-green-600/20"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          className="px-2 shadow-none rounded-l-none hover:bg-green-100 bg-green-50 text-green-700"
                        >
                          <ChevronDownIcon className="h-4 w-4 text-green-700" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        alignOffset={-5}
                        className="w-[200px]"
                        forceMount
                      >
                        <DropdownMenuLabel>Alternatives</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`https://ted.europa.eu/en/notice/${meta.entryId}/xml`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="flex"
                          >
                            <DownloadIcon className="mr-2 h-4 w-4" /> XML
                            Download
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`https://ted.europa.eu/de/notice/${meta.entryId}/pdf`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="flex"
                          >
                            <DownloadIcon className="mr-2 h-4 w-4" /> PDF
                            Download
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`https://ted.europa.eu/de/notice/${meta.entryId}/pdfs`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="flex"
                          >
                            <DownloadIcon className="mr-2 h-4 w-4" /> PDFs
                            Download
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`https://ted.europa.eu/de/notice/${meta.entryId}/html`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="flex"
                          >
                            <DownloadIcon className="mr-2 h-4 w-4" /> HTML
                            Direct
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 justify-between mt-4">
            <div className="flex flex-col sm:col-span-1 col-span-2">
              <span className="text-sm">Buyer Count</span>
              <span className="text-sm font-medium truncate">
                {meta.buyers && meta.buyers.length}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2">
              <span className="text-sm">Seller Count</span>
              <span className="text-sm font-medium truncate">
                {meta.sellers && meta.sellers.length}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2 gap-1">
              <span className="text-sm">Amount</span>
              <span className="text-sm font-medium truncate">
                {meta.amount && meta.amount.amount
                  ? meta.amount.amount.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-1 col-span-2 gap-1">
              <span className="text-sm">Publish Date</span>
              <span className="text-sm font-medium truncate">
                {format(meta.publishDate.split("+")[0], "dd/MM/yyyy")}
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
