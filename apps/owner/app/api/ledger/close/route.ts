import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import {
  closeDailyLedger,
  getDefaultBranch,
  LedgerError,
} from "@repo/database";

const schema = z.object({
  closingCash: z.number().min(0),
  notes: z.string().optional(),
});

function errorResponse(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  if (error instanceof LedgerError) {
    const status = error.code === "ALREADY_CLOSED" ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const branch = await getDefaultBranch();
  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  try {
    const data = schema.parse(await request.json());
    const ledger = await closeDailyLedger(
      branch.id,
      data.closingCash,
      data.notes,
    );
    return NextResponse.json(ledger);
  } catch (error) {
    return errorResponse(error);
  }
}
