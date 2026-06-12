import {
  decimalToNumber,
  formatCurrency,
  getDefaultBranch,
  prisma,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { LedgerSummary } from "../../../components/ledger-summary";

export default async function OwnerLedgerPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dailyLedgers, weekOrders, monthOrders] = await Promise.all([
    prisma.dailyLedger.findMany({
      where: { branchId: branch.id },
      include: { entries: true },
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Journal comptable</h1>
        <p className="text-zinc-500">Jour, semaine et mois.</p>
      </div>

      <LedgerSummary
        weekRevenue={weekRevenue}
        monthRevenue={monthRevenue}
      />

      <Panel>
        <PanelHeader title="Historique journalier" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Ventes</th>
                <th className="py-2 pr-4">Pourboires</th>
                <th className="py-2">Dépenses</th>
              </tr>
            </thead>
            <tbody>
              {dailyLedgers.map((ledger) => (
                <tr key={ledger.id} className="border-b border-zinc-100">
                  <td className="py-3 pr-4">
                    {ledger.date.toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 pr-4">
                    {formatCurrency(decimalToNumber(ledger.totalSales))}
                  </td>
                  <td className="py-3 pr-4">
                    {formatCurrency(decimalToNumber(ledger.totalTips))}
                  </td>
                  <td className="py-3">
                    {formatCurrency(decimalToNumber(ledger.totalExpenses))}
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
