"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import type { ReservationStatus } from "@repo/database";

interface TableOption {
  id: string;
  name: string;
  capacity: number;
  section: string | null;
}

export function ReservationActions({
  id,
  status,
  tableId,
  tableName,
  partySize,
  date,
  time,
}: {
  id: string;
  status: ReservationStatus;
  tableId: string | null;
  tableName: string | null;
  partySize: number;
  date: string;
  time: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<TableOption[]>([]);
  const [selectedTableId, setSelectedTableId] = useState(tableId ?? "");
  const [showAssign, setShowAssign] = useState(false);

  useEffect(() => {
    setSelectedTableId(tableId ?? "");
  }, [tableId]);

  useEffect(() => {
    if (!showAssign && status !== "PENDING") return;

    async function loadTables() {
      const params = new URLSearchParams({
        date,
        time,
        partySize: String(partySize),
        reservationId: id,
      });
      const response = await fetch(`/api/reservations/tables?${params}`);
      if (response.ok) {
        setTables(await response.json());
      }
    }

    if (showAssign || status === "PENDING") {
      void loadTables();
    }
  }, [showAssign, status, date, time, partySize, id]);

  async function patch(body: {
    status?: ReservationStatus;
    tableId?: string | null;
  }) {
    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        alert(data.error ?? "Erreur lors de la mise à jour.");
        return;
      }
      setShowAssign(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {tableName && (
        <p className="text-xs text-zinc-500">
          Table : <span className="font-medium text-zinc-800">{tableName}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {status === "PENDING" && (
          <>
            <select
              value={selectedTableId}
              onChange={(event) => setSelectedTableId(event.target.value)}
              className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
            >
              <option value="">Choisir une table</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name} ({table.capacity} pl.) · {table.section}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={loading || !selectedTableId}
              onClick={() =>
                patch({ status: "CONFIRMED", tableId: selectedTableId })
              }
            >
              Confirmer
            </Button>
          </>
        )}

        {status === "CONFIRMED" && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => setShowAssign((value) => !value)}
            >
              {showAssign ? "Fermer" : "Changer table"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => patch({ status: "NO_SHOW" })}
            >
              Absent
            </Button>
          </>
        )}

        {status !== "CANCELLED" &&
          status !== "COMPLETED" &&
          status !== "NO_SHOW" && (
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => patch({ status: "CANCELLED" })}
            >
              Annuler
            </Button>
          )}
      </div>

      {showAssign && status === "CONFIRMED" && (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedTableId}
            onChange={(event) => setSelectedTableId(event.target.value)}
            className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
          >
            <option value="">Choisir une table</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name} ({table.capacity} pl.) · {table.section}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            disabled={loading || !selectedTableId}
            onClick={() => patch({ tableId: selectedTableId })}
          >
            Assigner
          </Button>
        </div>
      )}
    </div>
  );
}
