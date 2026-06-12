import {
  decimalToNumber,
  formatCurrency,
  getDefaultBranch,
  prisma,
  ReservationStatus,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { StatCard } from "@repo/ui/dashboard";
import { PageHeader } from "@repo/ui/layout";

export default async function OwnerDashboardPage() {
  const branch = await getDefaultBranch();
  if (!branch) {
    return <p>Aucune filiale configurée.</p>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, reservationsPending, lowStock, ledger] =
    await Promise.all([
      prisma.order.findMany({
        where: {
          branchId: branch.id,
          createdAt: { gte: today },
          status: "PAID",
        },
      }),
      prisma.reservation.count({
        where: {
          branchId: branch.id,
          status: ReservationStatus.PENDING,
        },
      }),
      prisma.stockItem.findMany({
        where: { branchId: branch.id },
      }),
      prisma.dailyLedger.findUnique({
        where: { branchId_date: { branchId: branch.id, date: today } },
      }),
    ]);

  const revenueToday = ordersToday.reduce(
    (sum, order) => sum + decimalToNumber(order.total),
    0,
  );

  const lowStockItems = lowStock.filter(
    (item) => decimalToNumber(item.quantity) <= decimalToNumber(item.minThreshold),
  );

  const stats = [
    { label: "CA du jour", value: formatCurrency(revenueToday) },
    { label: "Commandes payées", value: String(ordersToday.length) },
    { label: "Réservations en attente", value: String(reservationsPending) },
    { label: "Alertes stock", value: String(lowStockItems.length) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        description={`Vue d'ensemble de ${branch.name}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Caisse du jour" />
          <PanelContent className="space-y-3 text-sm">
            <p className="flex justify-between border-b border-baruk-100 pb-2">
              <span className="text-baruk-700/70">Fond de caisse</span>
              <strong className="text-baruk-900">
                {formatCurrency(decimalToNumber(ledger?.openingCash ?? 0))}
              </strong>
            </p>
            <p className="flex justify-between border-b border-baruk-100 pb-2">
              <span className="text-baruk-700/70">Ventes enregistrées</span>
              <strong className="text-gold-600">
                {formatCurrency(decimalToNumber(ledger?.totalSales ?? 0))}
              </strong>
            </p>
            <p className="flex justify-between">
              <span className="text-baruk-700/70">Pourboires</span>
              <strong className="text-baruk-900">
                {formatCurrency(decimalToNumber(ledger?.totalTips ?? 0))}
              </strong>
            </p>
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader title="Stock critique" />
          <PanelContent>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-baruk-700/60">Aucune alerte.</p>
            ) : (
              <ul className="space-y-3">
                {lowStockItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-baruk-900">{item.name}</span>
                    <Badge variant="danger">
                      {decimalToNumber(item.quantity)} {item.unit}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
}
