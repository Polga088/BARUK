import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import {
  addLedgerExpense,
  getDefaultBranch,
  LedgerError,
} from "@repo/database";

const schema = z.object({
  amount: z.number().positive(),
  description: z.string().min(2),
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
    const entry = await addLedgerExpense(
      branch.id,
      data.amount,
      data.description,
    );
    return NextResponse.json(entry);
  } catch (error) {
    return errorResponse(error);
  }
}
