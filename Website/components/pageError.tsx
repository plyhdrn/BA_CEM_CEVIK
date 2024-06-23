"use client";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const PageError = () => {
  const router = useRouter();
  return (
    <section className="bg-white dark:bg-gray-900 ">
      <div className="container flex items-center min-h-screen px-6 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-red-500 rounded-full bg-red-50 dark:bg-gray-800">
            <AlertCircleIcon className="w-6 h-6" />
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Error
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            An error occurred. Please try again later.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageError;
