import { getDefaultBranch } from "@repo/database";
import { GoogleMapEmbed } from "../../components/google-map-embed";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const branch = await getDefaultBranch();

  if (!branch) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p>Informations restaurant indisponibles.</p>
      </div>
    );
  }

  const openingHours = branch.openingHours as Record<string, string> | null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-baruk-900">Nous trouver</h1>
      <p className="mt-2 text-zinc-600">
        {branch.name} — {branch.city}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-baruk-100">
          <div>
            <h2 className="font-semibold text-baruk-800">Adresse</h2>
            <p className="mt-1 text-zinc-600">
              {branch.address}
              <br />
              {branch.postalCode} {branch.city}, {branch.country}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-baruk-800">Contact</h2>
            <p className="mt-1 text-zinc-600">
              {branch.phone && <>Tél. {branch.phone}<br /></>}
              {branch.email}
            </p>
          </div>

          {openingHours && (
            <div>
              <h2 className="font-semibold text-baruk-800">Horaires</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                {Object.entries(openingHours).map(([day, hours]) => (
                  <li key={day} className="flex justify-between capitalize">
                    <span>{day}</span>
                    <span>{hours}</span>
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
              className="inline-flex rounded-lg bg-baruk-600 px-4 py-2 text-sm font-medium text-white hover:bg-baruk-500"
            >
              Obtenir l&apos;itinéraire
            </a>
          )}
        </div>

        <GoogleMapEmbed
          latitude={branch.latitude ?? 33.5731}
          longitude={branch.longitude ?? -7.5898}
          label={branch.name}
        />
      </div>
    </div>
  );
}
