"use client";
import { Button } from "@/components/ui/button";
import {
  BanIcon,
  CheckIcon,
  DownloadIcon,
  ExternalLinkIcon,
  Loader2Icon,
} from "lucide-react";
import ResultLoadingAnimation from "./resultLoadingAnimation";
import { cn, convertTime } from "@/lib/utils";
import Link from "next/link";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import saveAs from "file-saver";
import { downloadBackup } from "@/actions/downloadBackup";
import { Separator } from "@/components/ui/separator";

const MatchingResultCard = ({ item }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  TimeAgo.setDefaultLocale(en.locale);
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  function base64ToBlob(
    base64String,
    contentType = "application/octet-stream"
  ) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
  }

  const download = (id, fileName) => {
    return downloadBackup(id).then((blob) => {
      saveAs(base64ToBlob(blob), fileName);
      return true;
    });
  };

  return (
    <div className="rounded-md border flex sm:flex-row flex-col bg-card text-card-foreground shadow-none px-5 py-4">
      <Link
        href={
          item.matchingDetail
            ? `/matching/${item.matchingDetail._id}`
            : "/matching"
        }
        rel="noopener noreferrer"
        target="_blank"
        className={cn(
          !item.matchingDetail && "pointer-events-none",
          "flex sm:flex-row flex-col gap-4 w-full cursor-pointer"
        )}
      >
        <div className="flex flex-col sm:w-4/12 w-full">
          <span className="text-sm font-semibold">{item.name}</span>
          <span className="text-sm">
            {item.status === "done" &&
              item.matchingDetail &&
              `${
                item.matchingDetail.matchedTedEntries +
                item.matchingDetail.matchedBeschaEntries
              }/${item.matchingDetail.totalEntries} Matched (${Math.round(
                ((item.matchingDetail.matchedTedEntries +
                  item.matchingDetail.matchedBeschaEntries) /
                  item.matchingDetail.totalEntries) *
                  100
              )}%)`}
            {item.status === "error" && item.message}
          </span>
        </div>
        <div className="flex sm:w-3/12 w-full">
          <div className="flex flex-col">
            <div className="flex content-start items-center">
              {item.status === "error" || item.status === "done" ? (
                <span
                  className={cn(
                    item.status === "error" && "bg-red-500",
                    item.status === "done" && "bg-green-500",
                    "w-2.5 h-2.5 rounded-full"
                  )}
                />
              ) : (
                <div
                  className={
                    "w-2.5 h-2.5 items-center content-center justify-center"
                  }
                >
                  <ResultLoadingAnimation />
                </div>
              )}
              <span className="text-sm font-medium capitalize ml-1">
                {item.status}
              </span>
            </div>
            <div className="flex justify-start items-center">
              <span className="w-2.5 h-2.5" />
              {item.startDateTime ? (
                <span className="text-sm ml-1" suppressHydrationWarning>
                  {item.status === "running"
                    ? convertTime(
                        (new Date().getTime() -
                          new Date(item.startDateTime).getTime()) /
                          1000
                      )
                    : convertTime(
                        (new Date(item.endDateTime).getTime() -
                          new Date(item.startDateTime).getTime()) /
                          1000
                      )}
                </span>
              ) : (
                <span className="text-xs">0s</span>
              )}
            </div>
          </div>
        </div>
        <Separator className="sm:hidden block" />
        <div className="flex flex-col items-start sm:w-2/12 w-full gap-2 sm:gap-0">
          {item.status === "done" && (
            <>
              <span className="text-sm font-medium capitalize ml-1">
                {item.matchingDetail &&
                  item.matchingDetail.matchedBeschaEntries}{" "}
                Bescha Entries
              </span>
              <span className="text-sm font-medium capitalize ml-1">
                {item.matchingDetail && item.matchingDetail.matchedTedEntries}{" "}
                Ted Entries
              </span>
            </>
          )}
          {item.status === "running" && (
            <span className="text-sm font-medium capitalize ml-1">
              {item.message}
            </span>
          )}
        </div>
        <Separator className="sm:hidden block" />
        <div className="flex items-start justify-start sm:w-1/12 w-full gap-2">
          {item.status != "running" && (
            <span className="text-sm capitalize font-medium">
              {timeAgo.format(new Date(item.startDateTime))}
            </span>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-end sm:w-1/12 w-full gap-2">
        {item.status === "done" && item.matchingDetail && (
          <>
            <Button
              onClick={() => {
                setIsDownloading(true);
                download(item.matchingDetail._id, item.matchingDetail.name)
                  .then(() => {
                    setIsDownloading(false);
                  })
                  .catch(() => {
                    setIsDownloading(false);
                  });
              }}
              variant="ghost"
              className="p-3"
            >
              {isDownloading ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <DownloadIcon className="w-4 h-4" />
              )}
            </Button>
            <Link
              href={`/matching/${item.matchingDetail._id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button variant="ghost" className="shadow-none p-3">
                <ExternalLinkIcon className="h-4 w-4" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchingResultCard;
