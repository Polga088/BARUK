import { getDefaultBranch } from "@repo/database";
import { GoogleMapEmbed } from "../../components/google-map-embed";
import { Container } from "@repo/ui/layout";
import { Button } from "@repo/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const branch = await getDefaultBranch();

  if (!branch) {
    return (
      <Container className="py-12">
        <p>Informations restaurant indisponibles.</p>
      </Container>
    );
  }

  const openingHours = branch.openingHours as Record<string, string> | null;

  return (
    <Container className="py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
        Contact
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-baruk-900">
        Nous trouver
      </h1>
      <p className="mt-3 text-baruk-800/70">
        {branch.name} — {branch.city}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-8 rounded-2xl border border-baruk-200/60 bg-cream-50 p-8 shadow-[var(--shadow-warm-sm)]">
          <div>
            <div className="mb-2 h-0.5 w-8 rounded-full bg-gold-500" />
            <h2 className="font-display text-lg font-semibold text-baruk-900">Adresse</h2>
            <p className="mt-2 leading-relaxed text-baruk-800/70">
              {branch.address}
              <br />
              {branch.postalCode} {branch.city}, {branch.country}
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-baruk-900">Contact</h2>
            <p className="mt-2 text-baruk-800/70">
              {branch.phone && <>Tél. {branch.phone}<br /></>}
              {branch.email}
            </p>
          </div>

          {openingHours && (
            <div>
              <h2 className="font-display text-lg font-semibold text-baruk-900">Horaires</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {Object.entries(openingHours).map(([day, hours]) => (
                  <li
                    key={day}
                    className="flex justify-between border-b border-baruk-100 py-2 capitalize text-baruk-800/70"
                  >
                    <span>{day}</span>
                    <span className="font-medium text-baruk-900">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {branch.latitude && branch.longitude && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Obtenir l&apos;itinéraire</Button>
            </a>
          )}

          <Link
            href="https://www.instagram.com/baruk.ma/"
            target="_blank"
            className="block text-sm font-medium text-gold-600 hover:text-gold-500"
          >
            @baruk.ma sur Instagram
          </Link>
        </div>

        <GoogleMapEmbed
          latitude={branch.latitude ?? 33.5731}
          longitude={branch.longitude ?? -7.5898}
          label={branch.name}
        />
      </div>
    </Container>
  );
}
