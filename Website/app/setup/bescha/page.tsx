import { revalidatePath } from "next/cache";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SelectTimeRange from "../components/SelectTimeRange";
import DateSelection from "../components/DateSelection";
import Running from "../components/Running";
import { redirect } from "next/navigation";
import { format } from "date-fns";

const BeschaPage = async () => {
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/bescha/status`, {
        next: {
          revalidate: 1,
        },
        headers: {
          "API-KEY": process.env.API_KEY || "",
        },
      });

      if (!response.ok) return { status: "error", message: "" };

      const data = await response.json();
      return data;
    } catch (error) {
      return { status: "error", message: "" };
    }
  };

  const startSync = async (startDate?: Date, endDate?: Date) => {
    "use server";

    if (!startDate) return console.log("No start date");
    fetch(
      `${process.env.BACKEND_URL}/bescha?shouldReset=true&startDate=${format(
        startDate,
        "yyyy-MM"
      )}${endDate ? `&endDate=${format(endDate, "yyyy-MM")}` : ""}`,
      {
        headers: {
          "API-KEY": process.env.API_KEY || "",
        },
      }
    );
  };

  const reval = async () => {
    "use server";
    revalidatePath("/setup/bescha");
  };

  const data = await fetchStatus();

  //   return <StatusTracker test={test}>{data}</StatusTracker>;
  return (
    <div className="flex w-full h-[calc(100vh-58px)] justify-center items-center container">
      <Card className="w-[500px] flex flex-col">
        <CardHeader className="p-6 pb-0">
          <CardDescription className="text-xs font-semibold text-purple-600 uppercase mb-2">
            Step 1 / 3
          </CardDescription>
          <CardTitle className="text-2xl text-foreground">
            BESCHA Collection Setup
          </CardTitle>
          <CardDescription className="text-sm !mt-2 text-foreground">
            Bring your own databases or duplicate our databases. Lets start by
            choosing the time range you want to sync.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-0 grow flex flex-col">
          <DateSelection
            data={data}
            startSync={startSync}
            reval={reval}
            redirectTo={"/setup/ted"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BeschaPage;
