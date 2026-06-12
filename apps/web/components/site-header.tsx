import Link from "next/link";
import { Button } from "@repo/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-baruk-200/60 bg-[#fdf8ef]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-baruk-700">
          BARUK
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 md:flex">
          <Link href="/menu" className="hover:text-baruk-600">
            Menu
          </Link>
          <Link href="/reservation" className="hover:text-baruk-600">
            Réservation
          </Link>
          <Link href="/contact" className="hover:text-baruk-600">
            Contact
          </Link>
        </nav>
        <Link href="/reservation">
          <Button size="sm">Réserver une table</Button>
        </Link>
      </div>
    </header>
  );
}
