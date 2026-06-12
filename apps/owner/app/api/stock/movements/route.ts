import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, StockMovementType } from "@repo/database";

const schema = z.object({
  stockItemId: z.string(),
  type: z.nativeEnum(StockMovementType),
  quantity: z.number().positive(),
  reason: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());

    const item = await prisma.stockItem.findUnique({
      where: { id: data.stockItemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const delta =
      data.type === StockMovementType.IN || data.type === StockMovementType.ADJUSTMENT
        ? data.quantity
        : -data.quantity;

    const [movement] = await prisma.$transaction([
      prisma.stockMovement.create({ data }),
      prisma.stockItem.update({
        where: { id: data.stockItemId },
        data: { quantity: { increment: delta } },
      }),
    ]);

    return NextResponse.json(movement);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
