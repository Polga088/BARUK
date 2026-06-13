import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { getDefaultBranch, prisma } from "@repo/database";

const schema = z.object({
  pinCode: z.string().nullable().optional(),
  nfcCardUid: z.string().nullable().optional(),
  position: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const branch = await getDefaultBranch();
  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  const { id } = await params;

  try {
    const data = schema.parse(await request.json());
    const existing = await prisma.employee.findFirst({
      where: { id, branchId: branch.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data,
    });

    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
