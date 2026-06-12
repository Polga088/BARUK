import { NextResponse } from "next/server";
import { auth } from "@repo/auth";
import { prisma, TableStatus } from "@repo/database";
import { getEditableOrder } from "../../../../../lib/orders";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: orderId } = await params;
  const editable = await getEditableOrder(orderId);

  if (!editable) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!editable.editable) {
    return NextResponse.json({ error: "Order is not editable" }, { status: 409 });
  }

  const { order } = editable;

  await prisma.$transaction([
    prisma.orderLine.deleteMany({ where: { orderId } }),
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        subtotal: 0,
        taxAmount: 0,
        tipAmount: 0,
        total: 0,
      },
    }),
    ...(order.tableId
      ? [
          prisma.restaurantTable.update({
            where: { id: order.tableId },
            data: { status: TableStatus.FREE },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ ok: true });
}
