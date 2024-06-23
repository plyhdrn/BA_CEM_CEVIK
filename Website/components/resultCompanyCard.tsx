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
import { cn, normalizeURL } from "@/lib/utils";
import {
  BadgeEuroIcon,
  DollarSignIcon,
  EuroIcon,
  ExternalLinkIcon,
  HandCoinsIcon,
  HandshakeIcon,
  MailIcon,
  PhoneIcon,
  TagIcon,
  EyeIcon,
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
import { ICompany } from "@/models/Company";

const ResultCompanyCard = ({ company }: { company: ICompany }) => {
  return (
    <div className="flex flex-col bg-white border rounded-lg px-6 py-6">
      <div className="flex flex-col-reverse sm:flex-row sm:gap-0 gap-4  justify-between">
        <div className="flex flex-col justify-start items-start gap-1">
          <div className="flex sm:flex-row flex-col justify-start sm:items-center items-start gap-2">
            <div className="flex">
              {company.error && (
                <div className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
                  FAILED
                </div>
              )}
              {company.success && (
                <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                  FOUND
                </div>
              )}
              {company.isBuyer && (
                <div className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                  BUYS
                </div>
              )}
              {company.isSeller && (
                <div className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  SELLS
                </div>
              )}
            </div>
          </div>
          <span className="sm:text-lg text-md font-semibold">
            {company.name}
          </span>
        </div>
        <div className="flex gap-2 items-end">
          {company.internetAddress && (
            <Link
              href={normalizeURL(company.internetAddress)}
              rel="noopener noreferrer"
              target="_blank"
              className="w-full"
            >
              <Button variant="secondary" className="shadow-none w-full">
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </Button>
            </Link>
          )}
          <div className="flex items-center rounded-md text-secondary-foreground">
            <Link
              href={`/companies/${company._id}`}
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
      <div className="flex">
        <span className="sm:text-sm text-xs text-[#272727]">
          {company.address}
        </span>
      </div>
      <div className="sm:flex grid grid-cols-2 justify-between flex-row mt-7">
        <div className="flex flex-col col-span-1 gap-1 sm:w-1/5">
          <div className="flex align-middle items-center">
            <TagIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
            <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
              ALTERNATIVE NAMES
            </span>
          </div>
          <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold truncate">
            {company.alternativeNames && company.alternativeNames.length > 1
              ? company.alternativeNames.length - 1
              : 0}
          </span>
        </div>
        <div className="flex flex-col col-span-1 gap-1 sm:w-1/5">
          <div className="flex align-middle items-center">
            <HandshakeIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
            <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
              BUYS
            </span>
          </div>
          <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold truncate">
            {company.buys && company.buys.length > 0 ? company.buys.length : 0}
          </span>
        </div>
        <div className="flex flex-col col-span-1 gap-1 sm:w-1/5">
          <div className="flex align-middle items-center">
            <HandCoinsIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
            <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
              SELLS
            </span>
          </div>
          <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold truncate">
            {company.sells && company.sells.length > 0
              ? company.sells.length
              : 0}
          </span>
        </div>
        <div className="flex flex-col col-span-1 gap-1 sm:w-1/5">
          <div className="flex align-middle items-center">
            <PhoneIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
            <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
              PHONE
            </span>
          </div>
          <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold truncate">
            {company.contact && company.contact.phone
              ? company.contact.phone
              : "N/A"}
          </span>
        </div>
        <div className="flex flex-col col-span-1 gap-1 sm:w-1/5">
          <div className="flex align-middle items-center">
            <MailIcon className="h-4 w-4 text-[#6d6d6d] mr-1" />
            <span className="sm:text-sm text-xs text-[#6d6d6d] font-medium">
              EMAIL
            </span>
          </div>
          <span className="sm:text-sm text-xs text-[#2d2d2d] font-semibold truncate">
            {company.contact && company.contact.email
              ? company.contact.email
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultCompanyCard;
