import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const StartWebsiteSync = async () => {
  const startSync = async (formData: FormData) => {
    "use server";

    const limit = Number(formData.get("limit"));

    // check if limit is a number
    if (typeof limit !== "number") return console.log("No limit");

    fetch(`${process.env.BACKEND_URL}/company/site?limit=${limit}`, {
      headers: {
        "API-KEY": process.env.API_KEY || "",
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Start Website Sync</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form action={startSync}>
          <Input
            type="number"
            name="limit"
            label="Limit"
            min={1}
            placeholder="Number of Websites"
            className="mt-2 mb-4"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogTrigger asChild>
              <Button type="submit">Start Sync</Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartWebsiteSync;
