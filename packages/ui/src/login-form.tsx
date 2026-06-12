"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function LoginForm({
  appLabel,
  variant = "light",
}: {
  appLabel: string;
  variant?: "light" | "dark";
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  const isDark = variant === "dark";

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
    <div
      className={`ui:flex ui:min-h-screen ui:items-center ui:justify-center ui:px-4 ${
        isDark ? "ui:bg-warm-900" : "ui:bg-cream-100"
      }`}
    >
      <form
        onSubmit={onSubmit}
        className={`ui:w-full ui:max-w-md ui:space-y-4 ui:rounded-2xl ui:p-8 ui:shadow-[var(--shadow-warm-md)] ${
          isDark
            ? "ui:border ui:border-baruk-800 ui:bg-warm-800"
            : "ui:border ui:border-baruk-200/60 ui:bg-cream-50"
        }`}
      >
        <div>
          <p className="ui:text-xs ui:font-semibold ui:uppercase ui:tracking-[0.25em] ui:text-gold-500">
            BARUK
          </p>
          <h1
            className={`ui:mt-2 ui:font-display ui:text-2xl ui:font-bold ${
              isDark ? "ui:text-cream-100" : "ui:text-baruk-900"
            }`}
          >
            Connexion {appLabel}
          </h1>
        </div>

        {error && (
          <p className="ui:rounded-lg ui:bg-red-500/10 ui:px-3 ui:py-2 ui:text-sm ui:text-red-400">
            Accès refusé ou identifiants invalides.
          </p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="ui:mt-1"
            variant={variant}
          />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="ui:mt-1"
            variant={variant}
          />
        </div>
        <Button type="submit" disabled={loading} className="ui:w-full">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
