import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma, UserRole } from "@repo/database";

const schema = z.object({
  organizationId: z.string().nullable(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const passwordHash = await hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
