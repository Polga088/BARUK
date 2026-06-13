import { LedgerEntryType, prisma } from "./index";
import { decimalToNumber } from "./queries";

export class LedgerError extends Error {
  constructor(
    public code:
      | "NOT_FOUND"
      | "ALREADY_CLOSED"
      | "INVALID_AMOUNT"
      | "BRANCH_NOT_FOUND",
    message: string,
  ) {
    super(message);
    this.name = "LedgerError";
  }
}

export function startOfDay(date = new Date()) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export async function ensureTodayLedger(branchId: string) {
  const today = startOfDay();

  return prisma.dailyLedger.upsert({
    where: {
      branchId_date: { branchId, date: today },
    },
    update: {},
    create: {
      branchId,
      date: today,
      openingCash: 0,
    },
    include: { entries: { orderBy: { createdAt: "desc" } } },
  });
}

export async function addLedgerExpense(
  branchId: string,
  amount: number,
  description: string,
) {
  if (amount <= 0) {
    throw new LedgerError("INVALID_AMOUNT", "Montant invalide.");
  }

  const ledger = await ensureTodayLedger(branchId);

  if (ledger.closedAt) {
    throw new LedgerError(
      "ALREADY_CLOSED",
      "La caisse du jour est déjà clôturée.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const entry = await tx.ledgerEntry.create({
      data: {
        ledgerId: ledger.id,
        type: LedgerEntryType.EXPENSE,
        amount,
        description,
      },
    });

    await tx.dailyLedger.update({
      where: { id: ledger.id },
      data: { totalExpenses: { increment: amount } },
    });

    return entry;
  });
}

export async function closeDailyLedger(
  branchId: string,
  closingCash: number,
  notes?: string,
) {
  if (closingCash < 0) {
    throw new LedgerError("INVALID_AMOUNT", "Fond de caisse invalide.");
  }

  const ledger = await ensureTodayLedger(branchId);

  if (ledger.closedAt) {
    throw new LedgerError(
      "ALREADY_CLOSED",
      "La caisse du jour est déjà clôturée.",
    );
  }

  const closedAt = new Date();
  const tomorrow = startOfDay();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.$transaction(async (tx) => {
    const closed = await tx.dailyLedger.update({
      where: { id: ledger.id },
      data: {
        closingCash,
        closedAt,
        notes: notes || null,
      },
      include: { entries: { orderBy: { createdAt: "desc" } } },
    });

    await tx.dailyLedger.upsert({
      where: {
        branchId_date: { branchId, date: tomorrow },
      },
      update: {},
      create: {
        branchId,
        date: tomorrow,
        openingCash: closingCash,
      },
    });

    return closed;
  });
}

export function ledgerExpectedCash(ledger: {
  openingCash: { toNumber(): number } | number;
  totalSales: { toNumber(): number } | number;
  totalTips: { toNumber(): number } | number;
  totalExpenses: { toNumber(): number } | number;
}) {
  return (
    decimalToNumber(ledger.openingCash) +
    decimalToNumber(ledger.totalSales) +
    decimalToNumber(ledger.totalTips) -
    decimalToNumber(ledger.totalExpenses)
  );
}
