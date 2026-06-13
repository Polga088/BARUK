import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { getDefaultBranch, prisma } from "@repo/database";

const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
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
    const existing = await prisma.menuCategory.findFirst({
      where: { id, branchId: branch.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const category = await prisma.menuCategory.update({
      where: { id },
      data,
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
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

  const existing = await prisma.menuCategory.findFirst({
    where: { id, branchId: branch.id },
    include: { _count: { select: { items: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.menuCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
