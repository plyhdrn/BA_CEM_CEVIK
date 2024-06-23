"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ResultFilter from "./resultFilter";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import escapeStringRegexp from "escape-string-regexp";

const SearchCompany = ({ name }: { name?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState(searchParams.get("search")?.toString());

  const search = () => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    if (params.get("page")) params.delete("page");

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full flex gap-3">
      <div className="relative flex-grow">
        <Input
          onChange={(e) => setValue(escapeStringRegexp(e.target.value))}
          placeholder={`Search ${name || ""}`}
          defaultValue={value}
          className="pl-9 bg-white h-9 font-normal placeholder-[#949494]"
        />
        <SearchIcon
          className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground text-[#b6b6b6]"
          strokeWidth={2}
        />
      </div>
      <Button onClick={search} className="h-9 px-5" type="submit">
        Search
      </Button>
    </form>
  );
};

export default SearchCompany;
