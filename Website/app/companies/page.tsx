import CompanyAnalytics from "@/components/companyAnalytics";
import Results from "@/components/results";
import ResultsCompany from "@/components/resultsCompany";
import Search from "@/components/search";
import SearchCompany from "@/components/searchCompany";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Companies({
  searchParams,
}: {
  searchParams?: {
    search?: string;
  };
}) {
  const search = searchParams;
  return (
    <main className="container">
      <div className="my-10 flex gap-5 flex-col">
        <Suspense
          fallback={<Skeleton className="w-full h-[60px] rounded-lg" />}
        >
          <CompanyAnalytics />
        </Suspense>
        <SearchCompany />
        <Suspense
          key={search}
          fallback={
            <div className="flex gap-2 flex-col">
              <Skeleton className="w-full h-[134px] rounded-lg" />
              <Skeleton className="w-full h-[134px] rounded-lg" />
              <Skeleton className="w-full h-[134px] rounded-lg" />
              <Skeleton className="w-full h-[134px] rounded-lg" />
            </div>
          }
        >
          <ResultsCompany searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
