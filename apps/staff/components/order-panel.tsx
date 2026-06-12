"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryName: string;
}

interface OrderLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function OrderPanel({
  orderId,
  tableName,
  menuItems,
  initialLines,
  subtotal,
  total,
  status,
}: {
  orderId: string;
  tableName: string;
  menuItems: MenuItem[];
  initialLines: OrderLine[];
  subtotal: number;
  total: number;
  status: string;
}) {
  const router = useRouter();
  const [lines, setLines] = useState(initialLines);
  const [loading, setLoading] = useState(false);

  async function addItem(item: MenuItem) {
    setLoading(true);
    const response = await fetch(`/api/orders/${orderId}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId: item.id }),
    });

    if (response.ok) {
      router.refresh();
    }
    setLoading(false);
  }

  async function payOrder() {
    setLoading(true);
    await fetch(`/api/orders/${orderId}/pay`, { method: "POST" });
    router.push(`/receipt/${orderId}`);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold">{tableName}</h1>
        <p className="text-zinc-400">Commande · {status}</p>

        <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={loading || status === "PAID"}
              onClick={() => addItem(item)}
              className="flex w-full items-center justify-between rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-left hover:border-baruk-500 disabled:opacity-50"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.categoryName}</p>
              </div>
              <span className="text-baruk-300">{item.price.toFixed(0)} MAD</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-surface-700 bg-surface-900 p-4">
        <h2 className="font-semibold">Ticket en cours</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map((line) => (
            <li key={line.id} className="flex justify-between">
              <span>
                {line.quantity}x {line.name}
              </span>
              <span>{line.total.toFixed(0)} MAD</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-surface-700 pt-4 space-y-1 text-sm">
          <p className="flex justify-between">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(0)} MAD</span>
          </p>
          <p className="flex justify-between font-bold text-baruk-300">
            <span>Total TTC</span>
            <span>{total.toFixed(0)} MAD</span>
          </p>
        </div>
        {status !== "PAID" && (
          <Button
            className="mt-4 w-full"
            size="lg"
            disabled={loading || lines.length === 0}
            onClick={payOrder}
          >
            Encaisser & générer reçu
          </Button>
        )}
      </div>
    </div>
  );
}
