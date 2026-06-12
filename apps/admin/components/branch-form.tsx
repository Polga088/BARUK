"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function BranchForm({
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
    await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: formData.get("organizationId"),
        name: formData.get("name"),
        slug: formData.get("slug"),
        address: formData.get("address"),
        city: formData.get("city"),
      }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="organizationId">Organisation</Label>
        <select
          id="organizationId"
          name="organizationId"
          required
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="city">Ville</Label>
        <Input id="city" name="city" required className="mt-1" />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" required className="mt-1" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          Créer la filiale
        </Button>
      </div>
    </form>
  );
}
