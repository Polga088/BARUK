import Link from "next/link";
import Image from "next/image";
import { BarukLogo } from "./baruk-logo";

const menuRefs = [
  "670867159_17870811888603638_2828346832722138098_n-e9646757-8d0b-42b2-b413-6463192970c0.png",
  "671231492_17870811897603638_8397437272554025257_n-f6fe063b-4364-4c34-b522-4acb44b8e114.png",
  "671239712_17870811906603638_7695263784569584374_n-e189add8-3b2a-4bb6-9844-85e5b493be44.png",
  "673118358_17870811918603638_9133142597155455368_n-cd834621-2b50-403f-956b-9a01f9547382.png",
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-surface-200 bg-olive-950 text-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BarukLogo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-olive-200">
              Fast Food du Cœur — Casablanca. Hummus, pita, pidde & bowls.
            </p>
            <a
              href="https://www.instagram.com/baruk.ma/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-brand text-2xl text-baruk-400 hover:text-baruk-300"
            >
              @baruk.ma
            </a>
          </div>
          <div>
            <p className="font-display text-xl tracking-wider text-baruk-400">NAVIGATION</p>
            <ul className="mt-4 space-y-2 text-sm uppercase tracking-wider text-olive-200">
              {[
                { href: "/menu", label: "Menu" },
                { href: "/reservation", label: "Réservation" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-xl tracking-wider text-baruk-400">INSTAGRAM</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {menuRefs.map((file) => (
                <a
                  key={file}
                  href="https://www.instagram.com/baruk.ma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overflow-hidden rounded-lg ring-1 ring-olive-800 transition hover:ring-baruk-500"
                >
                  <Image
                    src={`/brand/${file}`}
                    alt="Menu BARUK"
                    width={200}
                    height={200}
                    className="aspect-square w-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-olive-900 px-4 py-5 text-center text-xs uppercase tracking-widest text-olive-400">
        © {new Date().getFullYear()} BARUK — Fast Food du Cœur
      </div>
    </footer>
  );
}
