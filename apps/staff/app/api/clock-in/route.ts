import { NextResponse } from "next/server";
import { auth } from "@repo/auth";
import {
  getDefaultBranch,
  prisma,
  TimeEntryType,
} from "@repo/database";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const branch = await getDefaultBranch();
  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  let employee = null;

  if (body.nfcCardUid) {
    employee = await prisma.employee.findFirst({
      where: { branchId: branch.id, nfcCardUid: body.nfcCardUid, isActive: true },
    });
  } else if (body.pinCode) {
    employee = await prisma.employee.findFirst({
      where: { branchId: branch.id, pinCode: body.pinCode, isActive: true },
    });
  }

  if (!employee) {
    return NextResponse.json({ error: "Employé non reconnu" }, { status: 404 });
  }

  const lastEntry = await prisma.timeEntry.findFirst({
    where: { employeeId: employee.id },
    orderBy: { recordedAt: "desc" },
  });

  const nextType =
    !lastEntry || lastEntry.type === TimeEntryType.CLOCK_OUT
      ? TimeEntryType.CLOCK_IN
      : TimeEntryType.CLOCK_OUT;

  const activeShift = await prisma.shift.findFirst({
    where: {
      employeeId: employee.id,
      status: "ACTIVE",
    },
  });

  await prisma.timeEntry.create({
    data: {
      employeeId: employee.id,
      shiftId: activeShift?.id,
      type: nextType,
      nfcCardUid: body.nfcCardUid ?? null,
      source: body.nfcCardUid ? "nfc" : "pin",
    },
  });

  if (nextType === TimeEntryType.CLOCK_IN) {
    const now = new Date();
    const endAt = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    await prisma.shift.create({
      data: {
        branchId: branch.id,
        employeeId: employee.id,
        startAt: now,
        endAt,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: `Entrée enregistrée — ${employee.firstName} ${employee.lastName}`,
    });
  }

  if (activeShift) {
    await prisma.shift.update({
      where: { id: activeShift.id },
      data: { status: "COMPLETED", endAt: new Date() },
    });
  }

  return NextResponse.json({
    message: `Sortie enregistrée — ${employee.firstName} ${employee.lastName}`,
  });
}
