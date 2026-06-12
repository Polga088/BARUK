"use client";

import Link from "next/link";
import { Badge } from "@repo/ui/badge";

interface TableView {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: string;
  section: string | null;
  hasOpenOrder: boolean;
  openOrderId: string | null;
}

const statusColors: Record<string, "success" | "warning" | "danger" | "muted" | "default"> = {
  FREE: "success",
  OCCUPIED: "warning",
  RESERVED: "default",
  CLEANING: "muted",
};

export function FloorPlan({ tables }: { tables: TableView[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tables.map((table) => (
        <Link
          key={table.id}
          href={
            table.openOrderId
              ? `/orders/${table.openOrderId}`
              : `/orders/new?tableId=${table.id}`
          }
          className="rounded-xl border border-surface-700 bg-surface-900 p-4 transition hover:border-baruk-500"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold">{table.name}</p>
              <p className="text-sm text-zinc-400">
                {table.capacity} places · {table.section}
              </p>
            </div>
            <Badge variant={statusColors[table.status] ?? "muted"}>
              {table.status}
            </Badge>
          </div>
          {table.hasOpenOrder && (
            <p className="mt-3 text-sm text-baruk-300">Commande en cours</p>
          )}
        </Link>
      ))}
    </div>
  );
}
