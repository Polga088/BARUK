import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { prisma } from "@repo/database";
import { getEditableOrder } from "../../../../../lib/orders";
import { canTransitionOrderStatus } from "../../../../../lib/kitchen";

const schema = z.object({
  status: z.enum([
    "SENT",
    "PREPARING",
    "READY",
    "SERVED",
    "CANCELLED",
  ] as const),
});

export async function PATCH(
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

  const { order } = editable;

  try {
    const { status: nextStatus } = schema.parse(await request.json());

    if (!canTransitionOrderStatus(order.status, nextStatus)) {
      return NextResponse.json(
        { error: "Transition de statut invalide." },
        { status: 409 },
      );
    }

    if (nextStatus === "SENT") {
      const lineCount = await prisma.orderLine.count({ where: { orderId } });
      if (lineCount === 0) {
        return NextResponse.json(
          { error: "Commande vide." },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
    });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
