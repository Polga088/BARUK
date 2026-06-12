import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, ReservationStatus } from "@repo/database";

const schema = z.object({
  status: z.nativeEnum(ReservationStatus),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const { status } = schema.parse(await request.json());
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(reservation);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
