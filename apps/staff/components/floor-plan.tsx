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
  reservationGuest?: string | null;
  reservationTime?: string | null;
}

const statusStyles: Record<
  string,
  { variant: "success" | "warning" | "default" | "muted"; border: string }
> = {
  FREE: { variant: "success", border: "border-baruk-400/50 hover:border-baruk-400" },
  OCCUPIED: { variant: "warning", border: "border-baruk-600/60 hover:border-baruk-600" },
  RESERVED: { variant: "default", border: "border-gold-500/40 hover:border-gold-500" },
  CLEANING: { variant: "muted", border: "border-baruk-800 hover:border-baruk-700" },
};

export function FloorPlan({ tables }: { tables: TableView[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tables.map((table) => {
        const style = statusStyles[table.status] ?? statusStyles.CLEANING!;
        return (
          <Link
            key={table.id}
            href={
              table.openOrderId
                ? `/orders/${table.openOrderId}`
                : `/orders/new?tableId=${table.id}`
            }
            className={`min-h-[120px] rounded-2xl border bg-warm-800 p-5 transition-all active:scale-[0.98] ${style.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-xl font-semibold text-cream-100">
                  {table.name}
                </p>
                <p className="mt-1 text-sm text-baruk-300">
                  {table.capacity} places · {table.section}
                </p>
              </div>
              <Badge variant={style.variant}>{table.status}</Badge>
            </div>
            {table.hasOpenOrder && (
              <p className="mt-4 text-sm font-medium text-gold-400">
                Commande en cours →
              </p>
            )}
            {!table.hasOpenOrder && table.reservationGuest && (
              <p className="mt-4 text-sm text-gold-400">
                {table.reservationTime} · {table.reservationGuest}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
