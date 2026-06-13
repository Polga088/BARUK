import { NextResponse } from "next/server";
import { auth } from "@repo/auth";
import { prisma, ReservationError, seatReservation } from "@repo/database";

function errorResponse(error: unknown) {
  if (error instanceof ReservationError) {
    const status =
      error.code === "NOT_FOUND"
        ? 404
        : error.code === "INVALID_STATE" ||
            error.code === "TABLE_REQUIRED" ||
            error.code === "TABLE_CONFLICT" ||
            error.code === "TABLE_BUSY"
          ? 409
          : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id, isActive: true },
    });

    const result = await seatReservation(id, employee?.id);
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
