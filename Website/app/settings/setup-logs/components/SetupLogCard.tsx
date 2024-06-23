import ResultLoadingAnimation from "@/app/matching/components/resultLoadingAnimation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, convertTime } from "@/lib/utils";
import { ILog } from "@/models/Log";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { DownloadIcon, ExternalLink, EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const SetupLogCard = ({ item }: { item: ILog }) => {
  TimeAgo.setDefaultLocale(en.locale);
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  if (item.type !== "setup") return;

  return (
    <div className="rounded-md border flex sm:flex-row flex-col bg-card text-card-foreground shadow-none px-5 py-4">
      <div className="flex sm:flex-row sm:grid sm:grid-cols-12 flex-col gap-4 w-full">
        <div className="flex flex-col sm:col-span-3 w-full">
          <span className="text-sm font-semibold">{item.name}</span>
          <span className="text-sm">
            {item.status === "error" && item.message}
          </span>
        </div>
        <div className="flex sm:col-span-2 w-full">
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
        <div
          className={cn(
            "flex flex-col items-start sm:col-span-4 w-full gap-2 sm:gap-0",
            item.status === "running" && "sm:col-span-6"
          )}
        >
          {item.status === "done" && (
            <>
              <span className="text-sm font-medium capitalize truncate w-full ml-1">
                {item.status === "done" &&
                  item.setupDetail &&
                  item.setupDetail.from &&
                  new Date(item.setupDetail.from).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
              </span>
              <span className="text-sm font-medium ml-1">
                {item.status === "done" &&
                  item.setupDetail &&
                  item.setupDetail.to &&
                  new Date(item.setupDetail.to).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
              </span>
            </>
          )}
          {item.status === "running" && (
            <span className="text-sm font-medium ml-1">{item.message}</span>
          )}
        </div>
        <Separator className="sm:hidden block" />
        <div
          className={cn(
            "flex flex-col items-start justify-start sm:col-span-2 w-full",
            item.status === "running" && "hidden"
          )}
        >
          {item.status != "running" && (
            <span className="text-sm capitalize font-medium">
              {timeAgo.format(new Date(item.startDateTime))}
            </span>
          )}
          <span className="text-sm capitalize font-medium">
            {item.startedBy} Sync
          </span>
        </div>
        <div
          className={cn(
            "flex items-center justify-end sm:col-span-1 w-full gap-2",
            item.status === "running" && "hidden"
          )}
        ></div>
      </div>
    </div>
  );
};

export default SetupLogCard;
