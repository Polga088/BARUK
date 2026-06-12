import { NextResponse } from "next/server";
import { z } from "zod";
import { decimalToNumber, prisma } from "@repo/database";

const schema = z.object({
  menuItemId: z.string(),
  quantity: z.number().min(1).default(1),
});

async function recalculateOrder(orderId: string) {
  const lines = await prisma.orderLine.findMany({ where: { orderId } });
  const subtotal = lines.reduce(
    (sum, line) => sum + decimalToNumber(line.total),
    0,
  );
  const taxAmount = subtotal * 0.1;
  const total = subtotal + taxAmount;

  await prisma.order.update({
    where: { id: orderId },
    data: { subtotal, taxAmount, total, status: "SENT" },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  try {
    const data = schema.parse(await request.json());
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: data.menuItemId },
    });

    if (!menuItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const unitPrice = decimalToNumber(menuItem.price);
    const total = unitPrice * data.quantity;

    const existing = await prisma.orderLine.findFirst({
      where: { orderId, menuItemId: menuItem.id },
    });

    if (existing) {
      await prisma.orderLine.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + data.quantity,
          total: decimalToNumber(existing.total) + total,
        },
      });
    } else {
      await prisma.orderLine.create({
        data: {
          orderId,
          menuItemId: menuItem.id,
          name: menuItem.name,
          quantity: data.quantity,
          unitPrice: menuItem.price,
          total,
        },
      });
    }

    await recalculateOrder(orderId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
