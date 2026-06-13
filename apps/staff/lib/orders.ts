import { decimalToNumber, prisma, type OrderStatus } from "@repo/database";
import { statusAfterLinesChange } from "./kitchen";

const TAX_RATE = 0.1;

export async function getEditableOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { table: true },
  });

  if (!order) return null;
  if (order.status === "PAID" || order.status === "CANCELLED") {
    return { order, editable: false as const };
  }

  return { order, editable: true as const };
}

export async function recalculateOrder(orderId: string, tipAmount?: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;

  const lines = await prisma.orderLine.findMany({ where: { orderId } });
  const subtotal = lines.reduce(
    (sum, line) => sum + decimalToNumber(line.total),
    0,
  );
  const taxAmount = subtotal * TAX_RATE;
  const tip =
    tipAmount !== undefined ? tipAmount : decimalToNumber(order.tipAmount);
  const total = subtotal + taxAmount + tip;

  const hasLines = lines.length > 0;
  const nextStatus = statusAfterLinesChange(
    order.status as OrderStatus,
    hasLines,
  );

  return prisma.order.update({
    where: { id: orderId },
    data: {
      subtotal,
      taxAmount,
      tipAmount: tip,
      total,
      status: nextStatus,
    },
  });
}

export { TAX_RATE };
