import Link from "next/link";
import { type ReactNode } from "react";

export function AppShell({
  title,
  nav,
  children,
  user,
  activePath,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: ReactNode;
  user?: { name: string; role: string };
  activePath?: string;
}) {
  return (
    <div className="ui:min-h-screen ui:bg-cream-100">
      <header className="ui:border-b ui:border-baruk-200/60 ui:bg-cream-50/90 ui:backdrop-blur-md">
        <div className="ui:mx-auto ui:flex ui:max-w-7xl ui:items-center ui:justify-between ui:px-4 ui:py-4">
          <div className="ui:flex ui:items-center ui:gap-8">
            <Link
              href="/"
              className="ui:font-display ui:text-xl ui:font-bold ui:text-baruk-800"
            >
              BARUK
            </Link>
            <span className="ui:text-sm ui:text-baruk-700/60">{title}</span>
          </div>
          {user && (
            <div className="ui:text-sm ui:text-baruk-800">
              {user.name}{" "}
              <span className="ui:rounded-full ui:bg-gold-500/15 ui:px-2.5 ui:py-0.5 ui:text-xs ui:font-medium ui:text-gold-600">
                {user.role}
              </span>
            </div>
          )}
        </div>
      </header>
      <div className="ui:mx-auto ui:flex ui:max-w-7xl ui:gap-6 ui:px-4 ui:py-6">
        <aside className="ui:w-56 ui:shrink-0">
          <nav className="ui:space-y-1">
            {nav.map((item) => {
              const isActive =
                activePath === item.href ||
                (item.href !== "/" && activePath?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ui:block ui:rounded-xl ui:px-3 ui:py-2.5 ui:text-sm ui:font-medium ui:transition-colors ${
                    isActive
                      ? "ui:bg-baruk-600 ui:text-white ui:shadow-[var(--shadow-warm-sm)]"
                      : "ui:text-baruk-800 ui:hover:bg-baruk-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="ui:min-w-0 ui:flex-1">{children}</main>
      </div>
    </div>
  );
}

export function StaffShell({
  nav,
  children,
  userName,
  activePath,
}: {
  nav: { href: string; label: string }[];
  children: ReactNode;
  userName: string;
  activePath?: string;
}) {
  return (
    <div className="ui:min-h-screen ui:bg-warm-900">
      <header className="ui:border-b ui:border-baruk-800/60 ui:bg-warm-800/90 ui:backdrop-blur-md">
        <div className="ui:mx-auto ui:flex ui:max-w-6xl ui:items-center ui:justify-between ui:px-4 ui:py-3">
          <div className="ui:flex ui:items-center ui:gap-6">
            <span className="ui:font-display ui:text-lg ui:font-bold ui:text-gold-400">
              BARUK Staff
            </span>
            <nav className="ui:flex ui:gap-1">
              {nav.map((item) => {
                const isActive =
                  activePath === item.href ||
                  (item.href !== "/" && activePath?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`ui:rounded-lg ui:px-3 ui:py-1.5 ui:text-sm ui:font-medium ui:transition-colors ${
                      isActive
                        ? "ui:bg-baruk-600 ui:text-white"
                        : "ui:text-cream-200 ui:hover:bg-warm-700 ui:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <p className="ui:text-sm ui:text-baruk-300">{userName}</p>
        </div>
      </header>
      <main className="ui:mx-auto ui:max-w-6xl ui:px-4 ui:py-6">{children}</main>
    </div>
  );
}
