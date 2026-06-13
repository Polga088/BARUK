"use client";

import { useCallback, useEffect, useState } from "react";
import { FloorPlan } from "./floor-plan";

interface SyncTable {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: string;
  section: string | null;
  hasOpenOrder: boolean;
  openOrderId: string | null;
  reservationGuest?: string | null;
  reservationTime?: string | null;
}

export function LiveFloorPlan({ initialTables }: { initialTables: SyncTable[] }) {
  const [tables, setTables] = useState(initialTables);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/sync", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as {
      updatedAt: string;
      tables: SyncTable[];
    };
    setTables(data.tables);
    setLastSync(data.updatedAt);
  }, []);

  useEffect(() => {
    setTables(initialTables);
  }, [initialTables]);

  useEffect(() => {
    const interval = setInterval(() => {
      void refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-baruk-500">
        Sync auto ·{" "}
        {lastSync
          ? `MAJ ${new Date(lastSync).toLocaleTimeString("fr-FR")}`
          : "en direct"}
      </p>
      <FloorPlan tables={tables} />
    </div>
  );
}
