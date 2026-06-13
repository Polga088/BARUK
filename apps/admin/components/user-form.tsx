"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function UserForm({
  organizations,
  branches,
}: {
  organizations: { id: string; name: string }[];
  branches: { id: string; name: string; organizationId: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState("STAFF");
  const [organizationId, setOrganizationId] = useState("");

  const filteredBranches = useMemo(
    () =>
      organizationId
        ? branches.filter((branch) => branch.organizationId === organizationId)
        : branches,
    [branches, organizationId],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: formData.get("organizationId") || null,
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        branchId: formData.get("branchId") || undefined,
        position: formData.get("position") || undefined,
        pinCode: formData.get("pinCode") || undefined,
        nfcCardUid: formData.get("nfcCardUid") || undefined,
      }),
    });

    setLoading(false);

    if (response.ok) {
      router.refresh();
      (event.target as HTMLFormElement).reset();
      setRole("STAFF");
      setOrganizationId("");
      return;
    }

    const data = (await response.json()) as { error?: string };
    setError(data.error ?? "Erreur lors de la création.");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="name">Nom complet</Label>
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
          value={role}
          onChange={(e) => setRole(e.target.value)}
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
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
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

      {role === "STAFF" && (
        <>
          <div className="md:col-span-2 rounded-xl border border-baruk-100 bg-cream-50/80 p-4">
            <p className="mb-3 text-sm font-medium text-baruk-900">
              Fiche employé (pointage NFC / PIN)
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="branchId">Filiale</Label>
                <select
                  id="branchId"
                  name="branchId"
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                >
                  <option value="">Choisir une filiale</option>
                  {filteredBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="position">Poste</Label>
                <Input
                  id="position"
                  name="position"
                  defaultValue="serveur"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pinCode">Code PIN pointage</Label>
                <Input
                  id="pinCode"
                  name="pinCode"
                  className="mt-1"
                  placeholder="Ex. 5678"
                />
              </div>
              <div>
                <Label htmlFor="nfcCardUid">Carte NFC</Label>
                <Input
                  id="nfcCardUid"
                  name="nfcCardUid"
                  className="mt-1"
                  placeholder="Ex. NFC-001"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer l'utilisateur"}
        </Button>
      </div>
    </form>
  );
}
