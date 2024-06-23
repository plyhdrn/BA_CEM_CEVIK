import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const ResultPagination = ({ searchParams, totalPages }) => {
  return (
    <Pagination>
      <PaginationContent>
        {(searchParams?.page || 1) > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={{
                search: new URLSearchParams({
                  ...searchParams,
                  page: (parseInt(searchParams?.page || 1) - 1).toString(),
                }).toString(),
              }}
            />
          </PaginationItem>
        )}
        {Array.from(
          { length: 10 },
          (_, i) => parseInt(searchParams.page || 1) + i - 5
        )
          .filter((page) => page > 0 && page <= totalPages)
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === parseInt(searchParams?.page || 1)}
                href={{
                  search: new URLSearchParams({
                    ...searchParams,
                    page: page.toString(),
                  }).toString(),
                }}
                className={cn(
                  page === parseInt(searchParams?.page || 1) && "bg-white"
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        {(searchParams?.page || 1) < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={{
                search: new URLSearchParams({
                  ...searchParams,
                  page: (parseInt(searchParams?.page || 1) + 1).toString(),
                }).toString(),
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default ResultPagination;
