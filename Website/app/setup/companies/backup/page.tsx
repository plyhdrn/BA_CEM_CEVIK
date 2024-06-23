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
import { format } from "date-fns";
import AmountSelection from "../../components/AmountSelection";

const CompaniesPage = async () => {
  const fetchStatus = async () => {
    const response = await fetch(
      `${process.env.BACKEND_URL}/company/backup/status`,
      {
        next: {
          revalidate: 1,
        },
        headers: {
          "API-KEY": process.env.API_KEY || "",
        },
      }
    );
    const data = await response.json();
    return data;
  };

  const startSync = async (limit: number) => {
    "use server";

    // check if limit is a number
    if (typeof limit !== "number") return console.log("No limit");

    fetch(`${process.env.BACKEND_URL}/company/backup?limit=${limit}`, {
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
    });
  };

  const reval = async () => {
    "use server";
    revalidatePath("/setup/companies/backup");
  };

  const data = await fetchStatus();

  return (
    <div className="flex w-full h-[calc(100vh-58px)] justify-center items-center container">
      <Card className="w-[500px] flex flex-col">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-2xl text-foreground">
            Company Collection Setup
          </CardTitle>
          <CardDescription className="text-sm !mt-2 text-foreground">
            Bring your own databases or duplicate our databases. Lets start by
            choosing the time range you want to sync.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-0 grow flex flex-col">
          <AmountSelection
            data={data}
            startSync={startSync}
            reval={reval}
            redirectTo={"/"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesPage;
