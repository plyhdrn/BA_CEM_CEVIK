"use client";

import { uploadMatching } from "@/actions/uploadMatching";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { useToast } from "@/components/ui/use-toast";

const UploadDB = () => {
  const [file, setFile] = useState<File | null>();
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const showAlertToast = (message: string) => {
    toast({
      variant: "destructive",
      title: message,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      setIsUploading(true);

      uploadMatching(data);

      // sleep for 1 second

      new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
        router.refresh();
      });

      setIsUploading(false);
      setFile(null);

      console.log("Refreshing");
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-4">
      <Input
        type="file"
        name="file"
        className={cn(
          file ? "w-72" : "w-[103px]",
          "p-1.5 bg-white transition-all duration-400 cursor-pointer"
        )}
        onChange={(e) => {
          if (e.target.files === null || !e.target.files) {
            setFile(null);
            return;
          }

          if (e.target.files.length > 1) {
            showAlertToast("Please upload only one file");
            setFile(null);
            return;
          }

          if (!e.target.files[0]) {
            setFile(null);
            return;
          }
          if (e.target.files[0].name.split(".").pop() !== "db") {
            showAlertToast("Please upload only .db files");
            setFile(null);
            return;
          }
          if (e.target.files[0].size > 100000000) {
            showAlertToast("Please upload a file less than 100MB");
            setFile(null);
            return;
          }
          setFile(e.target.files[0]);
        }}
      />
      {file && (
        <Button type="submit">
          {isUploading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> Uploading
            </>
          ) : (
            <>
              <UploadIcon className="w-4 h-4 mr-2" /> Upload
            </>
          )}
        </Button>
      )}
    </form>
  );
};

export default UploadDB;
