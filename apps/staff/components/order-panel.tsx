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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          Commande
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-cream-100">
          {tableName}
        </h1>
        <p className="text-baruk-300">Statut · {status}</p>

        <div className="mt-5 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={loading || status === "PAID"}
              onClick={() => addItem(item)}
              className="flex min-h-[52px] w-full items-center justify-between rounded-xl border border-baruk-800 bg-warm-800 px-4 py-3 text-left transition hover:border-baruk-600 active:scale-[0.99] disabled:opacity-50"
            >
              <div>
                <p className="font-medium text-cream-100">{item.name}</p>
                <p className="text-xs text-baruk-400">{item.categoryName}</p>
              </div>
              <span className="font-semibold text-gold-400">
                {item.price.toFixed(0)} MAD
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-baruk-800 bg-warm-800 p-5">
        <h2 className="font-display text-lg font-semibold text-cream-100">
          Ticket en cours
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex justify-between border-b border-baruk-800/80 pb-2 text-cream-200"
            >
              <span>
                {line.quantity}x {line.name}
              </span>
              <span>{line.total.toFixed(0)} MAD</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-baruk-700 pt-4 text-sm">
          <p className="flex justify-between text-baruk-300">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(0)} MAD</span>
          </p>
          <p className="flex justify-between text-lg font-bold text-gold-400">
            <span>Total TTC</span>
            <span>{total.toFixed(0)} MAD</span>
          </p>
        </div>
        {status !== "PAID" && (
          <Button
            className="mt-5 w-full min-h-[52px]"
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
