"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import { ORDER_STATUS_LABELS } from "../lib/kitchen";

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

interface Totals {
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
}

export function OrderPanel({
  orderId,
  tableName,
  menuItems,
  initialLines,
  subtotal: initialSubtotal,
  taxAmount: initialTax,
  tipAmount: initialTip,
  total: initialTotal,
  status,
}: {
  orderId: string;
  tableName: string;
  menuItems: MenuItem[];
  initialLines: OrderLine[];
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
  status: string;
}) {
  const router = useRouter();
  const [lines, setLines] = useState(initialLines);
  const [orderStatus, setOrderStatus] = useState(status);
  const [totals, setTotals] = useState<Totals>({
    subtotal: initialSubtotal,
    taxAmount: initialTax,
    tipAmount: initialTip,
    total: initialTotal,
  });
  const [tipInput, setTipInput] = useState(String(initialTip || ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isClosed = orderStatus === "PAID" || orderStatus === "CANCELLED";

  useEffect(() => {
    setOrderStatus(status);
  }, [status]);

  useEffect(() => {
    if (isClosed) return;
    const interval = setInterval(async () => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = (await response.json()) as { status: string };
        setOrderStatus(data.status);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, isClosed]);

  useEffect(() => {
    setLines(initialLines);
    setTotals({
      subtotal: initialSubtotal,
      taxAmount: initialTax,
      tipAmount: initialTip,
      total: initialTotal,
    });
    setTipInput(String(initialTip || ""));
  }, [initialLines, initialSubtotal, initialTax, initialTip, initialTotal]);

  function applyResponse(data: {
    lines?: OrderLine[];
    subtotal: number;
    taxAmount: number;
    tipAmount: number;
    total: number;
  }) {
    if (data.lines) setLines(data.lines);
    setTotals({
      subtotal: data.subtotal,
      taxAmount: data.taxAmount,
      tipAmount: data.tipAmount,
      total: data.total,
    });
    setTipInput(String(data.tipAmount || ""));
  }

  async function addItem(item: MenuItem) {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/orders/${orderId}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId: item.id }),
    });

    if (response.ok) {
      const data = await response.json();
      setTotals({
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        tipAmount: data.tipAmount,
        total: data.total,
      });
      router.refresh();
    } else {
      setError("Impossible d'ajouter l'article.");
    }
    setLoading(false);
  }

  async function updateLineQuantity(lineId: string, quantity: number) {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/orders/${orderId}/lines/${lineId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (response.ok) {
      applyResponse(await response.json());
    } else {
      setError("Modification impossible.");
    }
    setLoading(false);
  }

  async function removeLine(lineId: string) {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/orders/${orderId}/lines/${lineId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      applyResponse(await response.json());
    } else {
      setError("Suppression impossible.");
    }
    setLoading(false);
  }

  async function applyTip(amount: number) {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/orders/${orderId}/tip`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipAmount: amount }),
    });

    if (response.ok) {
      applyResponse(await response.json());
    } else {
      setError("Pourboire invalide.");
    }
    setLoading(false);
  }

  async function markServed() {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SERVED" }),
    });

    if (response.ok) {
      setOrderStatus("SERVED");
    } else {
      setError("Impossible de marquer comme servi.");
    }
    setLoading(false);
  }

  async function payOrder() {
    setLoading(true);
    setError(null);
    const tip = Number.parseFloat(tipInput) || 0;
    const response = await fetch(`/api/orders/${orderId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipAmount: tip }),
    });

    if (response.ok) {
      router.push(`/receipt/${orderId}`);
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Encaissement impossible.");
      setLoading(false);
    }
  }

  async function cancelOrder() {
    if (!confirm("Annuler cette commande et libérer la table ?")) return;

    setLoading(true);
    setError(null);
    const response = await fetch(`/api/orders/${orderId}/cancel`, {
      method: "POST",
    });

    if (response.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Annulation impossible.");
      setLoading(false);
    }
  }

  const tipPresets = [0, 5, 10, 20];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Commande
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-cream-100">
              {tableName}
            </h1>
            <p className="text-baruk-300">
              Statut ·{" "}
              {ORDER_STATUS_LABELS[orderStatus as keyof typeof ORDER_STATUS_LABELS] ??
                orderStatus}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {orderStatus === "READY" && !isClosed && (
              <Button size="sm" disabled={loading} onClick={markServed}>
                Servi au client
              </Button>
            )}
            {!isClosed && (
            <Button
              variant="danger"
              size="sm"
              disabled={loading}
              onClick={cancelOrder}
            >
              Annuler
            </Button>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={loading || isClosed}
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

        {lines.length === 0 ? (
          <p className="mt-6 text-sm text-baruk-400">Aucun article — ajoutez des plats.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {lines.map((line) => (
              <li
                key={line.id}
                className="rounded-xl border border-baruk-800/80 bg-warm-900/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-cream-100">{line.name}</p>
                    <p className="text-xs text-baruk-400">
                      {line.unitPrice.toFixed(0)} MAD / unité
                    </p>
                  </div>
                  <p className="font-semibold text-gold-400">
                    {line.total.toFixed(0)} MAD
                  </p>
                </div>

                {!isClosed && (
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => updateLineQuantity(line.id, line.quantity - 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-baruk-700 bg-warm-800 text-lg font-bold text-cream-100 active:scale-95 disabled:opacity-50"
                        aria-label="Diminuer"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center font-semibold text-cream-100">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => updateLineQuantity(line.id, line.quantity + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-baruk-700 bg-warm-800 text-lg font-bold text-cream-100 active:scale-95 disabled:opacity-50"
                        aria-label="Augmenter"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => removeLine(line.id)}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 space-y-2 border-t border-baruk-700 pt-4 text-sm">
          <p className="flex justify-between text-baruk-300">
            <span>Sous-total</span>
            <span>{totals.subtotal.toFixed(0)} MAD</span>
          </p>
          <p className="flex justify-between text-baruk-300">
            <span>TVA (10%)</span>
            <span>{totals.taxAmount.toFixed(0)} MAD</span>
          </p>
          {totals.tipAmount > 0 && (
            <p className="flex justify-between text-baruk-300">
              <span>Pourboire</span>
              <span>{totals.tipAmount.toFixed(0)} MAD</span>
            </p>
          )}
          <p className="flex justify-between text-lg font-bold text-gold-400">
            <span>Total TTC</span>
            <span>{totals.total.toFixed(0)} MAD</span>
          </p>
        </div>

        {!isClosed && lines.length > 0 && (
          <div className="mt-4 border-t border-baruk-700 pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-baruk-400">
              Pourboire
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tipPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setTipInput(String(preset));
                    void applyTip(preset);
                  }}
                  className={`min-h-[44px] rounded-lg px-4 text-sm font-medium transition ${
                    totals.tipAmount === preset
                      ? "bg-baruk-600 text-white"
                      : "border border-baruk-700 text-cream-200 hover:border-baruk-500"
                  }`}
                >
                  {preset === 0 ? "Aucun" : `${preset} MAD`}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                min={0}
                step={1}
                value={tipInput}
                onChange={(e) => setTipInput(e.target.value)}
                onBlur={() => {
                  const val = Number.parseFloat(tipInput) || 0;
                  void applyTip(val);
                }}
                className="min-h-[44px] flex-1 rounded-lg border border-baruk-700 bg-warm-900 px-3 text-cream-100"
                placeholder="Montant libre"
              />
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => applyTip(Number.parseFloat(tipInput) || 0)}
              >
                OK
              </Button>
            </div>
          </div>
        )}

        {!isClosed && (
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
