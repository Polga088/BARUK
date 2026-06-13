"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

export function MenuItemActions({
  item,
  categories,
}: {
  item: {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    price: number;
    isAvailable: boolean;
  };
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(String(item.price));
  const [categoryId, setCategoryId] = useState(item.categoryId);

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    const response = await fetch(`/api/menu/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (response.ok) {
      setEditing(false);
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm(`Supprimer « ${item.name} » ?`)) return;
    setLoading(true);
    const response = await fetch(`/api/menu/items/${item.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (response.ok) router.refresh();
  }

  if (editing) {
    return (
      <div className="mt-3 grid gap-2 rounded-xl border border-baruk-100 bg-cream-50 p-3 md:grid-cols-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input
          type="number"
          min={0}
          step={0.01}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 md:col-span-2">
          <Button
            size="sm"
            disabled={loading}
            onClick={() =>
              patch({
                name,
                description: description || null,
                price: Number.parseFloat(price),
                categoryId,
              })
            }
          >
            Enregistrer
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
            Annuler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!item.isAvailable && <Badge variant="warning">Indisponible</Badge>}
      <Button size="sm" variant="outline" disabled={loading} onClick={() => setEditing(true)}>
        Modifier
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => patch({ isAvailable: !item.isAvailable })}
      >
        {item.isAvailable ? "Rupture" : "Disponible"}
      </Button>
      <Button size="sm" variant="outline" disabled={loading} onClick={remove}>
        Supprimer
      </Button>
    </div>
  );
}
