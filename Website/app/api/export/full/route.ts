import getOverviewDetail from "@/actions/getOverviewDetail";
import dbConnect from "@/lib/dbConnect";
import Bescha from "@/models/Bescha";
import Meta from "@/models/Meta";
import Ted from "@/models/Ted";

interface SearchParams extends URLSearchParams {
  search?: string;
  source?: string;
}

export async function GET(request: Request) {
  const {
    searchParams,
  }: {
    searchParams: SearchParams;
  } = new URL(request.url);

  const collection = await getOverviewDetail(searchParams);

  return Response.json({ collection });
}
