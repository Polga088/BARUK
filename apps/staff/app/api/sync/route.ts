import { NextResponse } from "next/server";
import { auth } from "@repo/auth";
import {
  getDefaultBranch,
  prisma,
  ReservationStatus,
} from "@repo/database";
import { KITCHEN_STATUSES, ORDER_STATUS_LABELS } from "../../../lib/kitchen";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const branch = await getDefaultBranch();
  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [tables, kitchenOrders] = await Promise.all([
    prisma.restaurantTable.findMany({
      where: { branchId: branch.id, isActive: true },
      include: {
        orders: {
          where: { status: { notIn: ["PAID", "CANCELLED"] } },
          take: 1,
          select: { id: true, status: true, orderNumber: true },
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
          select: { guestName: true, time: true },
        },
      },
      orderBy: { number: "asc" },
    }),
    prisma.order.findMany({
      where: {
        branchId: branch.id,
        status: { in: KITCHEN_STATUSES },
      },
      include: {
        table: true,
        lines: { orderBy: { name: "asc" } },
      },
      orderBy: [{ status: "asc" }, { updatedAt: "asc" }],
    }),
  ]);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    tables: tables.map((table) => ({
      id: table.id,
      number: table.number,
      name: table.name ?? `Table ${table.number}`,
      capacity: table.capacity,
      status: table.status,
      section: table.section,
      hasOpenOrder: table.orders.length > 0,
      openOrderId: table.orders[0]?.id ?? null,
      openOrderStatus: table.orders[0]?.status ?? null,
      openOrderNumber: table.orders[0]?.orderNumber ?? null,
      reservationGuest: table.reservations[0]?.guestName ?? null,
      reservationTime: table.reservations[0]?.time ?? null,
    })),
    kitchen: kitchenOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: ORDER_STATUS_LABELS[order.status],
      tableName: order.table?.name ?? `Table ${order.table?.number ?? "—"}`,
      updatedAt: order.updatedAt.toISOString(),
      lines: order.lines.map((line) => ({
        name: line.name,
        quantity: line.quantity,
        notes: line.notes,
      })),
    })),
  });
}
