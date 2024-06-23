"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ResultFilter from "./resultFilter";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import escapeStringRegexp from "escape-string-regexp";

const SearchRealTime = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      search(value);
    },
    // delay in ms
    1000
  );
  const search = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }

    if (params.get("page")) params.delete("page");

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full flex gap-3">
      <div className="relative flex-grow">
        <Input
          onChange={(e) => debounced(escapeStringRegexp(e.target.value))}
          placeholder="Search by Name"
          defaultValue={searchParams.get("search")?.toString()}
          className="pl-9 bg-white h-9 font-normal placeholder-[#949494]"
        />
        <SearchIcon
          className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground text-[#b6b6b6]"
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

export default SearchRealTime;
