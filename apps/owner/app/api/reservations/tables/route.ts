import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import {
  getDefaultBranch,
  getAvailableTablesForReservation,
  ReservationError,
} from "@repo/database";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const branch = await getDefaultBranch();
  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const schema = z.object({
    date: z.string(),
    time: z.string(),
    partySize: z.coerce.number().min(1),
    reservationId: z.string().optional(),
  });

  try {
    const params = schema.parse({
      date: searchParams.get("date"),
      time: searchParams.get("time"),
      partySize: searchParams.get("partySize"),
      reservationId: searchParams.get("reservationId") ?? undefined,
    });

    const tables = await getAvailableTablesForReservation(
      branch.id,
      new Date(params.date),
      params.time,
      params.partySize,
      params.reservationId,
    );

    return NextResponse.json(
      tables.map((table) => ({
        id: table.id,
        number: table.number,
        name: table.name ?? `Table ${table.number}`,
        capacity: table.capacity,
        section: table.section,
      })),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }
    if (error instanceof ReservationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
