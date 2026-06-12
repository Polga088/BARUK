import Link from "next/link";
import { type ReactNode } from "react";

export function AppShell({
  title,
  nav,
  children,
  user,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: ReactNode;
  user?: { name: string; role: string };
}) {
  return (
    <div className="ui:min-h-screen ui:bg-surface-50 ui:dark:bg-surface-950">
      <header className="ui:border-b ui:border-surface-100 ui:bg-white ui:dark:border-surface-800 ui:dark:bg-surface-900">
        <div className="ui:mx-auto ui:flex ui:max-w-7xl ui:items-center ui:justify-between ui:px-4 ui:py-4">
          <div className="ui:flex ui:items-center ui:gap-8">
            <Link href="/" className="ui:text-xl ui:font-bold ui:text-baruk-600">
              BARUK
            </Link>
            <span className="ui:text-sm ui:text-zinc-500">{title}</span>
          </div>
          {user && (
            <div className="ui:text-sm ui:text-zinc-600">
              {user.name}{" "}
              <span className="ui:rounded ui:bg-baruk-100 ui:px-2 ui:py-0.5 ui:text-xs ui:text-baruk-800">
                {user.role}
              </span>
            </div>
          )}
        </div>
      </header>
      <div className="ui:mx-auto ui:flex ui:max-w-7xl ui:gap-6 ui:px-4 ui:py-6">
        <aside className="ui:w-56 ui:shrink-0">
          <nav className="ui:space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="ui:block ui:rounded-lg ui:px-3 ui:py-2 ui:text-sm ui:font-medium ui:text-zinc-700 ui:hover:bg-baruk-50 ui:hover:text-baruk-700 ui:dark:text-zinc-300 ui:dark:hover:bg-baruk-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="ui:min-w-0 ui:flex-1">{children}</main>
      </div>
    </div>
  );
}
