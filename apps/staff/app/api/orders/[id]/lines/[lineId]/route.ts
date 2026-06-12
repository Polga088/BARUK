import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { decimalToNumber, prisma } from "@repo/database";
import { getEditableOrder, recalculateOrder } from "../../../../../../lib/orders";

const patchSchema = z.object({
  quantity: z.number().int().min(0),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; lineId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: orderId, lineId } = await params;
  const editable = await getEditableOrder(orderId);

  if (!editable) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!editable.editable) {
    return NextResponse.json({ error: "Order is not editable" }, { status: 409 });
  }

  try {
    const { quantity } = patchSchema.parse(await request.json());
    const line = await prisma.orderLine.findFirst({
      where: { id: lineId, orderId },
    });

    if (!line) {
      return NextResponse.json({ error: "Line not found" }, { status: 404 });
    }

    if (quantity === 0) {
      await prisma.orderLine.delete({ where: { id: lineId } });
    } else {
      const unitPrice = decimalToNumber(line.unitPrice);
      await prisma.orderLine.update({
        where: { id: lineId },
        data: {
          quantity,
          total: unitPrice * quantity,
        },
      });
    }

    const order = await recalculateOrder(orderId);
    const lines = await prisma.orderLine.findMany({ where: { orderId } });

    return NextResponse.json({
      ok: true,
      lines: lines.map((l) => ({
        id: l.id,
        name: l.name,
        quantity: l.quantity,
        unitPrice: decimalToNumber(l.unitPrice),
        total: decimalToNumber(l.total),
      })),
      subtotal: decimalToNumber(order!.subtotal),
      taxAmount: decimalToNumber(order!.taxAmount),
      tipAmount: decimalToNumber(order!.tipAmount),
      total: decimalToNumber(order!.total),
      status: order!.status,
    });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; lineId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: orderId, lineId } = await params;
  const editable = await getEditableOrder(orderId);

  if (!editable) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!editable.editable) {
    return NextResponse.json({ error: "Order is not editable" }, { status: 409 });
  }

  const line = await prisma.orderLine.findFirst({
    where: { id: lineId, orderId },
  });

  if (!line) {
    return NextResponse.json({ error: "Line not found" }, { status: 404 });
  }

  await prisma.orderLine.delete({ where: { id: lineId } });
  const order = await recalculateOrder(orderId);
  const lines = await prisma.orderLine.findMany({ where: { orderId } });

  return NextResponse.json({
    ok: true,
    lines: lines.map((l) => ({
      id: l.id,
      name: l.name,
      quantity: l.quantity,
      unitPrice: decimalToNumber(l.unitPrice),
      total: decimalToNumber(l.total),
    })),
    subtotal: decimalToNumber(order!.subtotal),
    taxAmount: decimalToNumber(order!.taxAmount),
    tipAmount: decimalToNumber(order!.tipAmount),
    total: decimalToNumber(order!.total),
    status: order!.status,
  });
}
