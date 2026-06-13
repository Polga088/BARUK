import {
  Prisma,
  ReservationStatus,
  TableStatus,
} from "@prisma/client";
import { prisma } from "./index";

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  SEATED: "Installée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  NO_SHOW: "Absent",
};

const TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: [ReservationStatus.CONFIRMED, ReservationStatus.CANCELLED],
  CONFIRMED: [
    ReservationStatus.SEATED,
    ReservationStatus.CANCELLED,
    ReservationStatus.NO_SHOW,
  ],
  SEATED: [ReservationStatus.COMPLETED, ReservationStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export class ReservationError extends Error {
  constructor(
    public code:
      | "NOT_FOUND"
      | "INVALID_TRANSITION"
      | "TABLE_REQUIRED"
      | "TABLE_NOT_FOUND"
      | "TABLE_CONFLICT"
      | "TABLE_TOO_SMALL"
      | "TABLE_BUSY"
      | "INVALID_STATE",
    message: string,
  ) {
    super(message);
    this.name = "ReservationError";
  }
}

export function canTransition(
  from: ReservationStatus,
  to: ReservationStatus,
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export async function findConflictingReservation(
  branchId: string,
  tableId: string,
  date: Date,
  time: string,
  excludeId?: string,
) {
  return prisma.reservation.findFirst({
    where: {
      branchId,
      tableId,
      date,
      time,
      status: {
        in: [ReservationStatus.CONFIRMED, ReservationStatus.SEATED],
      },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

async function tableHasOpenOrder(
  tx: Prisma.TransactionClient,
  tableId: string,
) {
  return tx.order.findFirst({
    where: {
      tableId,
      status: { notIn: ["PAID", "CANCELLED"] },
    },
  });
}

async function releaseTableIfIdle(
  tx: Prisma.TransactionClient,
  tableId: string,
  excludeReservationId?: string,
) {
  const openOrder = await tableHasOpenOrder(tx, tableId);
  if (openOrder) return;

  const activeReservation = await tx.reservation.findFirst({
    where: {
      tableId,
      status: {
        in: [ReservationStatus.CONFIRMED, ReservationStatus.SEATED],
      },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
  });
  if (activeReservation) return;

  await tx.restaurantTable.update({
    where: { id: tableId },
    data: { status: TableStatus.FREE },
  });
}

async function assertTableAssignable(
  branchId: string,
  tableId: string,
  partySize: number,
  date: Date,
  time: string,
  excludeReservationId?: string,
) {
  const table = await prisma.restaurantTable.findFirst({
    where: { id: tableId, branchId, isActive: true },
  });

  if (!table) {
    throw new ReservationError("TABLE_NOT_FOUND", "Table introuvable.");
  }

  if (table.capacity < partySize) {
    throw new ReservationError(
      "TABLE_TOO_SMALL",
      "Capacité insuffisante pour ce nombre de couverts.",
    );
  }

  const openOrder = await prisma.order.findFirst({
    where: {
      tableId,
      status: { notIn: ["PAID", "CANCELLED"] },
    },
  });
  if (openOrder) {
    throw new ReservationError("TABLE_BUSY", "Table occupée par une commande.");
  }

  const conflict = await findConflictingReservation(
    branchId,
    tableId,
    date,
    time,
    excludeReservationId,
  );
  if (conflict) {
    throw new ReservationError(
      "TABLE_CONFLICT",
      "Table déjà réservée sur ce créneau.",
    );
  }

  return table;
}

export async function getAvailableTablesForReservation(
  branchId: string,
  date: Date,
  time: string,
  partySize: number,
  excludeReservationId?: string,
) {
  const tables = await prisma.restaurantTable.findMany({
    where: {
      branchId,
      isActive: true,
      capacity: { gte: partySize },
    },
    orderBy: [{ capacity: "asc" }, { number: "asc" }],
  });

  const available = [];
  for (const table of tables) {
    try {
      await assertTableAssignable(
        branchId,
        table.id,
        partySize,
        date,
        time,
        excludeReservationId,
      );
      available.push(table);
    } catch (error) {
      if (
        error instanceof ReservationError &&
        (error.code === "TABLE_BUSY" || error.code === "TABLE_CONFLICT")
      ) {
        continue;
      }
      throw error;
    }
  }

  return available;
}

export async function updateReservation(
  reservationId: string,
  data: { status?: ReservationStatus; tableId?: string | null },
) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new ReservationError("NOT_FOUND", "Réservation introuvable.");
  }

  const nextStatus = data.status ?? reservation.status;
  const nextTableId =
    data.tableId !== undefined ? data.tableId : reservation.tableId;

  if (data.status && data.status !== reservation.status) {
    if (!canTransition(reservation.status, data.status)) {
      throw new ReservationError(
        "INVALID_TRANSITION",
        "Transition de statut invalide.",
      );
    }
  }

  const needsTable =
    nextStatus === ReservationStatus.CONFIRMED ||
    nextStatus === ReservationStatus.SEATED;

  if (needsTable && !nextTableId) {
    throw new ReservationError(
      "TABLE_REQUIRED",
      "Une table doit être assignée.",
    );
  }

  if (nextTableId) {
    await assertTableAssignable(
      reservation.branchId,
      nextTableId,
      reservation.partySize,
      reservation.date,
      reservation.time,
      reservationId,
    );
  }

  const terminalStatuses: ReservationStatus[] = [
    ReservationStatus.CANCELLED,
    ReservationStatus.NO_SHOW,
    ReservationStatus.COMPLETED,
  ];

  return prisma.$transaction(async (tx) => {
    const oldTableId = reservation.tableId;

    const updated = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: nextStatus,
        tableId: nextTableId,
      },
      include: { table: true },
    });

    if (
      oldTableId &&
      (oldTableId !== nextTableId || terminalStatuses.includes(nextStatus))
    ) {
      await releaseTableIfIdle(tx, oldTableId, reservationId);
    }

    if (nextTableId && !terminalStatuses.includes(nextStatus)) {
      if (nextStatus === ReservationStatus.CONFIRMED) {
        await tx.restaurantTable.update({
          where: { id: nextTableId },
          data: { status: TableStatus.RESERVED },
        });
      } else if (nextStatus === ReservationStatus.SEATED) {
        await tx.restaurantTable.update({
          where: { id: nextTableId },
          data: { status: TableStatus.OCCUPIED },
        });
      }
    }

    return updated;
  });
}

export async function seatReservation(reservationId: string, employeeId?: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new ReservationError("NOT_FOUND", "Réservation introuvable.");
  }

  if (reservation.status !== ReservationStatus.CONFIRMED) {
    throw new ReservationError(
      "INVALID_STATE",
      "Seules les réservations confirmées peuvent être installées.",
    );
  }

  if (!reservation.tableId) {
    throw new ReservationError(
      "TABLE_REQUIRED",
      "Aucune table assignée à cette réservation.",
    );
  }

  await assertTableAssignable(
    reservation.branchId,
    reservation.tableId,
    reservation.partySize,
    reservation.date,
    reservation.time,
    reservationId,
  );

  return prisma.$transaction(async (tx) => {
    const updated = await tx.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.SEATED },
      include: { table: true },
    });

    await tx.restaurantTable.update({
      where: { id: reservation.tableId! },
      data: { status: TableStatus.OCCUPIED },
    });

    const existingOrder = await tx.order.findFirst({
      where: {
        tableId: reservation.tableId!,
        status: { notIn: ["PAID", "CANCELLED"] },
      },
    });

    if (existingOrder) {
      return { reservation: updated, order: existingOrder };
    }

    const lastOrder = await tx.order.findFirst({
      where: { branchId: reservation.branchId },
      orderBy: { orderNumber: "desc" },
    });

    const order = await tx.order.create({
      data: {
        branchId: reservation.branchId,
        tableId: reservation.tableId!,
        employeeId: employeeId ?? null,
        orderNumber: (lastOrder?.orderNumber ?? 0) + 1,
        status: "OPEN",
        notes: `Réservation ${reservation.guestName}`,
      },
    });

    return { reservation: updated, order };
  });
}

export async function completeReservationForTable(tableId: string) {
  const reservation = await prisma.reservation.findFirst({
    where: {
      tableId,
      status: ReservationStatus.SEATED,
    },
    orderBy: { updatedAt: "desc" },
  });

  if (!reservation) return null;

  return updateReservation(reservation.id, {
    status: ReservationStatus.COMPLETED,
  });
}
