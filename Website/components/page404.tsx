import { AlertCircleIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Page404 = () => {
  return (
    <section className="bg-white dark:bg-gray-900 ">
      <div className="container flex items-center min-h-screen px-6 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50 dark:bg-gray-800">
            <AlertCircleIcon className="w-6 h-6" />
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Page not found
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            The page you are looking for doesn&apos;t exist.
          </p>
          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Link href="/">
              <Button className="bg-blue-500 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page404;
