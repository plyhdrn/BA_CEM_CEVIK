import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { IMetaView } from "@/models/Meta";
import { cn } from "@/lib/utils";
import {
  BadgeEuroIcon,
  DollarSignIcon,
  EuroIcon,
  HandCoinsIcon,
  ExternalLinkIcon,
  HandshakeIcon,
  EyeIcon,
  DownloadIcon,
  CalendarIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { format, parseISO } from "date-fns";

const ResultCard = ({ meta }: { meta: IMetaView }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col bg-white border rounded-lg px-6 py-6">
        <div className="flex flex-col-reverse sm:flex-row sm:gap-0 gap-4 justify-between">
          <div className="flex flex-col justify-start items-start gap-1">
            <div className="flex sm:flex-row flex-col justify-start sm:items-center items-start gap-2">
              <div className="flex">
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
              <div className="flex">
                {meta.buys && (
                  <div className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    BUYS
                  </div>
                )}
                {meta.sells && (
                  <div className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    SELLS
                  </div>
                )}
              </div>
            </div>
            <span className="sm:text-lg text-md font-semibold">
              {meta.title}
            </span>
          </div>
          <div className="flex items-start sm:justify-center justify-end gap-2">
            <div className="flex flex-row border bg-green-50 border-green-600/20 rounded-md items-center justify-center">
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
                          <DownloadIcon className="mr-2 h-4 w-4" /> XML Download
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={`https://ted.europa.eu/de/notice/${meta.entryId}/pdf`}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="flex"
                        >
                          <DownloadIcon className="mr-2 h-4 w-4" /> PDF Download
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
                          <DownloadIcon className="mr-2 h-4 w-4" /> HTML Direct
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
            <div className="flex items-center rounded-md text-secondary-foreground">
              <Link
                href={`/overview/${meta._id}`}
                rel="noopener noreferrer"
                target="_blank"
                className="w-full"
              >
                <Button variant="ghost" className="shadow-none w-full">
                  <ExternalLinkIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-3">
          <span className="sm:text-sm text-xs text-[#272727] break-all">
            {meta.description?.substring(0, 650)}
          </span>
        </div>
        <div className="sm:flex grid grid-cols-2 justify-between flex-row mt-7">
          <div className="flex flex-col col-span-1 gap-1 sm:w-1/4">
            <div className="flex align-middle items-center">
              <HandshakeIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
              <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
                BUYER
              </span>
            </div>
            <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold">
              {meta.buyers && meta.buyers.length > 0
                ? meta.buyers.length > 1
                  ? `${
                      meta.buyers[0].name.length > 30
                        ? meta.buyers[0].name.substring(0, 30) + "..."
                        : meta.buyers[0].name
                    } +${meta.buyers.length - 1} more`
                  : `${
                      meta.buyers[0].name.length > 30
                        ? meta.buyers[0].name.substring(0, 30) + "..."
                        : meta.buyers[0].name
                    }`
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-col col-span-1 gap-1 sm:w-1/4">
            <div className="flex align-middle items-center">
              <HandCoinsIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
              <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
                SELLER
              </span>
            </div>
            <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold">
              {meta.sellers && meta.sellers.length > 0
                ? meta.sellers.length > 1
                  ? `${
                      meta.sellers[0].name.length > 30
                        ? meta.sellers[0].name.substring(0, 30) + "..."
                        : meta.sellers[0].name
                    } +${meta.sellers.length - 1} more`
                  : `${
                      meta.sellers[0].name.length > 30
                        ? meta.sellers[0].name.substring(0, 30) + "..."
                        : meta.sellers[0].name
                    }`
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-col col-span-1 gap-1 sm:w-1/4">
            <div className="flex align-middle items-center">
              <DollarSignIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
              <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
                AMOUNT
              </span>
            </div>
            <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold">
              {meta.amount && meta.amount.amount
                ? meta.amount.amount.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-col col-span-1 gap-1 sm:w-1/4">
            <div className="flex align-middle items-center">
              <CalendarIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
              <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
                PUBLISH DATE
              </span>
            </div>
            <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold">
              {format(meta.publishDate.split("+")[0], "dd/MM/yyyy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
