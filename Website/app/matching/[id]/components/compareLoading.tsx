import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CompareLoading = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.apply(null, { length: 4 }).map((e, i) => (
        <Skeleton className="w-full h-[430px] mt-2 opacity-20" key={i} />
      ))}
    </div>
  );
};

export default CompareLoading;
