import React, { Suspense } from "react";
import SetupLogResults from "./components/SetupLogResults";

interface SearchParams extends URLSearchParams {
  page?: string;
}

const SetupLogsPage = ({ searchParams }: { searchParams?: SearchParams }) => {
  return (
    <div className="container flex flex-col">
      <div className="flex sm:flex-row flex-col justify-between sm:items-end sm:gap-0 gap-4 py-8">
        <div className="flex-col justify-start">
          <h1 className="text-4xl font-semibold">Setup Logs</h1>
          <span className="text-sm">Setup Logs entries</span>
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SetupLogResults
            searchParams={searchParams}
            key={new Date().getTime()}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default SetupLogsPage;
