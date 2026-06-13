import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { decimalToNumber, prisma, TableStatus, completeReservationForTable } from "@repo/database";
import { getEditableOrder, recalculateOrder } from "../../../../../lib/orders";

const paySchema = z.object({
  tipAmount: z.number().min(0).default(0),
});

export async function POST(
  request: Request,
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
    return NextResponse.json({ error: "Order already closed" }, { status: 409 });
  }

  const { order } = editable;

  const lineCount = await prisma.orderLine.count({ where: { orderId } });
  if (lineCount === 0) {
    return NextResponse.json({ error: "Empty order" }, { status: 400 });
  }

  let tipAmount = decimalToNumber(order.tipAmount);
  try {
    const text = await request.text();
    if (text.trim()) {
      tipAmount = paySchema.parse(JSON.parse(text)).tipAmount;
    }
  } catch {
    return NextResponse.json({ error: "Invalid tip amount" }, { status: 400 });
  }

  const updated = await recalculateOrder(orderId, tipAmount);
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const paidAt = new Date();
  const orderTotal = decimalToNumber(updated.total);
  const orderTip = decimalToNumber(updated.tipAmount);

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID", paidAt },
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

  if (order.tableId) {
    await completeReservationForTable(order.tableId);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ledger = await prisma.dailyLedger.findUnique({
    where: {
      branchId_date: { branchId: order.branchId, date: today },
    },
  });

  if (ledger) {
    await prisma.dailyLedger.update({
      where: { id: ledger.id },
      data: {
        totalSales: { increment: orderTotal },
        totalTips: { increment: orderTip },
      },
    });

    await prisma.ledgerEntry.create({
      data: {
        ledgerId: ledger.id,
        type: "SALE",
        amount: orderTotal,
        description: `Commande #${order.orderNumber}`,
        referenceId: order.id,
      },
    });

    if (orderTip > 0) {
      await prisma.ledgerEntry.create({
        data: {
          ledgerId: ledger.id,
          type: "TIP",
          amount: orderTip,
          description: `Pourboire commande #${order.orderNumber}`,
          referenceId: order.id,
        },
      });
    }
  }

  return NextResponse.json({ ok: true, paidAt, total: orderTotal, tipAmount: orderTip });
}
