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

const TedDetail = ({ item }) => {
  let data = item.data;

  const objectOrder = {
    creator: null,
    name: null,
    creation_date: null,
    ext_tender_id: null,
  };

  data = Object.assign(objectOrder, data);

  const tedMatch = {
    creator: item.match["buyer-name"]
      ? item.match["buyer-name"][0]
        ? item.match["buyer-name"][0].deu
        : null
      : null,
    name: item.match["title-proc"]
      ? item.match["title-proc"][0]
        ? item.match["title-proc"][0].deu
        : null
      : null,
    creation_date: item.match["publication-date"],
    ext_tender_id: item.match["BT-22-Procedure"],
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
            {tedMatch.name} - {tedMatch.creator}
          </h4>
        </div>
        <div className="sm:mt-0 mt-2 flex">
          <Link
            href={`https://ted.europa.eu/de/notice/-/detail/${item.data.pocodat_externalId}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button variant="ghost" className="w-9 p-0 ml-4">
              <EyeIcon className="h-4 w-4" />
              <span className="sr-only">Open in Bescha</span>
            </Button>
          </Link>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-9 p-0">
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
                              tedMatch.name ? tedMatch.name : ""
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
                              tedMatch.ext_tender_id
                                ? tedMatch.ext_tender_id
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
                              tedMatch.creator ? tedMatch.creator : ""
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
              src={tedMatch}
              collapseStringsAfterLength={50}
              customizeNode={(params) => {
                if (params.indexOrName === "name")
                  return (
                    <div className="contents">
                      {tedMatch.name
                        ? diff
                            .diffChars(
                              tedMatch.name ? tedMatch.name : "",
                              data.name ? data.name : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
                if (params.indexOrName === "creator")
                  return (
                    <div className="contents">
                      {tedMatch.creator
                        ? diff
                            .diffChars(
                              tedMatch.creator ? tedMatch.creator : "",
                              data.creator ? data.creator : ""
                            )
                            .map((part, i) => diffCharsView(part, i))
                        : "null"}
                    </div>
                  );
                if (params.indexOrName === "ext_tender_id")
                  return (
                    <div className="contents">
                      {tedMatch.ext_tender_id
                        ? diff
                            .diffChars(
                              tedMatch.ext_tender_id
                                ? tedMatch.ext_tender_id
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

export default TedDetail;
