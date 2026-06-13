"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

export function MenuCategoryActions({
  category,
}: {
  category: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    const response = await fetch(`/api/menu/categories/${category.id}`, {
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
    if (!confirm(`Supprimer la catégorie « ${category.name} » et tous ses plats ?`)) {
      return;
    }
    setLoading(true);
    const response = await fetch(`/api/menu/categories/${category.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (response.ok) router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!category.isActive && <Badge variant="muted">Masquée</Badge>}
      {editing ? (
        <div className="flex w-full flex-wrap items-end gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Button
            size="sm"
            disabled={loading}
            onClick={() => patch({ name, description: description || null })}
          >
            Enregistrer
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
            Annuler
          </Button>
        </div>
      ) : (
        <>
          <Button size="sm" variant="outline" disabled={loading} onClick={() => setEditing(true)}>
            Modifier
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => patch({ isActive: !category.isActive })}
          >
            {category.isActive ? "Masquer" : "Afficher"}
          </Button>
          <Button size="sm" variant="outline" disabled={loading} onClick={remove}>
            Supprimer
          </Button>
        </>
      )}
    </div>
  );
}
