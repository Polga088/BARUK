import {
  decimalToNumber,
  ensureTodayLedger,
  formatCurrency,
  getDefaultBranch,
  ledgerExpectedCash,
  prisma,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { PageHeader } from "@repo/ui/layout";
import { LedgerSummary } from "../../../components/ledger-summary";
import { LedgerDayPanel } from "../../../components/ledger-day-panel";

export default async function OwnerLedgerPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayLedger, dailyLedgers, weekOrders, monthOrders] = await Promise.all([
    ensureTodayLedger(branch.id),
    prisma.dailyLedger.findMany({
      where: { branchId: branch.id },
      orderBy: { date: "desc" },
      take: 14,
    }),
    prisma.order.findMany({
      where: {
        branchId: branch.id,
        status: "PAID",
        paidAt: { gte: weekStart },
      },
    }),
    prisma.order.findMany({
      where: {
        branchId: branch.id,
        status: "PAID",
        paidAt: { gte: monthStart },
      },
    }),
  ]);

  const weekRevenue = weekOrders.reduce(
    (sum, o) => sum + decimalToNumber(o.total),
    0,
  );
  const monthRevenue = monthOrders.reduce(
    (sum, o) => sum + decimalToNumber(o.total),
    0,
  );

  const expectedCash = ledgerExpectedCash(todayLedger);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal comptable"
        description="Caisse du jour, dépenses et clôture."
      />

      <LedgerSummary weekRevenue={weekRevenue} monthRevenue={monthRevenue} />

      <LedgerDayPanel
        expectedCash={expectedCash}
        ledger={{
          id: todayLedger.id,
          closedAt: todayLedger.closedAt?.toISOString() ?? null,
          notes: todayLedger.notes,
          openingCash: decimalToNumber(todayLedger.openingCash),
          closingCash:
            todayLedger.closingCash !== null
              ? decimalToNumber(todayLedger.closingCash)
              : null,
          totalSales: decimalToNumber(todayLedger.totalSales),
          totalTips: decimalToNumber(todayLedger.totalTips),
          totalExpenses: decimalToNumber(todayLedger.totalExpenses),
          entries: todayLedger.entries.map((entry) => ({
            id: entry.id,
            type: entry.type,
            amount: decimalToNumber(entry.amount),
            description: entry.description,
            createdAt: entry.createdAt.toISOString(),
          })),
        }}
      />

      <Panel>
        <PanelHeader title="Historique journalier" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-baruk-100 text-left text-baruk-700/70">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Ventes</th>
                <th className="py-2 pr-4">Pourboires</th>
                <th className="py-2 pr-4">Dépenses</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {dailyLedgers.map((ledger) => (
                <tr key={ledger.id} className="border-b border-baruk-50">
                  <td className="py-3 pr-4">
                    {ledger.date.toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 pr-4">
                    {formatCurrency(decimalToNumber(ledger.totalSales))}
                  </td>
                  <td className="py-3 pr-4">
                    {formatCurrency(decimalToNumber(ledger.totalTips))}
                  </td>
                  <td className="py-3 pr-4">
                    {formatCurrency(decimalToNumber(ledger.totalExpenses))}
                  </td>
                  <td className="py-3">
                    {ledger.closedAt ? "Clôturée" : "Ouverte"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelContent>
      </Panel>
    </div>
  );
}
