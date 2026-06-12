import { NextResponse } from "next/server";
import { decimalToNumber, prisma, TableStatus } from "@repo/database";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { table: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const paidAt = new Date();

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ledger = await prisma.dailyLedger.findUnique({
    where: {
      branchId_date: { branchId: order.branchId, date: today },
    },
  });

  const orderTotal = decimalToNumber(order.total);

  if (ledger) {
    await prisma.dailyLedger.update({
      where: { id: ledger.id },
      data: {
        totalSales: { increment: orderTotal },
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
  }

  return NextResponse.json({ ok: true, paidAt });
}
