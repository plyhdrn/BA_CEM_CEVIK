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
import { ArrowLeftRight, ChevronsUpDown } from "lucide-react";
import BeschaDetail from "./beschaDetail";
import { Fade } from "react-awesome-reveal";
import TedDetail from "./tedDetail";

const DataViewer = (data) => {
  return (
    <div className="gap-4 flex flex-col">
      <Fade duration={800} triggerOnce cascade damping={0}>
        {data.data.map((item, i) =>
          item.data.pocodat_source === "bescha" ? (
            <BeschaDetail item={item} key={i} />
          ) : item.data.pocodat_source === "ted" ? (
            <TedDetail item={item} key={i} />
          ) : null
        )}
      </Fade>
    </div>
  );
};

export default DataViewer;
