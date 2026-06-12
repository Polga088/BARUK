import { prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";

export default async function AdminDashboardPage() {
  const [orgCount, branchCount, userCount, orderCount] = await Promise.all([
    prisma.organization.count(),
    prisma.branch.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: "PAID" } }),
  ]);

  const stats = [
    { label: "Organisations", value: orgCount },
    { label: "Filiales", value: branchCount },
    { label: "Utilisateurs", value: userCount },
    { label: "Commandes payées", value: orderCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vue globale</h1>
        <p className="text-zinc-500">Supervision multi-filiales BARUK.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Panel key={stat.label}>
            <PanelContent>
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-baruk-700">{stat.value}</p>
            </PanelContent>
          </Panel>
        ))}
      </div>
    </div>
  );
}
