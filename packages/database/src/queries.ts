import { prisma } from "./index";

export async function getBranchBySlug(orgSlug: string, branchSlug: string) {
  return prisma.branch.findFirst({
    where: {
      slug: branchSlug,
      organization: { slug: orgSlug },
      isActive: true,
    },
    include: {
      organization: true,
    },
  });
}

export async function getDefaultBranch() {
  const orgSlug = process.env.NEXT_PUBLIC_ORG_SLUG ?? "baruk";
  const branchSlug =
    process.env.NEXT_PUBLIC_BRANCH_SLUG ?? "casablanca-centre";
  return getBranchBySlug(orgSlug, branchSlug);
}

export function formatCurrency(amount: number | string, currency = "MAD") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency,
  }).format(value);
}

export function decimalToNumber(value: { toNumber(): number } | number | null) {
  if (value === null) return 0;
  if (typeof value === "number") return value;
  return value.toNumber();
}
