"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function OrganizationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
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
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required className="mt-1" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          Créer
        </Button>
      </div>
    </form>
  );
}
