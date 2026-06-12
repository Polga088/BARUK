import Link from "next/link";
import Image from "next/image";
import { Button } from "@repo/ui/button";
import { Container, Section } from "@repo/ui/layout";

const categories = [
  {
    outline: "STARTERS",
    solid: "& SALADS",
    image: "670867159_17870811888603638_2828346832722138098_n-e9646757-8d0b-42b2-b413-6463192970c0.png",
    href: "/menu",
  },
  {
    outline: "CHALLAH",
    solid: "& PITA'S",
    image: "671231492_17870811897603638_8397437272554025257_n-f6fe063b-4364-4c34-b522-4acb44b8e114.png",
    href: "/menu",
  },
  {
    outline: "PIZZA",
    solid: "PIDDE",
    image: "671239712_17870811906603638_7695263784569584374_n-e189add8-3b2a-4bb6-9844-85e5b493be44.png",
    href: "/menu",
  },
  {
    outline: "HUMMUS",
    solid: "BAR",
    image: "673118358_17870811918603638_9133142597155455368_n-cd834621-2b50-403f-956b-9a01f9547382.png",
    href: "/menu",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero — style menu editorial */}
      <section className="relative overflow-hidden border-b border-surface-200">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-menu-desc">Casablanca · Levant Kitchen</p>
            <h1 className="mt-4 font-display text-6xl leading-none md:text-8xl">
              <span className="text-header-outline">FAST FOOD</span>
              <br />
              <span className="text-header-solid">DU CŒUR</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-olive-700/80">
              Hummus onctueux, pita grillée, pidde croustillante et bowls parfumés.
              L&apos;authenticité levantine, servie avec amour.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="lg">Voir le menu</Button>
              </Link>
              <Link href="/reservation">
                <Button size="lg" variant="outline">
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <Image
              src="/brand/logo-monogram.png"
              alt="BARUK monogramme"
              width={400}
              height={400}
              className="max-h-[320px] w-auto object-contain md:max-h-[420px]"
              priority
            />
          </div>
        </div>
      </section>

      {/* Catégories — cartes menu Instagram */}
      <Section className="py-16 md:py-24">
        <Container>
          <div className="mb-12 text-center">
            <span className="font-brand text-4xl text-baruk-600">Baruk.</span>
            <h2 className="mt-2 font-display text-4xl tracking-wider text-olive-800 md:text-5xl">
              NOTRE CARTE
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {categories.map((cat) => (
              <Link
                key={cat.outline}
                href={cat.href}
                className="group overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-[var(--shadow-warm-sm)] transition hover:shadow-[var(--shadow-warm-md)]"
              >
                <div className="overflow-hidden bg-cream-100">
                  <Image
                    src={`/brand/${cat.image}`}
                    alt={`${cat.outline} ${cat.solid}`}
                    width={600}
                    height={600}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-3xl leading-none tracking-wider">
                    <span className="text-header-outline text-3xl">{cat.outline}</span>{" "}
                    <span className="text-header-solid">{cat.solid}</span>
                  </h3>
                  <p className="mt-3 text-menu-desc group-hover:text-baruk-600">
                    Découvrir →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Instagram */}
      <Section className="border-t border-surface-200 bg-cream-100 py-16">
        <Container>
          <div className="flex flex-col items-center text-center">
            <span className="font-brand text-5xl text-baruk-600">Baruk.</span>
            <p className="mt-2 text-menu-desc">Suivez-nous</p>
            <a
              href="https://www.instagram.com/baruk.ma/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              <Button size="lg" variant="secondary">
                @baruk.ma
              </Button>
            </a>
          </div>
        </Container>
      </Section>
    </div>
  );
}
