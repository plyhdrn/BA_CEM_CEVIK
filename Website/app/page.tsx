import GeneralAnalytics from "@/components/generalAnalytics";
import Results from "@/components/results";
import Search from "@/components/search";
import { Skeleton } from "@/components/ui/skeleton";
import dbConnect from "@/lib/dbConnect";
import Meta from "@/models/Meta";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    source?: string;
    from?: string;
    to?: string;
    amount?: string;
    page?: string;
    sort?: "relevant" | "newest" | "oldest" | "az" | "za";
  };
}) {
  const search = searchParams;

  return (
    <main className="container">
      <div className="my-10 flex gap-5 flex-col">
        <Suspense
          fallback={<Skeleton className="w-full h-[60px] rounded-lg" />}
        >
          <GeneralAnalytics />
        </Suspense>
        <Search />
        <Suspense
          key={
            search?.search +
            search?.source +
            search?.from +
            search?.to +
            search?.amount +
            search?.page +
            search?.sort
          }
          fallback={
            <div className="flex gap-2 flex-col">
              <Skeleton className="w-full h-[134px] rounded-lg" />
              <Skeleton className="w-full h-[134px] rounded-lg" />
              <Skeleton className="w-full h-[134px] rounded-lg" />
              <Skeleton className="w-full h-[134px] rounded-lg" />
            </div>
          }
        >
          <Results searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
