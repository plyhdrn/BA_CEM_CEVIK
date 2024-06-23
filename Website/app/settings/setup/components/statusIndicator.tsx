import {
  CheckIcon,
  ChevronsRightIcon,
  LoaderIcon,
  PlayIcon,
  RefreshCcwIcon,
} from "lucide-react";
import React from "react";

const StatusIndicator = ({ beschaEntry, tedEntry, companyEntry }) => {
  if (!beschaEntry && !tedEntry && !companyEntry) {
    return (
      <>
        <div className="flex w-12 h-12 bg-gray-50 ring-1 ring-inset ring-gray-400/50 rounded-lg justify-center items-center">
          <PlayIcon className="w-5 h-5 text-gray-400" />
        </div>
        <span className="mt-3 text-base font-medium">
          Let&apos;s get started
        </span>
        <span className="text-sm text-muted-foreground text-center">
          Click the button below to start the setup process.
        </span>
      </>
    );
  }

  if (
    (beschaEntry && beschaEntry.status === "running") ||
    (tedEntry && tedEntry.status === "running") ||
    (companyEntry && companyEntry.status === "running")
  ) {
    return (
      <>
        <div className="flex w-12 h-12 bg-blue-50 ring-1 ring-inset ring-blue-400/50 rounded-lg justify-center items-center">
          <RefreshCcwIcon className="w-5 h-5 text-blue-500" />
        </div>
        <span className="mt-3 text-base font-medium">Setup is Running</span>
        <span className="text-sm text-muted-foreground text-center w-3/5">
          You have started the setup process. Please wait for it to complete.
        </span>
      </>
    );
  }

  if (!beschaEntry || !tedEntry || !companyEntry) {
    return (
      <>
        <div className="flex w-12 h-12 bg-yellow-50 ring-1 ring-inset ring-yellow-600/50 rounded-lg justify-center items-center">
          <ChevronsRightIcon className="w-5 h-5 text-yellow-800" />
        </div>
        <span className="mt-3 text-base font-medium">Continue setup</span>
        <span className="text-sm text-muted-foreground  text-center">
          Click the button below to continue the setup process.
        </span>
      </>
    );
  }

  if (beschaEntry && tedEntry && companyEntry) {
    return (
      <>
        <div className="flex w-12 h-12 bg-green-50 ring-1 ring-inset ring-green-600/50 rounded-lg justify-center items-center">
          <CheckIcon className="w-5 h-5 text-green-700" />
        </div>
        <span className="mt-3 text-base font-medium">You&apos;re all set</span>
        <span className="text-sm text-muted-foreground  text-center">
          You have successfully completed the setup process.
        </span>
      </>
    );
  }
};

export default StatusIndicator;
