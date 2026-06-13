"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(amount);
}

const entryLabels: Record<string, string> = {
  SALE: "Vente",
  TIP: "Pourboire",
  REFUND: "Remboursement",
  EXPENSE: "Dépense",
  ADJUSTMENT: "Ajustement",
};

export function LedgerDayPanel({
  ledger,
  expectedCash,
}: {
  ledger: {
    id: string;
    closedAt: string | null;
    notes: string | null;
    openingCash: number;
    closingCash: number | null;
    totalSales: number;
    totalTips: number;
    totalExpenses: number;
    entries: {
      id: string;
      type: string;
      amount: number;
      description: string | null;
      createdAt: string;
    }[];
  };
  expectedCash: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [closingCash, setClosingCash] = useState(String(Math.round(expectedCash)));
  const [closeNotes, setCloseNotes] = useState("");

  const isClosed = Boolean(ledger.closedAt);

  async function addExpense(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/ledger/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number.parseFloat(expenseAmount),
        description: expenseDescription,
      }),
    });

    setLoading(false);
    if (response.ok) {
      setExpenseAmount("");
      setExpenseDescription("");
      router.refresh();
      return;
    }

    const data = (await response.json()) as { error?: string };
    setError(data.error ?? "Erreur.");
  }

  async function closeDay(event: React.FormEvent) {
    event.preventDefault();
    if (!confirm("Clôturer la caisse du jour ?")) return;

    setLoading(true);
    setError(null);

    const response = await fetch("/api/ledger/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        closingCash: Number.parseFloat(closingCash),
        notes: closeNotes || undefined,
      }),
    });

    setLoading(false);
    if (response.ok) {
      router.refresh();
      return;
    }

    const data = (await response.json()) as { error?: string };
    setError(data.error ?? "Erreur.");
  }

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader
          title="Caisse du jour"
          action={
            isClosed ? (
              <Badge variant="muted">Clôturée</Badge>
            ) : (
              <Badge variant="success">Ouverte</Badge>
            )
          }
        />
        <PanelContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Fond de caisse" value={formatCurrency(ledger.openingCash)} />
            <Stat label="Ventes" value={formatCurrency(ledger.totalSales)} />
            <Stat label="Pourboires" value={formatCurrency(ledger.totalTips)} />
            <Stat label="Dépenses" value={formatCurrency(ledger.totalExpenses)} />
          </div>

          <p className="rounded-xl bg-gold-50 px-4 py-3 text-sm text-baruk-900">
            Caisse théorique :{" "}
            <strong className="text-gold-700">{formatCurrency(expectedCash)}</strong>
            {ledger.closingCash !== null && (
              <>
                {" "}
                · Comptée :{" "}
                <strong>{formatCurrency(ledger.closingCash)}</strong>
              </>
            )}
          </p>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {!isClosed && (
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={addExpense} className="space-y-3 rounded-xl border border-baruk-100 p-4">
                <h3 className="font-medium text-baruk-900">Ajouter une dépense</h3>
                <div>
                  <Label htmlFor="expense-amount">Montant (MAD)</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    min={0}
                    step={0.01}
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-description">Description</Label>
                  <Input
                    id="expense-description"
                    required
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="mt-1"
                    placeholder="Ex. courses, livraison…"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  Enregistrer la dépense
                </Button>
              </form>

              <form onSubmit={closeDay} className="space-y-3 rounded-xl border border-baruk-100 p-4">
                <h3 className="font-medium text-baruk-900">Clôturer la journée</h3>
                <div>
                  <Label htmlFor="closing-cash">Caisse comptée (MAD)</Label>
                  <Input
                    id="closing-cash"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={closingCash}
                    onChange={(e) => setClosingCash(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="close-notes">Notes</Label>
                  <Input
                    id="close-notes"
                    value={closeNotes}
                    onChange={(e) => setCloseNotes(e.target.value)}
                    className="mt-1"
                    placeholder="Optionnel"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  Clôturer la caisse
                </Button>
              </form>
            </div>
          )}

          {isClosed && ledger.notes && (
            <p className="text-sm text-baruk-700/70">Notes : {ledger.notes}</p>
          )}
        </PanelContent>
      </Panel>

      <Panel>
        <PanelHeader title="Mouvements du jour" />
        <PanelContent>
          {ledger.entries.length === 0 ? (
            <p className="text-sm text-baruk-700/60">Aucun mouvement.</p>
          ) : (
            <ul className="divide-y divide-baruk-50">
              {ledger.entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-baruk-900">
                      {entryLabels[entry.type] ?? entry.type}
                      {entry.description ? ` · ${entry.description}` : ""}
                    </p>
                    <p className="text-baruk-700/60">
                      {new Date(entry.createdAt).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={
                      entry.type === "EXPENSE"
                        ? "font-semibold text-red-600"
                        : "font-semibold text-gold-600"
                    }
                  >
                    {entry.type === "EXPENSE" ? "−" : "+"}
                    {formatCurrency(entry.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelContent>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-baruk-100 bg-cream-50/80 p-3">
      <p className="text-xs uppercase tracking-wide text-baruk-700/60">{label}</p>
      <p className="mt-1 text-lg font-semibold text-baruk-900">{value}</p>
    </div>
  );
}
