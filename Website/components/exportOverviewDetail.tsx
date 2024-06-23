"use client";
import getOverviewDetail from "@/actions/getOverviewDetail";
import { downloadFile } from "@/lib/utils";
import { Button } from "./ui/button";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

interface SearchParams extends URLSearchParams {
  search?: string;
  source?: string;
}

const ExportOverviewDetail = ({
  searchParams,
  fetchOverviewDetail,
}: {
  searchParams: SearchParams;
  fetchOverviewDetail: (searchParams: SearchParams) => Promise<any>;
}) => {
  const [isExporting, setIsExporting] = useState(false);

  async function generateExport() {
    setIsExporting(true);
    const overviewDetail = await fetchOverviewDetail(searchParams);
    downloadFile({
      data: overviewDetail,
      fileName: "overView.json",
      fileType: "text/json",
    });
    setIsExporting(false);
  }

  return (
    <Button
      onClick={generateExport}
      variant="secondary"
      className="hover:bg-[#ebebeb]"
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Generating
          Detailed Data
        </>
      ) : (
        <>
          <DownloadIcon className="mr-2 h-4 w-4" /> Export Detailed Data
        </>
      )}
    </Button>
  );
};

export default ExportOverviewDetail;
