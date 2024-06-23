import { IBescha } from "@/models/Bescha";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { EyeIcon, CalendarIcon, CircleIcon, InfoIcon } from "lucide-react";

const ResultBeschaCard = ({ bescha }: { bescha: IBescha }) => {
  return (
    <Card className="shadow-none">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{bescha.releases[0]?.tender.title}</CardTitle>
          <CardDescription>
            {bescha.releases[0]?.tender.description.substring(0, 500)}...
          </CardDescription>
        </div>
        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
          <Link
            href={`https://www.oeffentlichevergabe.de/ui/en/search/details?noticeId=${bescha.releases[0]?.id}`}
            rel="noopener noreferrer"
            target="_blank"
            className="w-full"
          >
            <Button variant="secondary" className="shadow-none w-full">
              <EyeIcon className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center flex-grow">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {bescha.releases[0]?.buyer?.name || bescha.parties[0]?.name}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {new Date(`${bescha.publishedDate}`).toDateString()}
          </div>
          <div className="flex items-center">
            <InfoIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            Bescha
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultBeschaCard;
