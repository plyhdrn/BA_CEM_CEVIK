"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AmountFilter from "./amountFilter";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

type Status = "both" | "bescha" | "ted";

const statuses: Status[] = ["both", "bescha", "ted"];

const ResultFilter = ({
  source,
  setSource,
  searchParams,
  replace,
  pathname,
  amount,
  setAmount,
  hasSeller,
  setHasSeller,
}) => {
  const [open, setOpen] = useState(false);

  const sourceChange = (value) => {
    setSource(statuses.find((priority) => priority === value) || null);
    setOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Source</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[150px] justify-between capitalize bg-white"
            >
              {source ? <>{source}</> : <>+ Set source</>}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput placeholder="Change source..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {statuses.map((status) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={sourceChange}
                      className="capitalize"
                    >
                      {status}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          source === status ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <AmountFilter amount={amount} setAmount={setAmount} />
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            className="h-9 w-9 border-input rounded-md bg-white"
            checked={hasSeller}
            onCheckedChange={(value) => setHasSeller(value)}
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground">
            Has Seller
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ResultFilter;
