"use client";

interface GoogleMapEmbedProps {
  latitude: number;
  longitude: number;
  label: string;
}

export function GoogleMapEmbed({
  latitude,
  longitude,
  label,
}: GoogleMapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const query = encodeURIComponent(`${latitude},${longitude}`);

  if (apiKey) {
    return (
      <iframe
        title={`Carte ${label}`}
        className="h-[420px] w-full rounded-2xl border border-baruk-200"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=15`}
      />
    );
  }

  return (
    <div className="flex h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-baruk-300 bg-baruk-50 p-6 text-center">
      <p className="font-medium text-baruk-800">Carte Google Maps</p>
      <p className="mt-2 text-sm text-zinc-600">
        Ajoutez <code className="rounded bg-white px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
        pour afficher la carte interactive.
      </p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-sm font-medium text-baruk-700 underline"
      >
        Ouvrir dans Google Maps
      </a>
    </div>
  );
}
