"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import SelectTimeRange from "./SelectTimeRange";
import { redirect, useRouter } from "next/navigation";
import Running from "./Running";

const DateSelection = ({
  data,
  redirectTo,
  hidden,
  startSync,
  reval,
}: {
  data: {
    status: string;
    message: string;
  };
  redirectTo: string;
  hidden?: boolean;
  startSync: (startDate?: string, endDate?: string) => void;
  reval: () => void;
}) => {
  const { push } = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 1, 1),
    to: new Date(2024, 2, 1),
  });

  const [syncing, setSyncing] = useState(false);
  const [startedSyncing, setStartedSyncing] = useState(false);

  const [intervalId, setIntervalId] = useState();

  if (syncing && data.status === "Idle") {
    clearInterval(intervalId);
    push(redirectTo);
  }

  return (
    <>
      <div className="flex mt-5 w-full">
        {data && data.status === "Running" && (
          <Running data={data} reval={reval} />
        )}
        {!hidden && data && data.status === "Idle" && (
          <SelectTimeRange className="w-full" date={date} setDate={setDate} />
        )}
      </div>
      <div className="grow flex items-end justify-end mt-8">
        <Button
          disabled={date?.from === undefined || startedSyncing}
          onClick={async () => {
            setStartedSyncing(true);

            const interval = setInterval(() => {
              reval();
            }, 1000);
            setIntervalId(interval);

            startSync(date.from, date?.to);

            // sleep for 2 seconds
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setSyncing(true);
          }}
        >
          {startedSyncing ? "Syncing..." : "Continue"}
        </Button>
      </div>
    </>
  );
};

export default DateSelection;
