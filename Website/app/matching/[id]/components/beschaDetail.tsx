"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  ChevronsUpDown,
  ExternalLinkIcon,
  EyeIcon,
} from "lucide-react";
import * as diff from "diff";
import { diffCharsView } from "./diffCharsView";
import Link from "next/link";

const BeschaDetail = ({ item }) => {
  let data = item.data;

  const objectOrder = {
    creator: null,
    name: null,
    creation_date: null,
    ext_tender_id: null,
  };

  data = Object.assign(objectOrder, data);

  const beschaMatch = {
    creator: item.match.releases[0].buyer.name,
    name: item.match.releases[0].tender.title,
    creation_date: item.match.publishedDate,
    ext_tender_id:
      item.match.releases[0].tender.documents &&
      item.match.releases[0].tender.documents[0].url.split("/").pop(),
    details: item.match,
  };
  return (
    <Collapsible
      className="bg-white flex flex-col rounded-sm border mt-2"
      defaultOpen
      key={item._id}
    >
      <div className="flex items-center sm:flex-row flex-col bg-muted rounded-t-sm px-4 py-2 border-b">
        <div className="sm:max-w-[calc(100%-80px)] max-w-full flex flex-grow justify-between gap-2">
          <h4 className="text-sm font-semibold text-ellipsis truncate w-2/5">
            {item.data.name} - {item.data.creator}
          </h4>
          <ArrowLeftRight className="h-4 w-4 absolute left-1/2 -ml-2" />
          <h4 className="text-sm font-semibold text-ellipsis truncate w-2/5 text-right">
            {beschaMatch.name} - {beschaMatch.creator}
          </h4>
        </div>
        <div className="sm:mt-0 mt-2 flex">
          <Link
            href={`https://www.oeffentlichevergabe.de/ui/en/search/details?noticeId=${item.data.pocodat_externalId}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button variant="ghost" size="sm" className="w-9 p-0 ml-4">
              <EyeIcon className="h-4 w-4" />
              <span className="sr-only">Open in Bescha</span>
            </Button>
          </Link>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent
        className="px-4"
        style={{
          background:
            "repeating-linear-gradient(to bottom, #ffffff, #ffffff 20px, #f7f7f780 20px, #f7f7f780 40px)",
        }}
      >
        <div className="flex justify-between">
          <div className="w-1/2 px-4 py-5 text-sm">
            <JsonView
              className="sm:text-sm text-xs"
              src={data}
              collapseStringsAfterLength={50}
              customizeNode={(params) => {
                if (params.indexOrName === "creation_date")
                  return { className: "!text-purple-600" };
                if (params.indexOrName === "name")
                  return (
                    <div className="contents">
                      {data.name
                        ? diff
                            .diffChars(
                              data.name ? data.name : "",
                              beschaMatch.name ? beschaMatch.name : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
                if (params.indexOrName === "ext_tender_id")
                  return (
                    <div className="contents">
                      {data.ext_tender_id
                        ? diff
                            .diffChars(
                              data.ext_tender_id ? data.ext_tender_id : "",
                              beschaMatch.ext_tender_id
                                ? beschaMatch.ext_tender_id
                                : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
                if (params.indexOrName === "creator")
                  return (
                    <div className="contents">
                      {data.creator
                        ? diff
                            .diffChars(
                              data.creator ? data.creator : "",
                              beschaMatch.creator ? beschaMatch.creator : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
              }}
            />
          </div>
          <div className="w-1/2 px-4 py-5 border-l text-sm">
            <JsonView
              className="sm:text-sm text-xs"
              src={beschaMatch}
              collapseStringsAfterLength={50}
              customizeNode={(params) => {
                if (params.indexOrName === "name")
                  return (
                    <div className="contents">
                      {beschaMatch.name
                        ? diff
                            .diffChars(
                              beschaMatch.name ? beschaMatch.name : "",
                              data.name ? data.name : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
                if (params.indexOrName === "creator")
                  return (
                    <div className="contents">
                      {beschaMatch.creator
                        ? diff
                            .diffChars(
                              beschaMatch.creator ? beschaMatch.creator : "",
                              data.creator ? data.creator : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
                if (params.indexOrName === "ext_tender_id")
                  return (
                    <div className="contents">
                      {beschaMatch.ext_tender_id
                        ? diff
                            .diffChars(
                              beschaMatch.ext_tender_id
                                ? beschaMatch.ext_tender_id
                                : "",
                              data.ext_tender_id ? data.ext_tender_id : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
                if (params.indexOrName === "creation_date")
                  return { className: "!text-purple-600" };
                if (params.indexOrName === "details")
                  return { collapsed: true };
                if (params.indexOrName === "relatedLots")
                  return { collapsed: true };
              }}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BeschaDetail;
