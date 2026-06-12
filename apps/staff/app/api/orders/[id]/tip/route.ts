import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { decimalToNumber } from "@repo/database";
import { getEditableOrder, recalculateOrder } from "../../../../../lib/orders";

const tipSchema = z.object({
  tipAmount: z.number().min(0),
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
  if (!editable.editable) {
    return NextResponse.json({ error: "Order is not editable" }, { status: 409 });
  }

  try {
    const { tipAmount } = tipSchema.parse(await request.json());
    const order = await recalculateOrder(orderId, tipAmount);

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
