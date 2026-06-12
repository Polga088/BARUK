"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { BarukLogo } from "./baruk-logo";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/reservation", label: "Réservation" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <BarukLogo variant="header" />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wider text-olive-800 transition hover:text-baruk-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/reservation" className="hidden sm:block">
            <Button size="sm">Commander</Button>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-olive-800 md:hidden"
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
        <nav className="border-t border-surface-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium uppercase tracking-wider text-olive-800"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/reservation" onClick={() => setOpen(false)}>
              <Button className="w-full">Commander</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
