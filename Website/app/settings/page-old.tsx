import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import { SignIn } from "./components/sign-in";

const SettingsPage = async () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex px-4 py-3 border w-full rounded-md bg-white">
        <div className="flex flex-col">
          <span className="text-base font-semibold text-foreground">Setup</span>
          <span className="text-xs text-muted-foreground">
            This sets up the database for the first time.
          </span>
        </div>
        <div className="flex flex-grow justify-end">
          <Link href="/setup/bescha">
            <Button>Open</Button>
          </Link>
        </div>
      </div>
      <div className="flex px-4 py-3 border w-full rounded-md bg-white">
        <div className="flex flex-col">
          <span className="text-base font-semibold text-foreground">
            Company Profile Downloader
          </span>
          <span className="text-xs text-muted-foreground">
            Finds the companies with no backups and creates one.
          </span>
        </div>
        <div className="flex flex-grow justify-end">
          <Link href="/setup/companies/backup">
            <Button>Open</Button>
          </Link>
        </div>
      </div>
      <div className="flex px-4 py-3 border w-full rounded-md bg-white">
        <div className="flex flex-col">
          <span className="text-base font-semibold text-foreground">
            Company Website Finder
          </span>
          <span className="text-xs text-muted-foreground">
            Finds the companies with no websites and crawles them.
          </span>
        </div>
        <div className="flex flex-grow justify-end">
          <Link href="/setup/companies/site">
            <Button>Open</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
