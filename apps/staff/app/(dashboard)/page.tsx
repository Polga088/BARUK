import { getDefaultBranch, prisma, ReservationStatus } from "@repo/database";
import { LiveFloorPlan } from "../../components/live-floor-plan";

export default async function StaffHomePage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tables = await prisma.restaurantTable.findMany({
    where: { branchId: branch.id, isActive: true },
    include: {
      orders: {
        where: { status: { notIn: ["PAID", "CANCELLED"] } },
        take: 1,
      },
      reservations: {
        where: {
          date: today,
          status: {
            in: [ReservationStatus.CONFIRMED, ReservationStatus.SEATED],
          },
        },
        take: 1,
        orderBy: { time: "asc" },
      },
    },
    orderBy: { number: "asc" },
  });

  const view = tables.map((table) => {
    const reservation = table.reservations[0];
    return {
      id: table.id,
      number: table.number,
      name: table.name ?? `Table ${table.number}`,
      capacity: table.capacity,
      status: table.status,
      section: table.section,
      hasOpenOrder: table.orders.length > 0,
      openOrderId: table.orders[0]?.id ?? null,
      reservationGuest: reservation?.guestName ?? null,
      reservationTime: reservation?.time ?? null,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-cream-100">Plan de salle</h1>
        <p className="text-baruk-300">{branch.name}</p>
      </div>
      <LiveFloorPlan initialTables={view} />
    </div>
  );
}
