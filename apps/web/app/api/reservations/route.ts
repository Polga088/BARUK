import { NextResponse } from "next/server";
import { z } from "zod";
import { getDefaultBranch, prisma, ReservationStatus } from "@repo/database";

const schema = z.object({
  guestName: z.string().min(2),
  guestPhone: z.string().min(8),
  guestEmail: z.string().email().optional().or(z.literal("")),
  partySize: z.number().min(1).max(20),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const branch = await getDefaultBranch();

    if (!branch) {
      return NextResponse.json(
        { error: "Restaurant introuvable" },
        { status: 404 },
      );
    }

    const reservationDate = new Date(data.date);
    const existingCovers = await prisma.reservation.aggregate({
      where: {
        branchId: branch.id,
        date: reservationDate,
        time: data.time,
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
      },
      _sum: { partySize: true },
    });

    const currentCovers = existingCovers._sum.partySize ?? 0;
    if (currentCovers + data.partySize > branch.maxCoversPerSlot) {
      return NextResponse.json(
        { error: "Créneau complet, choisissez une autre heure." },
        { status: 409 },
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        branchId: branch.id,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail || null,
        partySize: data.partySize,
        date: reservationDate,
        time: data.time,
        notes: data.notes,
        status: ReservationStatus.PENDING,
      },
    });

    return NextResponse.json({
      id: reservation.id,
      confirmationCode: reservation.confirmationCode,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  const branch = await getDefaultBranch();
  if (!branch) {
    return NextResponse.json([]);
  }

  const reservations = await prisma.reservation.findMany({
    where: { branchId: branch.id },
    orderBy: [{ date: "desc" }, { time: "desc" }],
    take: 50,
  });

  return NextResponse.json(reservations);
}
