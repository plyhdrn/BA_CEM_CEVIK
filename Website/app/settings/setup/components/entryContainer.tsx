"use client";

import { useRouter } from "next/navigation";
import BeschaEntry from "./beschaEntry";
import { useEffect } from "react";
import { ILog } from "@/models/Log";
import Entry from "./entry";

const EntryContainer = ({
  beschaEntry,
  tedEntry,
  companyEntry,
  startBeschaSync,
  startTedSync,
  startCompanySync,
}: {
  beschaEntry: ILog;
  tedEntry: ILog;
  companyEntry: ILog;
  startBeschaSync: (startDate?: string, endDate?: string) => void;
  startTedSync: (startDate?: string, endDate?: string) => void;
  startCompanySync: (startDate?: string, endDate?: string) => void;
}) => {
  const router = useRouter();

  const connectToStream = () => {
    console.log("Connecting to stream");

    // Connect to /api/stream as the SSE API source
    const eventSource = new EventSource("/api/stream");
    eventSource.addEventListener("message", (event) => {
      console.log("Message received", event.data);
      router.refresh();
    });
    // In case of any error, close the event source
    // So that it attempts to connect again
    eventSource.addEventListener("error", () => {
      eventSource.close();
      setTimeout(connectToStream, 1);
    });
    // As soon as SSE API source is closed, attempt to reconnect
    eventSource.onclose = () => {
      // setTimeout(connectToStream, 1);
    };
    console.log("Connected to stream");
    return eventSource;
  };

  useEffect(() => {
    const eventSource = connectToStream();
    // As the component unmounts, close listener to SSE API
    return () => {
      console.log("Closing connection");
      eventSource.close();
    };
  }, []);

  return (
    <>
      <Entry
        className="flex flex-col border-b"
        name="BESCHA"
        beschaEntry={beschaEntry}
        startSync={startBeschaSync}
        blocked={
          (tedEntry && tedEntry.status !== "done") ||
          (companyEntry && companyEntry.status !== "done")
        }
      />
      <Entry
        className="flex flex-col border-b"
        name="TED"
        beschaEntry={tedEntry}
        startSync={startTedSync}
        blocked={
          (beschaEntry && beschaEntry.status !== "done") ||
          (companyEntry && companyEntry.status !== "done")
        }
      />
      <Entry
        className="flex flex-col"
        name="Company"
        beschaEntry={companyEntry}
        startSync={startCompanySync}
        blocked={
          !(
            tedEntry &&
            tedEntry.status === "done" &&
            beschaEntry &&
            beschaEntry.status === "done"
          )
        }
      />
    </>
  );
};

export default EntryContainer;
