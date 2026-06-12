import { prisma } from "@repo/database";
import { StatCard } from "@repo/ui/dashboard";
import { PageHeader } from "@repo/ui/layout";

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
    <div className="space-y-8">
      <PageHeader
        title="Vue globale"
        description="Supervision multi-filiales BARUK."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
}
