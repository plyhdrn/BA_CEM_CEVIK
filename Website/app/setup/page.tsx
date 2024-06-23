import { revalidatePath } from "next/cache";
import React from "react";
import StatusTracker from "./StatusTracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SelectTimeRange from "./components/SelectTimeRange";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SetupPage = async () => {
  const fetchStatus = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/bescha/status`, {
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
    });
    const data = await response.text();
    return data;
  };

  const data = await fetchStatus();

  const test = async () => {
    "use server";
    revalidatePath("/setup");
  };
  //   return <StatusTracker test={test}>{data}</StatusTracker>;
  return (
    <div className="flex w-full h-[calc(100vh-58px)] justify-center items-center container">
      <Card className="min-h-[500px] min-w-[500px] flex flex-col">
        <CardHeader className="p-6 pb-2">
          <CardDescription className="text-xs font-semibold text-purple-600 uppercase mb-2">
            Step 1 / 3
          </CardDescription>
          <CardTitle className="text-2xl text-foreground">
            BESCHA Collection Setup
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Bring your own databases or duplicate our databases.
          </CardDescription>
          <Separator className="!mt-5 !mb-2" />
        </CardHeader>
        <CardContent className="mt-0 grow flex flex-col">
          <div className="w-full flex flex-col">
            <div className="flex">
              <p className="text-base font-semibold text-foreground">
                Sync time range
              </p>
            </div>
            <h6 className="text-xs mt-1 text-muted-foreground">
              Choose the time range you want to sync
            </h6>
            <div className="flex mt-4 w-full gap-2">
              <SelectTimeRange className="w-full" />
            </div>
          </div>
          <div className="grow flex items-end">
            <Button className="w-full">Continue</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupPage;
