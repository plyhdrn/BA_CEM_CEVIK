"use client";
import { ILog } from "@/models/Log";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import ProfileResultCard from "./profileResultCard";

const ProfileWrapper = ({ logs, page }: { logs: ILog[]; page?: string }) => {
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
          {logs.map((item, i) => (
            <ProfileResultCard key={item._id} item={item} />
          ))}
        </Fade>
      </div>
    </div>
  );
};

export default ProfileWrapper;
