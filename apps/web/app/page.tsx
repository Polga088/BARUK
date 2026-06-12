import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Hero, FeatureCard } from "@repo/ui/marketing";
import { Container, Section } from "@repo/ui/layout";
import { MenuCard } from "@repo/ui/marketing";

const signatures = [
  {
    name: "Tajine poulet citron",
    description: "Olives confites, semoule",
    price: 120,
    imageUrl: "/menu/tajine-poulet-citron.svg",
  },
  {
    name: "Couscous royal",
    description: "7 légumes, viandes",
    price: 145,
    imageUrl: "/menu/couscous-royal.svg",
  },
  {
    name: "Pastilla au poulet",
    description: "Amandes, cannelle",
    price: 110,
    imageUrl: "/menu/pastilla-poulet.svg",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-hero-gradient bg-zellige">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/brand/hero.webp)" }}
        />
        <Hero
          eyebrow="Restaurant · Casablanca"
          title={
            <>
              L&apos;art culinaire
              <br />
              <span className="text-gradient-gold">marocain réinventé</span>
            </>
          }
          subtitle="Menu immersif, réservation en ligne et une expérience sensorielle inspirée des saveurs authentiques de BARUK."
        >
          <Link href="/menu">
            <Button size="lg">Explorer le menu</Button>
          </Link>
          <Link href="/reservation">
            <Button size="lg" variant="gold">
              Réserver une table
            </Button>
          </Link>
        </Hero>
        <div className="pointer-events-none absolute -right-20 top-20 hidden h-96 w-96 rounded-full bg-baruk-600/10 blur-3xl lg:block" />
      </section>

      <Section>
        <Container>
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
              L&apos;expérience BARUK
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-baruk-900 md:text-4xl">
              Chaque détail compte
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Menu immersif"
              description="Parcourez nos catégories en 3D ou en grille élégante, avec photos et descriptions détaillées."
              href="/menu"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
            <FeatureCard
              title="Réservation"
              description="Choisissez date, heure et nombre de couverts en quelques clics. Confirmation rapide."
              href="/reservation"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <FeatureCard
              title="Nous trouver"
              description="Adresse, horaires, carte interactive et contacts du restaurant à Casablanca."
              href="/contact"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
          </div>
        </Container>
      </Section>

      <Section className="bg-cream-50">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
                Nos signatures
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-baruk-900">
                Plats emblématiques
              </h2>
            </div>
            <Link href="/menu">
              <Button variant="outline">Voir tout le menu</Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((item) => (
              <MenuCard key={item.name} {...item} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="overflow-hidden rounded-3xl border border-baruk-200/50 bg-gradient-to-br from-baruk-700 to-warm-900 px-8 py-14 text-center md:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Suivez-nous
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold text-cream-100 md:text-4xl">
              L&apos;univers BARUK sur Instagram
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-baruk-200">
              Découvrez nos créations, l&apos;ambiance du restaurant et nos événements sur @baruk.ma
            </p>
            <a
              href="https://www.instagram.com/baruk.ma/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block"
            >
              <Button variant="gold" size="lg">
                @baruk.ma
              </Button>
            </a>
          </div>
        </Container>
      </Section>
    </div>
  );
}
