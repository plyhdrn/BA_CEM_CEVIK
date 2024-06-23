"use client";
import ResultLoadingAnimation from "@/app/matching/components/resultLoadingAnimation";
import SelectTimeRange from "@/app/setup/components/SelectTimeRange";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, convertTime } from "@/lib/utils";
import { ILog } from "@/models/Log";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
  ListStartIcon,
  PlayIcon,
  PlusIcon,
  RefreshCcwIcon,
} from "lucide-react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

const CollapsibleItems = ({
  setIsSyncing,
  isSyncing,
  startSync,
  setIsOpen,
  date,
  setDate,
  name,
}: {
  setIsSyncing: (value: boolean) => void;
  isSyncing: boolean;
  startSync: (from?: string, to?: string) => void;
  setIsOpen: (value: boolean) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  name: string;
}) => {
  return (
    <div className="flex flex-row items-center px-4 py-4 w-full gap-3 justify-end">
      {name !== "Company" && (
        <SelectTimeRange className="w-full" date={date} setDate={setDate} />
      )}
      <Button
        onClick={() => {
          setIsSyncing(true);
          startSync(date?.from, date?.to);
          setIsOpen(false);
          setIsSyncing(false);
        }}
        disabled={isSyncing}
        className="w-20"
      >
        Start
      </Button>
    </div>
  );
};

const Entry = ({
  name,
  beschaEntry,
  startSync,
  blocked = false,
  className,
}: {
  name: string;
  beschaEntry: ILog;
  startSync: (from?: string, to?: string) => void;
  blocked?: boolean;
  className?: string;
}) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 1, 1),
    to: new Date(2024, 2, 1),
  });

  const [isOpen, setIsOpen] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);

  if (!beschaEntry) {
    return (
      <div className={cn(className)}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex flex-row items-center px-4 py-4 w-full gap-3">
            <div className="flex w-10 h-10 border items-center justify-center rounded-full bg-gray-50 ring-1 ring-inset ring-gray-400/50">
              <PlusIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex flex-col flex-grow h-full">
              <span className="text-sm font-semibold">{name}</span>
            </div>
            <div className="flex items-center justify-center">
              <CollapsibleTrigger
                asChild
                disabled={blocked}
                className="disabled:text-muted-foreground"
              >
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="">
            <CollapsibleItems
              setIsSyncing={setIsSyncing}
              isSyncing={isSyncing}
              startSync={startSync}
              setIsOpen={setIsOpen}
              date={date}
              setDate={setDate}
              name={name}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  if (beschaEntry && beschaEntry.status === "running") {
    return (
      <div className={cn(className)}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex flex-row items-center px-4 py-4 w-full gap-3">
            <div className="flex sm:w-10 sm:h-10 h-5 w-5 border items-center justify-center rounded-full bg-blue-50 ring-1 ring-inset ring-blue-400/50">
              <ResultLoadingAnimation className="sm:w-3 sm:h-3 h-2 w-2" />
            </div>
            <div className="flex flex-col flex-grow h-full">
              <span className="text-sm font-semibold">{name}</span>
              <span className="text-xs">{beschaEntry.message}</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium px-3">
                {convertTime(
                  (new Date().getTime() -
                    new Date(beschaEntry.startDateTime).getTime()) /
                    1000
                )}
              </span>
            </div>
          </div>
          <CollapsibleContent className="">
            <CollapsibleItems
              setIsSyncing={setIsSyncing}
              isSyncing={isSyncing}
              startSync={startSync}
              setIsOpen={setIsOpen}
              date={date}
              setDate={setDate}
              name={name}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  if (beschaEntry && beschaEntry.status === "error") {
    return (
      <div className={cn(className)}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex flex-row items-center px-4 py-4 w-full gap-3">
            <div className="flex sm:w-10 sm:h-10 h-5 w-5 border items-center justify-center rounded-full bg-red-50 ring-1 ring-inset ring-red-400/50">
              <RefreshCcwIcon className="sm:w-4 sm:h-4 h-2 w-2 text-red-700" />
            </div>
            <div className="flex flex-col flex-grow h-full">
              <span className="text-sm font-semibold">{name}</span>
              <span className="text-xs">
                {beschaEntry.message} - Please try again
              </span>
            </div>
            <div className="flex items-center justify-center">
              <CollapsibleTrigger
                asChild
                disabled={blocked}
                className="disabled:text-muted-foreground"
              >
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="">
            <CollapsibleItems
              setIsSyncing={setIsSyncing}
              isSyncing={isSyncing}
              startSync={startSync}
              setIsOpen={setIsOpen}
              date={date}
              setDate={setDate}
              name={name}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex flex-row items-center px-4 py-4 w-full gap-3">
          <div className="flex sm:w-10 sm:h-10 h-5 w-5 border items-center justify-center rounded-full bg-green-50 ring-1 ring-inset ring-green-600/50">
            <CheckIcon className="sm:w-4 sm:h-4 h-2 w-2 text-green-700" />
          </div>
          <div className="flex flex-col flex-grow h-full">
            <span className="text-sm font-semibold">{name}</span>
            <span className="text-xs">
              {beschaEntry.type === "setup" &&
                beschaEntry.setupDetail &&
                beschaEntry.setupDetail.from &&
                beschaEntry.setupDetail.to && (
                  <>
                    {new Date(beschaEntry.setupDetail.from).toLocaleDateString(
                      "de-DE",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}{" "}
                    -{" "}
                    {new Date(beschaEntry.setupDetail.to).toLocaleDateString(
                      "de-DE",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </>
                )}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <CollapsibleTrigger
              asChild
              disabled={blocked}
              className="disabled:text-muted-foreground"
            >
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="">
          <CollapsibleItems
            setIsSyncing={setIsSyncing}
            isSyncing={isSyncing}
            startSync={startSync}
            setIsOpen={setIsOpen}
            date={date}
            setDate={setDate}
            name={name}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Entry;
