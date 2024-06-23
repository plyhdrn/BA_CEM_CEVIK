"use client";
import { LoaderIcon } from "lucide-react";
import React, { useEffect } from "react";

const Running = ({
  data,
  reval,
}: {
  data: {
    status: string;
    message: string;
  };
  reval: () => void;
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      reval();
    }, 1000);
    return () => clearInterval(interval);
  }, [reval]);
  return (
    <div className="flex mt-4 w-full items-center">
      <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
      <div className="text-sm">{data.message}</div>
    </div>
  );
};

export default Running;
