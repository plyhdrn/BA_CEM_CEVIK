"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

const sortOptions = [
  { value: "newest", label: "Date (Newest)" },
  { value: "oldest", label: "Date (Oldest)" },
  { value: "az", label: "Alphabetical (A-Z)" },
  { value: "za", label: "Alphabetical (Z-A)" },
];

const ResultSorter = ({ allowedSorts = ["newest", "oldest", "az", "za"] }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState(
    searchParams.get("sort")?.toString() || "relevant"
  );

  const sort = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e) {
      params.set("sort", e);
    } else {
      params.delete("sort");
    }

    if (params.get("page")) params.delete("page");

    setValue(e);

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      defaultValue={value}
      onValueChange={(e) => {
        sort(e);
      }}
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Select a sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="relevant">Relevance</SelectItem>
          {allowedSorts.map((sort) => {
            const option = sortOptions.find((o) => o.value === sort);
            return (
              <SelectItem key={sort} value={sort}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ResultSorter;
