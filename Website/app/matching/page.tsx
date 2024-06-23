import Log from "@/models/Log";
import UploadDB from "./components/uploadDB";
import Table from "./table";
import { getMatchingData } from "@/actions/getMatchingData";
import ResultPagination from "@/components/resultPagination";
import SearchCompany from "@/components/searchCompany";
import Matching from "@/models/Matching";
import MatchingResWrapper from "./components/matchingResWrapper";
import { Suspense } from "react";

interface SearchParams extends URLSearchParams {
  search?: string;
  page?: string;
}

const MatchingPage = async ({
  searchParams,
}: {
  searchParams?: SearchParams;
}) => {
  return (
    <div className="container flex flex-col">
      <div className="flex sm:flex-row flex-col justify-between sm:items-end sm:gap-0 gap-4 py-8">
        <div className="flex-col justify-start">
          <h1 className="text-4xl font-semibold">Matching</h1>
          <span className="text-sm">Match entries</span>
        </div>
        <UploadDB />
      </div>
      <SearchCompany name={"Matching Files"} />
      <div className="flex flex-col mt-4 gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <MatchingResWrapper
            searchParams={searchParams}
            key={new Date().getTime()}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default MatchingPage;
