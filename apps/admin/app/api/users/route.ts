import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { auth } from "@repo/auth";
import { prisma, UserRole } from "@repo/database";

const schema = z.object({
  organizationId: z.string().nullable(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole),
  branchId: z.string().optional(),
  position: z.string().optional(),
  pinCode: z.string().optional(),
  nfcCardUid: z.string().optional(),
});

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? fullName;
  const lastName = parts.slice(1).join(" ") || firstName;
  return { firstName, lastName };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());

    if (data.role === UserRole.STAFF) {
      if (!data.branchId) {
        return NextResponse.json(
          { error: "Une filiale est requise pour un compte staff." },
          { status: 400 },
        );
      }

      const branch = await prisma.branch.findFirst({
        where: {
          id: data.branchId,
          ...(data.organizationId
            ? { organizationId: data.organizationId }
            : {}),
        },
      });

      if (!branch) {
        return NextResponse.json(
          { error: "Filiale introuvable pour cette organisation." },
          { status: 400 },
        );
      }
    }

    const passwordHash = await hash(data.password, 12);
    const { firstName, lastName } = splitName(data.name);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          organizationId: data.organizationId,
          name: data.name,
          email: data.email,
          passwordHash,
          role: data.role,
        },
      });

      let employee = null;

      if (data.role === UserRole.STAFF && data.branchId) {
        employee = await tx.employee.create({
          data: {
            branchId: data.branchId,
            userId: user.id,
            firstName,
            lastName,
            email: data.email,
            position: data.position ?? "serveur",
            pinCode: data.pinCode || null,
            nfcCardUid: data.nfcCardUid || null,
          },
        });
      }

      return { user, employee };
    });

    return NextResponse.json({
      id: result.user.id,
      email: result.user.email,
      employeeId: result.employee?.id ?? null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ error: "Création impossible" }, { status: 400 });
  }
}
