import { auth } from "@repo/auth";
import { StaffShell } from "@repo/ui/app-shell";
import { redirect } from "next/navigation";

const nav = [
  { href: "/", label: "Plan de salle" },
  { href: "/clock-in", label: "Pointage NFC" },
];

export default async function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <StaffShell nav={nav} userName={session.user.name ?? "Staff"}>
      {children}
    </StaffShell>
  );
}
