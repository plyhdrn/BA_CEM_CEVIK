"use client";

import { loginUser } from "@/actions/loginUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SignIn() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const { execute, result, status } = useAction(loginUser);

  useEffect(() => {
    if (result.data?.status === "success") {
      router.refresh();
    }
  }, [result, router]);

  return (
    <form
      className="mx-auto flex content-center flex-col w-[500px] mt-40 h-full gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        execute({
          password,
        });
      }}
    >
      <div className="gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter password below to see the settings.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white"
            min={4}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!password || password.length < 4}
        >
          Login
        </Button>
      </div>
      <div id="result-container">
        <pre className="result text-center text-muted-foreground">
          {result.data?.message ? <p>{result.data.message}</p> : null}
        </pre>
      </div>
    </form>
  );
}
