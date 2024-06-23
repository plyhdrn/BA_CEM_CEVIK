"use client";
import { Button } from "@/components/ui/button";
import { ICompany } from "@/models/Company";
import { Loader2Icon, LockIcon } from "lucide-react";
import { ObjectId } from "mongoose";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FetchProfile = ({
  id,
  authorized,
  createProfileSync,
}: {
  id: ObjectId;
  authorized: boolean;
  createProfileSync: (id: ObjectId) => Promise<string>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <>
      {!authorized ? (
        <Button variant="ghost" disabled>
          <LockIcon className="w-4 h-4" />
          <span className="ml-2">Sync Profile</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          onClick={async () => {
            setLoading(true);
            createProfileSync(id);
            // sleep for 1 second
            await new Promise((r) => setTimeout(r, 1000));
            router.push(`/settings/profile`);
            setLoading(false);
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Syncing...
            </>
          ) : (
            <>Sync Profile</>
          )}
        </Button>
      )}
    </>
  );
};

export default FetchProfile;
