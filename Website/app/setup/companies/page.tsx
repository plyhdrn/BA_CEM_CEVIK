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
import { redirect } from "next/navigation";
import DateSelection from "../components/DateSelection";
import { format } from "date-fns";

const CompaniesPage = async () => {
  const fetchStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/company/status`,
        {
          next: {
            revalidate: 1,
          },
          headers: {
            "API-KEY": process.env.API_KEY || "",
          },
        }
      );

      if (!response.ok) return { status: "error", message: "" };

      const data = await response.json();
      return data;
    } catch (error) {
      return { status: "error", message: "" };
    }
  };

  const startSync = async (startDate?: string, endDate?: string) => {
    "use server";

    if (!startDate) return console.log("No start date");

    fetch(`${process.env.BACKEND_URL}/company`, {
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
    });
  };

  const reval = async () => {
    "use server";
    revalidatePath("/setup/companies");
  };

  const data = await fetchStatus();

  return (
    <div className="flex w-full h-[calc(100vh-58px)] justify-center items-center container">
      <Card className="w-[500px] flex flex-col">
        <CardHeader className="p-6 pb-0">
          <CardDescription className="text-xs font-semibold text-purple-600 uppercase mb-2">
            Step 3 / 3
          </CardDescription>
          <CardTitle className="text-2xl text-foreground">
            Company Collection Setup
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
            hidden={true}
            redirectTo={"/"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesPage;
