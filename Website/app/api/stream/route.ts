import { auth } from "@/auth";
import Log from "@/models/Log";
import { revalidatePath } from "next/cache";

// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) throw new Error("Not authenticated");

  const encoder = new TextEncoder();
  const watcher = Log.watch();

  // Create a streaming response
  const customReadable = new ReadableStream({
    start(controller) {
      watcher.on("change", async (change) => {
        revalidatePath("/matching");
        revalidatePath("/settings");
        controller.enqueue(
          encoder.encode(`data: ${change.documentKey._id.toString()}\n\n`)
        );
      });
      watcher.on("error", (error) => {
        console.error("Error detected");
        controller.error(error);
        controller.close();
      });
    },

    cancel() {
      watcher.close();
    },
  });
  // Return the stream response and keep the connection alive
  return new Response(customReadable, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  });
}
