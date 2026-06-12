import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-baruk-800/30 bg-warm-900 text-cream-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="mb-3 h-0.5 w-10 rounded-full bg-gold-500" />
          <p className="font-display text-2xl font-bold text-cream-100">BARUK</p>
          <p className="mt-3 text-sm leading-relaxed text-baruk-300">
            Cuisine marocaine contemporaine au cœur de Casablanca.
          </p>
          <a
            href="https://www.instagram.com/baruk.ma/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-medium text-gold-400 hover:text-gold-300"
          >
            @baruk.ma
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Navigation
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/reservation", label: "Réservation" },
              { href: "/contact", label: "Contact & accès" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-cream-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Espaces pro
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={process.env.NEXT_PUBLIC_OWNER_URL ?? "http://localhost:3001"}
                className="hover:text-cream-100"
              >
                Owner
              </a>
            </li>
            <li>
              <a
                href={process.env.NEXT_PUBLIC_STAFF_URL ?? "http://localhost:3003"}
                className="hover:text-cream-100"
              >
                Staff
              </a>
            </li>
            <li>
              <a
                href={process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002"}
                className="hover:text-cream-100"
              >
                Admin
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-baruk-800/40 px-4 py-5 text-center text-xs text-baruk-400">
        © {new Date().getFullYear()} BARUK. Tous droits réservés.
      </div>
    </footer>
  );
}
