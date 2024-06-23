import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const DateFilter = ({
  from,
  to,
  setFrom,
  setTo,
}: {
  from: Date;
  to: Date;
  setFrom: (date: Date) => void;
  setTo: (date: Date) => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2 w-auto">
            <span className="text-sm text-muted-foreground">From:</span>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal bg-white",
                !from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {from ? format(from, "PPP") : <span>Pick a date</span>}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" side="bottom">
          <Calendar
            mode="single"
            selected={from}
            onSelect={setFrom}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2 w-auto">
            <span className="text-sm text-muted-foreground">To:</span>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal bg-white",
                !to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {to ? format(to, "PPP") : <span>Pick a date</span>}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" side="bottom">
          <Calendar mode="single" selected={to} onSelect={setTo} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
