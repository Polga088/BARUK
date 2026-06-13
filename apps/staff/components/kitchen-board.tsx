"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";

interface KitchenOrder {
  id: string;
  orderNumber: number;
  status: string;
  statusLabel: string;
  tableName: string;
  updatedAt: string;
  lines: { name: string; quantity: number; notes: string | null }[];
}

const columns = [
  { key: "SENT", title: "À préparer", next: "PREPARING", action: "Commencer" },
  { key: "PREPARING", title: "En cours", next: "READY", action: "Prêt" },
  { key: "READY", title: "Prêts", next: null, action: null },
] as const;

export function KitchenBoard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/sync", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as {
      updatedAt: string;
      kitchen: KitchenOrder[];
    };
    setOrders(data.kitchen);
    setLastSync(data.updatedAt);
  }, []);

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => {
      void refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function advanceStatus(orderId: string, status: string) {
    setLoadingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        await refresh();
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-baruk-500">
        Cuisine · sync 3s ·{" "}
        {lastSync
          ? `MAJ ${new Date(lastSync).toLocaleTimeString("fr-FR")}`
          : "…"}
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => {
          const columnOrders = orders.filter(
            (order) => order.status === column.key,
          );

          return (
            <section
              key={column.key}
              className="rounded-2xl border border-baruk-800 bg-warm-800/80 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-cream-100">
                  {column.title}
                </h2>
                <Badge variant="default">{columnOrders.length}</Badge>
              </div>

              <div className="space-y-3">
                {columnOrders.length === 0 ? (
                  <p className="text-sm text-baruk-500">Aucune commande</p>
                ) : (
                  columnOrders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-xl border border-baruk-700 bg-warm-900/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-base font-semibold text-gold-400">
                            #{order.orderNumber}
                          </p>
                          <p className="text-sm text-cream-100">{order.tableName}</p>
                        </div>
                        <Badge variant="warning">{order.statusLabel}</Badge>
                      </div>

                      <ul className="mt-3 space-y-1 text-sm text-baruk-200">
                        {order.lines.map((line, index) => (
                          <li key={`${order.id}-${index}`}>
                            <span className="font-semibold text-cream-100">
                              {line.quantity}×
                            </span>{" "}
                            {line.name}
                          </li>
                        ))}
                      </ul>

                      {column.next && column.action && (
                        <Button
                          className="mt-4 w-full"
                          size="sm"
                          disabled={loadingId === order.id}
                          onClick={() => advanceStatus(order.id, column.next!)}
                        >
                          {column.action}
                        </Button>
                      )}

                      {column.key === "READY" && (
                        <p className="mt-3 text-xs text-baruk-400">
                          Le serveur marque « Servi » depuis la commande.
                        </p>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
