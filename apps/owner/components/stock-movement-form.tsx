"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function StockMovementForm({
  items,
}: {
  items: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    await fetch("/api/stock/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stockItemId: formData.get("stockItemId"),
        type: formData.get("type"),
        quantity: Number(formData.get("quantity")),
        reason: formData.get("reason"),
      }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="stockItemId">Article</Label>
        <select
          id="stockItemId"
          name="stockItemId"
          required
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="IN">Entrée</option>
          <option value="OUT">Sortie</option>
          <option value="ADJUSTMENT">Ajustement</option>
          <option value="WASTE">Perte</option>
        </select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantité</Label>
        <Input id="quantity" name="quantity" type="number" step="0.001" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="reason">Motif</Label>
        <Input id="reason" name="reason" className="mt-1" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
