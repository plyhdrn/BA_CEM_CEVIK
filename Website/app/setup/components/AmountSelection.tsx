"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import SelectTimeRange from "./SelectTimeRange";
import { redirect, useRouter } from "next/navigation";
import Running from "./Running";
import { Input } from "@/components/ui/input";

const AmountSelection = ({
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
  startSync: (limit: number) => void;
  reval: () => void;
}) => {
  const { push } = useRouter();
  const [amount, setAmount] = useState<number | undefined>(0);

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
          <Input
            type="number"
            label="Amount"
            min={5}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
          />
        )}
      </div>
      <div className="grow flex items-end justify-end mt-8">
        <Button
          disabled={amount === undefined || startedSyncing}
          onClick={async () => {
            setStartedSyncing(true);

            const interval = setInterval(() => {
              reval();
            }, 1000);
            setIntervalId(interval);

            startSync(amount);

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

export default AmountSelection;
