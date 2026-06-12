"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function UserForm({
  organizations,
}: {
  organizations: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: formData.get("organizationId") || null,
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
      }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="role">Rôle</Label>
        <select
          id="role"
          name="role"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="OWNER">OWNER</option>
          <option value="STAFF">STAFF</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="organizationId">Organisation</Label>
        <select
          id="organizationId"
          name="organizationId"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="">— Aucune —</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          Créer
        </Button>
      </div>
    </form>
  );
}
