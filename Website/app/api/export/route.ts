import dbConnect from "@/lib/dbConnect";
import Meta from "@/models/Meta";

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

  await dbConnect();

  const search = searchParams.get("search");
  const source = searchParams.get("source");

  const meta = await Meta.find({
    title: search ? { $regex: ".*" + search + ".*" } : { $exists: true },
    source: source === "both" ? { $in: ["bescha", "ted"] } : source,
  }).limit(20);

  return Response.json({ meta });
}
