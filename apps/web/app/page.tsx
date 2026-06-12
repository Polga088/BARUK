import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,127,31,0.18),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-baruk-600">
            Restaurant · Casablanca
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-baruk-950 md:text-6xl">
            Une expérience culinaire immersive au cœur de BARUK
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-600">
            Menu interactif en 3D, réservation en ligne et service orchestré pour
            une soirée inoubliable.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/menu">
              <Button size="lg">Explorer le menu 3D</Button>
            </Link>
            <Link href="/reservation">
              <Button size="lg" variant="outline">
                Réserver une table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 md:grid-cols-3">
        {[
          {
            title: "Menu 3D",
            text: "Parcourez nos catégories en slider immersif avec fallback mobile optimisé.",
            href: "/menu",
          },
          {
            title: "Réservation",
            text: "Choisissez date, heure et nombre de couverts en quelques clics.",
            href: "/reservation",
          },
          {
            title: "Nous trouver",
            text: "Adresse, horaires, carte Google Maps et contacts du restaurant.",
            href: "/contact",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-baruk-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-baruk-400"
          >
            <h2 className="text-xl font-semibold text-baruk-800">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
