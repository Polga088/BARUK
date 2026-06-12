import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@repo/database";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const org = await prisma.organization.create({ data });
    return NextResponse.json(org);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function GET() {
  const orgs = await prisma.organization.findMany({
    include: { branches: true },
  });
  return NextResponse.json(orgs);
}
