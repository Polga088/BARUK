import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import {
  ReservationStatus,
  ReservationError,
  updateReservation,
} from "@repo/database";

const schema = z.object({
  status: z.nativeEnum(ReservationStatus),
});

function errorResponse(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  if (error instanceof ReservationError) {
    const status =
      error.code === "NOT_FOUND"
        ? 404
        : error.code === "INVALID_TRANSITION" ||
            error.code === "TABLE_REQUIRED"
          ? 409
          : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { status } = schema.parse(await request.json());
    const reservation = await updateReservation(id, { status });
    return NextResponse.json(reservation);
  } catch (error) {
    return errorResponse(error);
  }
}
