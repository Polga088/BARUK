import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@repo/database";

const schema = z.object({
  categoryId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const item = await prisma.menuItem.create({ data });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
