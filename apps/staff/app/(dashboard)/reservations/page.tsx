import {
  getDefaultBranch,
  prisma,
  ReservationStatus,
  RESERVATION_STATUS_LABELS,
} from "@repo/database";
import { StaffReservationList } from "../../../components/staff-reservation-list";

export default async function StaffReservationsPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reservations = await prisma.reservation.findMany({
    where: {
      branchId: branch.id,
      date: today,
      status: {
        in: [
          ReservationStatus.PENDING,
          ReservationStatus.CONFIRMED,
          ReservationStatus.SEATED,
        ],
      },
    },
    include: {
      table: true,
    },
    orderBy: [{ time: "asc" }],
  });

  const openOrders = await prisma.order.findMany({
    where: {
      branchId: branch.id,
      status: { notIn: ["PAID", "CANCELLED"] },
      tableId: { not: null },
    },
    select: { id: true, tableId: true },
  });

  const orderByTable = new Map(
    openOrders.map((order) => [order.tableId!, order.id]),
  );

  const view = reservations.map((reservation) => ({
    id: reservation.id,
    guestName: reservation.guestName,
    guestPhone: reservation.guestPhone,
    partySize: reservation.partySize,
    time: reservation.time,
    status: reservation.status,
    statusLabel: RESERVATION_STATUS_LABELS[reservation.status],
    tableName: reservation.table
      ? (reservation.table.name ?? `Table ${reservation.table.number}`)
      : null,
    tableId: reservation.tableId,
    openOrderId: reservation.tableId
      ? (orderByTable.get(reservation.tableId) ?? null)
      : null,
    notes: reservation.notes,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-cream-100">Réservations du jour</h1>
        <p className="text-baruk-300">
          {today.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>
      <StaffReservationList reservations={view} />
    </div>
  );
}
