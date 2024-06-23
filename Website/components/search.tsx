"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ResultFilter from "./resultFilter";
import { Button } from "./ui/button";
import DateFilter from "./dateFilter";
import { format } from "date-fns";
import { FilterIcon, SearchIcon } from "lucide-react";
import SearchFiltersWrapper from "./searchFiltersWrapper";
import { Badge } from "./ui/badge";
import escapeStringRegexp from "escape-string-regexp";

const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState(searchParams.get("search")?.toString());
  const [source, setSource] = useState(searchParams.get("source")?.toString());

  const [amount, setAmount] = useState(searchParams.get("amount")?.toString());

  const [from, setFrom] = useState<Date | null>(
    searchParams.get("from")?.toString()
      ? new Date(searchParams.get("from")?.toString() || new Date())
      : null
  );
  const [to, setTo] = useState<Date | null>(
    searchParams.get("to")?.toString()
      ? new Date(searchParams.get("to")?.toString() || new Date())
      : null
  );

  const [hasSeller, setHasSeller] = useState(
    searchParams.get("seller")?.toString() === "true"
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const getParameters = () => {
    return [
      { name: "search", value: value },
      { name: "source", value: source },
      { name: "from", value: from ? format(from, "yyyy-MM-dd") : null },
      { name: "to", value: to ? format(to, "yyyy-MM-dd") : null },
      { name: "amount", value: amount },
      { name: "seller", value: hasSeller },
    ];
  };

  const search = () => {
    const params = new URLSearchParams(searchParams);
    const parameterList = getParameters();

    parameterList.forEach((param) => {
      if (param.value) {
        params.set(param.name, param.value);
      } else {
        params.delete(param.name);
      }
    });

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="w-full flex gap-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex gap-4 w-full"
        >
          <div className="relative flex-grow">
            <Input
              onChange={(e) => setValue(escapeStringRegexp(e.target.value))}
              placeholder="Search"
              defaultValue={value}
              className="pl-9 bg-white h-9 font-normal placeholder-[#949494]"
            />
            <SearchIcon
              className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground text-[#b6b6b6]"
              strokeWidth={2}
            />
          </div>
          <div className="relative inline-flex">
            <Button
              className="h-9 bg-white"
              variant="outline"
              type="button"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <FilterIcon className="mr-2 h-4 w-4" /> Filters
            </Button>
            {getParameters().filter((x) => x.value).length > 1 && (
              <span className="absolute rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-red-500 text-white border-2 border-background min-w-[24px] min-h-[24px]">
                {getParameters().filter((x) => x.value).length - 1}
              </span>
            )}
          </div>
          <Button onClick={search} className="h-9 px-5" type="submit">
            Search
          </Button>
        </form>
      </div>
      {isFiltersOpen && (
        <SearchFiltersWrapper
          source={source}
          setSource={setSource}
          searchParams={searchParams}
          replace={replace}
          pathname={pathname}
          amount={amount}
          setAmount={setAmount}
          hasSeller={hasSeller}
          setHasSeller={setHasSeller}
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
        />
      )}
    </>
  );
};

export default Search;
