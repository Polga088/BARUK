"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@repo/ui/button";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/reservation", label: "Réservation" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-baruk-200/50 bg-cream-100/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="h-8 w-0.5 rounded-full bg-gold-500" />
          <span className="font-display text-2xl font-bold tracking-tight text-baruk-900">
            BARUK
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-baruk-800 transition hover:text-baruk-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/reservation" className="hidden sm:block">
            <Button size="sm">Réserver</Button>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-baruk-800 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-baruk-200/50 bg-cream-50 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-baruk-800"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/reservation" onClick={() => setOpen(false)}>
              <Button className="w-full">Réserver une table</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
