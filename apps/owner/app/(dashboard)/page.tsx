import {
  decimalToNumber,
  formatCurrency,
  getDefaultBranch,
  prisma,
  ReservationStatus,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";

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
    {
      label: "CA du jour",
      value: formatCurrency(revenueToday),
    },
    {
      label: "Commandes payées",
      value: String(ordersToday.length),
    },
    {
      label: "Réservations en attente",
      value: String(reservationsPending),
    },
    {
      label: "Alertes stock",
      value: String(lowStockItems.length),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Tableau de bord</h1>
        <p className="text-zinc-500">Vue d&apos;ensemble de {branch.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Panel key={stat.label}>
            <PanelContent>
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-baruk-700">
                {stat.value}
              </p>
            </PanelContent>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Caisse du jour" />
          <PanelContent className="space-y-2 text-sm">
            <p>
              Fond de caisse :{" "}
              <strong>
                {formatCurrency(decimalToNumber(ledger?.openingCash ?? 0))}
              </strong>
            </p>
            <p>
              Ventes enregistrées :{" "}
              <strong>
                {formatCurrency(decimalToNumber(ledger?.totalSales ?? 0))}
              </strong>
            </p>
            <p>
              Pourboires :{" "}
              <strong>
                {formatCurrency(decimalToNumber(ledger?.totalTips ?? 0))}
              </strong>
            </p>
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader title="Stock critique" />
          <PanelContent>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-zinc-500">Aucune alerte.</p>
            ) : (
              <ul className="space-y-2">
                {lowStockItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{item.name}</span>
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
