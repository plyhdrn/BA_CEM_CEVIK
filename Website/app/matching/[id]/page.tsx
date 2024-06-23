import Matching from "@/models/Matching";
import mongoose from "mongoose";
import DataViewer from "./components/dataViewer";
import SearchCompany from "@/components/searchCompany";
import ResultPagination from "@/components/resultPagination";
import SearchRealTime from "@/components/searchRealTime";
import CompareView from "./components/compareView";
import { Suspense } from "react";
import CompareLoading from "./components/compareLoading";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import DownloadExport from "./components/downloadExport";
import Page404 from "@/components/page404";

interface SearchParams extends URLSearchParams {
  search?: string;
  page?: string;
}

const MatchingDetailPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: SearchParams;
}) => {
  try {
    new mongoose.Types.ObjectId(params.id);
  } catch (e) {
    return <Page404 />;
  }

  const id = new mongoose.Types.ObjectId(params.id);
  const matching = await Matching.findOne({
    _id: id,
  });

  if (!matching) return <Page404 />;

  return (
    <div className="flex flex-col">
      <div className="container">
        <div className="flex flex-col justify-end py-8 gap-3">
          <div className="flex sm:flex-row flex-col sm:gap-0 gap-3 justify-between">
            <h1 className="text-4xl font-semibold">{matching.name}</h1>
            <DownloadExport matching={matching} />
          </div>
          <div className="flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Bescha entries</span>
              <span className="text-sm font-medium">
                {matching.matchedBeschaEntries}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Ted entries</span>
              <span className="text-sm font-medium">
                {matching.matchedTedEntries}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Total entries</span>
              <span className="text-sm font-medium">
                {matching.totalEntries}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Matched entries</span>
              <span className="text-sm font-medium">
                {matching.matchedBeschaEntries + matching.matchedTedEntries}/
                {matching.totalEntries} (
                {Math.round(
                  ((matching.matchedBeschaEntries +
                    matching.matchedTedEntries) /
                    matching.totalEntries) *
                    100
                )}
                %)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Start Date</span>
              <span className="text-sm font-medium">
                {new Date(matching.createdAt).toString().slice(0, 24)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-8 container">
        <SearchRealTime />
        <Suspense
          fallback={<CompareLoading />}
          key={searchParams?.search ?? "0" + searchParams?.page ?? 0}
        >
          <CompareView searchParams={searchParams} id={id} />
        </Suspense>
      </div>
    </div>
  );
};

export default MatchingDetailPage;
