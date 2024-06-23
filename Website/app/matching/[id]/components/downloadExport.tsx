"use client";

import { downloadBackup } from "@/actions/downloadBackup";
import { Button } from "@/components/ui/button";
import saveAs from "file-saver";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

const DownloadExport = ({ matching }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  function base64ToBlob(
    base64String,
    contentType = "application/octet-stream"
  ) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
  }

  const download = (id, fileName) => {
    return downloadBackup(id).then((blob) => {
      saveAs(base64ToBlob(blob), fileName);
      return true;
    });
  };

  return (
    <Button
      onClick={() => {
        setIsDownloading(true);
        download(matching._id, matching.name)
          .then(() => {
            setIsDownloading(false);
          })
          .catch(() => {
            setIsDownloading(false);
          });
      }}
    >
      {isDownloading ? (
        <>
          <Loader2Icon className="w-4 h-4 animate-spin mr-2" /> Downloading
        </>
      ) : (
        <>
          <DownloadIcon className="w-4 h-4 mr-2" /> Download
        </>
      )}
    </Button>
  );
};

export default DownloadExport;
