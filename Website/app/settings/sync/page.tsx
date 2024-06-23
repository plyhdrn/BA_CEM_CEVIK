import SearchCompany from "@/components/searchCompany";
import React, { Suspense } from "react";
import StartWebsiteSync from "./components/startWebsiteSync";
import WebsiteSyncResults from "./components/websiteSyncResults";

interface SearchParams extends URLSearchParams {
  search?: string;
  page?: string;
}

const WebsiteFinder = ({ searchParams }: { searchParams?: SearchParams }) => {
  return (
    <div className="container flex flex-col">
      <div className="flex sm:flex-row flex-col justify-between sm:items-end sm:gap-0 gap-4 py-8">
        <div className="flex-col justify-start">
          <h1 className="text-4xl font-semibold">Website Finder</h1>
          <span className="text-sm">Find website</span>
        </div>
        <StartWebsiteSync />
      </div>
      <SearchCompany name={"Company Name"} />
      <div className="flex flex-col mt-4 gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <WebsiteSyncResults
            searchParams={searchParams}
            key={new Date().getTime()}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default WebsiteFinder;
