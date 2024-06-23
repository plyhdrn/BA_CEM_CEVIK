"use client";
import { IMetaView } from "@/models/Meta";
import { Button } from "./ui/button";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { downloadFile } from "@/lib/utils";
import { useState } from "react";

const ExportButton = ({
  searchParams,
  fetchMetaDetail,
}: {
  searchParams;
  fetchMetaDetail;
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const exportToJson = async (e) => {
    e.preventDefault();
    setIsExporting(true);
    const meta = await fetchMetaDetail(searchParams);
    downloadFile({
      data: meta,
      fileName: "meta.json",
      fileType: "text/json",
    });
    setIsExporting(false);
  };

  return (
    <Button
      onClick={exportToJson}
      variant="secondary"
      className="hover:bg-[#ebebeb]"
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Generating
          Metadata
        </>
      ) : (
        <>
          <DownloadIcon className="mr-2 h-4 w-4" /> Export Metadata
        </>
      )}
    </Button>
  );
};

export default ExportButton;
