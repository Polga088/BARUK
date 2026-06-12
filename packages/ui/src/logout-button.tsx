"use client";

import { signOut } from "next-auth/react";
import { Button } from "./button";

export function LogoutButton({
  className = "",
  variant = "ghost",
}: {
  className?: string;
  variant?: "ghost" | "outline" | "secondary";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className={className}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Déconnexion
    </Button>
  );
}
