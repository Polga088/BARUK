import { NextResponse } from "next/server";
import { z } from "zod";
import { getDefaultBranch, prisma } from "@repo/database";

const schema = z.object({
  employeeId: z.string(),
  startAt: z.string(),
  endAt: z.string(),
});

export async function POST(request: Request) {
  const branch = await getDefaultBranch();
  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  try {
    const data = schema.parse(await request.json());
    const shift = await prisma.shift.create({
      data: {
        branchId: branch.id,
        employeeId: data.employeeId,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
      },
    });
    return NextResponse.json(shift);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
