import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { decimalToNumber, prisma } from "@repo/database";
import { getEditableOrder, recalculateOrder } from "../../../../../lib/orders";

const schema = z.object({
  menuItemId: z.string(),
  quantity: z.number().min(1).default(1),
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
    return NextResponse.json({ error: "Order is not editable" }, { status: 409 });
  }

  try {
    const data = schema.parse(await request.json());
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: data.menuItemId },
    });

    if (!menuItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const unitPrice = decimalToNumber(menuItem.price);

    const existing = await prisma.orderLine.findFirst({
      where: { orderId, menuItemId: menuItem.id },
    });

    if (existing) {
      const newQty = existing.quantity + data.quantity;
      await prisma.orderLine.update({
        where: { id: existing.id },
        data: {
          quantity: newQty,
          total: unitPrice * newQty,
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
          total: unitPrice * data.quantity,
        },
      });
    }

    const order = await recalculateOrder(orderId);
    return NextResponse.json({
      ok: true,
      subtotal: decimalToNumber(order!.subtotal),
      taxAmount: decimalToNumber(order!.taxAmount),
      tipAmount: decimalToNumber(order!.tipAmount),
      total: decimalToNumber(order!.total),
    });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
