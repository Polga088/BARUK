import Link from "next/link";
import { auth } from "@repo/auth";
import { redirect } from "next/navigation";

const nav = [
  { href: "/", label: "Plan de salle" },
  { href: "/clock-in", label: "Pointage NFC" },
];

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-800 bg-surface-900 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-baruk-400">BARUK Staff</span>
            <nav className="flex gap-4 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-zinc-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="text-sm text-zinc-400">{session.user.name}</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
