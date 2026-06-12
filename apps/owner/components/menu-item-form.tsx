"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function MenuItemForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    await fetch("/api/menu/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: formData.get("categoryId"),
        name: formData.get("name"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
      }),
    });

    setLoading(false);
    router.refresh();
    (event.target as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="categoryId">Catégorie</Label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="name">Nom du plat</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="price">Prix (MAD)</Label>
        <Input id="price" name="price" type="number" min={0} step={0.01} required className="mt-1" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Ajout..." : "Ajouter le plat"}
        </Button>
      </div>
    </form>
  );
}
