import { auth } from "@repo/auth";
import { AppShell } from "@repo/ui/app-shell";
import { redirect } from "next/navigation";

const nav = [
  { href: "/", label: "Vue globale" },
  { href: "/organizations", label: "Organisations" },
  { href: "/branches", label: "Filiales" },
  { href: "/users", label: "Utilisateurs" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell
      title="Administration"
      nav={nav}
      user={{ name: session.user.name, role: session.user.role }}
    >
      {children}
    </AppShell>
  );
}
