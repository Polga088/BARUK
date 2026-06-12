import { auth } from "@repo/auth";
import { AppShell } from "@repo/ui/app-shell";
import { getDefaultBranch } from "@repo/database";
import { redirect } from "next/navigation";

const nav = [
  { href: "/", label: "Tableau de bord" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Réservations" },
  { href: "/stock", label: "Stock" },
  { href: "/staff", label: "Équipe" },
  { href: "/shifts", label: "Planning" },
  { href: "/ledger", label: "Comptabilité" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const branch = await getDefaultBranch();

  return (
    <AppShell
      title={branch?.name ?? "Owner"}
      nav={nav}
      user={{ name: session.user.name, role: session.user.role }}
    >
      {children}
    </AppShell>
  );
}
