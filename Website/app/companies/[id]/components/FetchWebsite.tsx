"use client";
import { Button } from "@/components/ui/button";
import { ICompany } from "@/models/Company";
import { Loader2Icon, LockIcon } from "lucide-react";
import { ObjectId } from "mongoose";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FetchWebsite = ({
  id,
  authorized,
  createWebsiteSync,
}: {
  id: ObjectId;
  authorized: boolean;
  createWebsiteSync: (id: ObjectId) => Promise<string>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <>
      {!authorized ? (
        <Button variant="ghost" disabled>
          <LockIcon className="w-4 h-4" />
          <span className="ml-2">Sync Website</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          onClick={async () => {
            setLoading(true);
            await createWebsiteSync(id);
            router.push(`/settings/sync`);
            setLoading(false);
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Syncing...
            </>
          ) : (
            <>Sync Website</>
          )}
        </Button>
      )}
    </>
  );
};

export default FetchWebsite;
