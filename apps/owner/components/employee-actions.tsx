"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

export function EmployeeActions({
  employee,
}: {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    pinCode: string | null;
    nfcCardUid: string | null;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinCode, setPinCode] = useState(employee.pinCode ?? "");
  const [nfcCardUid, setNfcCardUid] = useState(employee.nfcCardUid ?? "");
  const [position, setPosition] = useState(employee.position);

  async function save() {
    setLoading(true);
    const response = await fetch(`/api/employees/${employee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pinCode: pinCode || null,
        nfcCardUid: nfcCardUid || null,
        position,
      }),
    });
    setLoading(false);
    if (response.ok) {
      setEditing(false);
      router.refresh();
    }
  }

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/employees/${employee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !employee.isActive }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {!employee.isActive && <Badge variant="muted">Inactif</Badge>}

      {editing ? (
        <div className="grid gap-2 md:grid-cols-3">
          <Input value={position} onChange={(e) => setPosition(e.target.value)} />
          <Input
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            placeholder="PIN"
          />
          <Input
            value={nfcCardUid}
            onChange={(e) => setNfcCardUid(e.target.value)}
            placeholder="NFC UID"
          />
          <div className="flex gap-2 md:col-span-3">
            <Button size="sm" disabled={loading} onClick={save}>
              Enregistrer
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={loading} onClick={() => setEditing(true)}>
            Modifier
          </Button>
          <Button size="sm" variant="outline" disabled={loading} onClick={toggleActive}>
            {employee.isActive ? "Désactiver" : "Activer"}
          </Button>
        </div>
      )}
    </div>
  );
}
