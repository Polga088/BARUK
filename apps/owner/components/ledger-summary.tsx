"use client";

import { Panel, PanelContent } from "@repo/ui/panel";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(amount);
}

export function LedgerSummary({
  weekRevenue,
  monthRevenue,
}: {
  weekRevenue: number;
  monthRevenue: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Panel>
        <PanelContent>
          <p className="text-sm text-zinc-500">CA semaine</p>
          <p className="mt-2 text-2xl font-bold text-baruk-700">
            {formatCurrency(weekRevenue)}
          </p>
        </PanelContent>
      </Panel>
      <Panel>
        <PanelContent>
          <p className="text-sm text-zinc-500">CA mois</p>
          <p className="mt-2 text-2xl font-bold text-baruk-700">
            {formatCurrency(monthRevenue)}
          </p>
        </PanelContent>
      </Panel>
    </div>
  );
}
