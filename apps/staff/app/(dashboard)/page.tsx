import { getDefaultBranch, prisma } from "@repo/database";
import { FloorPlan } from "../../components/floor-plan";

export default async function StaffHomePage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const tables = await prisma.restaurantTable.findMany({
    where: { branchId: branch.id, isActive: true },
    include: {
      orders: {
        where: { status: { notIn: ["PAID", "CANCELLED"] } },
        take: 1,
      },
    },
    orderBy: { number: "asc" },
  });

  const view = tables.map((table) => ({
    id: table.id,
    number: table.number,
    name: table.name ?? `Table ${table.number}`,
    capacity: table.capacity,
    status: table.status,
    section: table.section,
    hasOpenOrder: table.orders.length > 0,
    openOrderId: table.orders[0]?.id ?? null,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Plan de salle</h1>
        <p className="text-zinc-400">{branch.name}</p>
      </div>
      <FloorPlan tables={view} />
    </div>
  );
}
