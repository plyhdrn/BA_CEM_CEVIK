"use client";

import { getMatchingData } from "@/actions/getMatchingData";
import { Button } from "@/components/ui/button";
import saveAs from "file-saver";
import { Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import useSWR, { useSWRConfig } from "swr";
import MatchingResultCard from "./components/matchingResultCard";

const Table = ({ res, page }) => {
  const router = useRouter();

  const connectToStream = (page) => {
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
    if (page !== "1" && page) return;
    const eventSource = connectToStream(page);
    // As the component unmounts, close listener to SSE API
    return () => {
      console.log("Closing connection");
      eventSource.close();
    };
  }, [page]);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Fade duration={800} triggerOnce cascade damping={0}>
          {res.map((item, i) => (
            <MatchingResultCard key={item._id} item={item} />
          ))}
        </Fade>
      </div>
    </div>
  );
};

export default Table;
