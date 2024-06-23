import { Button } from "@/components/ui/button";
import Log from "@/models/Log";
import { CheckIcon, ChevronsRightIcon, DrumIcon, PlayIcon } from "lucide-react";
import React from "react";
import StatusIndicator from "./setup/components/statusIndicator";
import BeschaEntry from "./setup/components/beschaEntry";
import { format } from "date-fns";
import EntryContainer from "./setup/components/entryContainer";

const startBeschaSync = async (startDate?: string, endDate?: string) => {
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

const startTedSync = async (startDate?: string, endDate?: string) => {
  "use server";

  if (!startDate) return console.log("No start date");

  fetch(
    `${process.env.BACKEND_URL}/ted?shouldReset=true&startDate=${format(
      startDate,
      "MM-dd-yyyy"
    )}${endDate ? `&endDate=${format(endDate, "MM-dd-yyyy")}` : ""}`,
    {
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
    }
  );
};

const startCompanySync = async (startDate?: string, endDate?: string) => {
  "use server";

  fetch(`${process.env.BACKEND_URL}/company`, {
    headers: {
      "API-KEY": process.env.API_KEY || "",
    },
  });
};

const SettingsPage = async () => {
  const beschaEntry = await Log.findOne({
    type: "setup",
    "setupDetail.source": "bescha",
  }).sort({ startDateTime: -1 });

  const tedEntry = await Log.findOne({
    type: "setup",
    "setupDetail.source": "ted",
  }).sort({ startDateTime: -1 });

  const companyEntry = await Log.findOne({
    type: "setup",
    "setupDetail.source": "company",
  }).sort({ startDateTime: -1 });

  return (
    <div className="flex flex-col">
      <div className="container">
        <div className="flex flex-col justify-end sm:py-8 py-2 gap-3">
          <div className="flex justify-between sm:flex-row flex-col-reverse">
            <div className="flex flex-col sm:w-4/5 w-full">
              <h1 className="lg:text-4xl md:text-2xl sm:text-xl font-semibold">
                Setup
              </h1>
              <span className="text-sm font-medium truncate mt-1">
                This sets up the database for the first time.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-1 container justify-center items-center">
        <div className="flex flex-col justify-center items-center rounded-md border bg-white py-8 md:w-4/6 lg:w-3/6 w-full">
          <div className="flex flex-col items-center gap-1">
            <StatusIndicator
              beschaEntry={beschaEntry}
              tedEntry={tedEntry}
              companyEntry={companyEntry}
            />
          </div>
          <div className="mt-10 flex flex-col border bg-white rounded-md w-8/12">
            <EntryContainer
              beschaEntry={JSON.parse(JSON.stringify(beschaEntry))}
              tedEntry={JSON.parse(JSON.stringify(tedEntry))}
              companyEntry={JSON.parse(JSON.stringify(companyEntry))}
              startBeschaSync={startBeschaSync}
              startTedSync={startTedSync}
              startCompanySync={startCompanySync}
            />
          </div>
          <div className="flex flex-col mt-16 justify-center items-center">
            <span className="text-xs text-muted-foreground w-4/6 text-center">
              You can close this page after starting the setup process and come
              back later to check the status.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
