import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@repo/database";

const schema = z.object({
  organizationId: z.string(),
  name: z.string().min(2),
  slug: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const branch = await prisma.branch.create({ data });
    return NextResponse.json(branch);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
