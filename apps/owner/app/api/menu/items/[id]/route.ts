import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { getDefaultBranch, prisma } from "@repo/database";

const schema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().nullable().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
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
    const existing = await prisma.menuItem.findFirst({
      where: { id, category: { branchId: branch.id } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.categoryId) {
      const category = await prisma.menuCategory.findFirst({
        where: { id: data.categoryId, branchId: branch.id },
      });
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
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

  const existing = await prisma.menuItem.findFirst({
    where: { id, category: { branchId: branch.id } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
