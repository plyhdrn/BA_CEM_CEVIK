"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import saveAs from "file-saver";
import { Loader2Icon } from "lucide-react";
import { ObjectId } from "mongoose";
import Image from "next/image";
import React, { useState } from "react";

function base64ToBlob(base64String, contentType = "application/zip") {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);
  return new Blob([byteArray], { type: contentType });
}

const BackupDownload = ({
  id,
  filename,
  imagePath,
  date,
  downloadBackup,
}: {
  id: string;
  filename: string;
  imagePath: string;
  date: Date;
  downloadBackup: (id: string, filename: string) => Promise<Blob>;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const download = async () => {
    setIsDownloading(true);
    const blob = await downloadBackup(id, filename);
    saveAs(base64ToBlob(blob), filename.replace("./websiteContents/", ""));
    setIsDownloading(false);
  };

  return (
    <>
      <Card
        key={date}
        className="col-span-1 h-[500px] flex flex-col bg-white border shadow-none rounded-lg"
      >
        <CardHeader>
          <Image
            src={imagePath}
            className="object-contain h-[300px]"
            alt="website preview"
            width={400}
            height={500}
          />
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <div className="rounded-lg">
            <p className="text-sm">
              {filename.replace("./websiteContents/", "").slice(0, 100)}
            </p>
          </div>
          <div className="flex flex-row flex-grow mt-5 items-end">
            <p className="text-xs font-medium">
              {new Date(date).toLocaleString("de-DE")}
            </p>
            <div className="flex items-end flex-grow justify-end">
              <Button
                onClick={download}
                className="text-xs"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2Icon className="animate-spin mr-2 w-4 h-4" />{" "}
                    Downloading
                  </>
                ) : (
                  <>Download</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BackupDownload;
