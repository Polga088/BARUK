"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function MenuCategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
      }),
    });

    setLoading(false);
    if (response.ok) {
      router.refresh();
      (event.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
      <div>
        <Label htmlFor="cat-name">Nom de la catégorie</Label>
        <Input id="cat-name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="cat-description">Description</Label>
        <Input id="cat-description" name="description" className="mt-1" />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Ajout..." : "Ajouter catégorie"}
        </Button>
      </div>
    </form>
  );
}
