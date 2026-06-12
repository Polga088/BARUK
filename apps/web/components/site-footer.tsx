import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-baruk-200/60 bg-baruk-950 text-baruk-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">BARUK</p>
          <p className="mt-2 text-sm text-baruk-200">
            Cuisine marocaine contemporaine au cœur de Casablanca.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Navigation</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/menu" className="hover:text-white">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/reservation" className="hover:text-white">
                Réservation
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact & accès
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Espaces pro</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a
                href={process.env.NEXT_PUBLIC_OWNER_URL ?? "http://localhost:3001"}
                className="hover:text-white"
              >
                Owner
              </a>
            </li>
            <li>
              <a
                href={process.env.NEXT_PUBLIC_STAFF_URL ?? "http://localhost:3003"}
                className="hover:text-white"
              >
                Staff
              </a>
            </li>
            <li>
              <a
                href={process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002"}
                className="hover:text-white"
              >
                Admin
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-baruk-900 px-4 py-4 text-center text-xs text-baruk-300">
        © {new Date().getFullYear()} BARUK. Tous droits réservés.
      </div>
    </footer>
  );
}
