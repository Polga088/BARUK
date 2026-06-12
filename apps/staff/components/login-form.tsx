"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function LoginForm({ appLabel }: { appLabel: string }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl,
    });

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-surface-900 p-8 ring-1 ring-baruk-800"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-baruk-400">
            BARUK
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">
            Connexion {appLabel}
          </h1>
        </div>

        {error && (
          <p className="rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300">
            Accès refusé ou identifiants invalides.
          </p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
