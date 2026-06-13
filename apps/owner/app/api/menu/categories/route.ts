import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@repo/auth";
import { getDefaultBranch, prisma } from "@repo/database";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

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
    const last = await prisma.menuCategory.findFirst({
      where: { branchId: branch.id },
      orderBy: { sortOrder: "desc" },
    });

    const category = await prisma.menuCategory.create({
      data: {
        branchId: branch.id,
        name: data.name,
        description: data.description,
        sortOrder: data.sortOrder ?? (last?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
