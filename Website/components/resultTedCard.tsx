import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { ITed } from "@/models/Ted";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  EyeIcon,
  CalendarIcon,
  ChevronDownIcon,
  CircleIcon,
  DownloadIcon,
  InfoIcon,
} from "lucide-react";

const ResultTedCard = ({ ted }: { ted: ITed }) => {
  return (
    <Card className="shadow-none">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{ted["notice-title"].deu}</CardTitle>
        </div>
        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
          <Link
            href={`${ted.links.html.DEU}`}
            rel="noopener noreferrer"
            target="_blank"
            className="w-full"
          >
            <Button variant="secondary" className="shadow-none w-full">
              <EyeIcon className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2 shadow-none">
                <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-5}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuLabel>Alternatives</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`${ted.links.xml.MUL}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" /> XML Download
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`${ted.links.pdf.DEU}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" /> PDF Download
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`${ted.links.pdfs.DEU}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" /> PDFs Download
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`${ted.links.htmlDirect.DEU}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" /> HTML Direct
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center flex-grow">
            <CircleIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            {ted["buyer-name"].deu[0] || "Unknown"}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            {new Date(`${ted["publication-date"]}`).toDateString()}
          </div>
          <div className="flex items-center">
            <InfoIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            Ted
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultTedCard;
