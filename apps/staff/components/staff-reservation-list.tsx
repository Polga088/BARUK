"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import type { ReservationStatus } from "@repo/database";

const statusVariant = {
  PENDING: "warning",
  CONFIRMED: "success",
  SEATED: "default",
  COMPLETED: "muted",
  CANCELLED: "danger",
  NO_SHOW: "danger",
} as const;

export interface StaffReservationView {
  id: string;
  guestName: string;
  guestPhone: string;
  partySize: number;
  time: string;
  status: ReservationStatus;
  statusLabel: string;
  tableName: string | null;
  tableId: string | null;
  openOrderId: string | null;
  notes: string | null;
}

export function StaffReservationList({
  reservations,
}: {
  reservations: StaffReservationView[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function seatReservation(id: string) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/reservations/${id}/seat`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        error?: string;
        order?: { id: string };
      };
      if (!response.ok) {
        alert(data.error ?? "Impossible d'installer le client.");
        return;
      }
      if (data.order?.id) {
        router.push(`/orders/${data.order.id}`);
        return;
      }
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        alert(data.error ?? "Erreur.");
        return;
      }
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  if (reservations.length === 0) {
    return (
      <p className="rounded-2xl border border-baruk-800 bg-warm-800 p-6 text-sm text-baruk-300">
        Aucune réservation à traiter pour aujourd&apos;hui.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reservations.map((reservation) => (
        <article
          key={reservation.id}
          className="rounded-2xl border border-baruk-800 bg-warm-800 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-semibold text-cream-100">
                  {reservation.time} · {reservation.guestName}
                </p>
                <Badge variant={statusVariant[reservation.status]}>
                  {reservation.statusLabel}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-baruk-300">
                {reservation.partySize} couverts · {reservation.guestPhone}
              </p>
              {reservation.tableName && (
                <p className="mt-1 text-sm text-gold-400">
                  Table assignée : {reservation.tableName}
                </p>
              )}
              {reservation.notes && (
                <p className="mt-2 text-xs text-baruk-400">{reservation.notes}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {reservation.status === "PENDING" && (
                <p className="mt-2 text-xs text-baruk-400">
                  En attente de confirmation par le propriétaire.
                </p>
              )}
              {reservation.status === "CONFIRMED" && (
                <>
                  <Button
                    size="sm"
                    disabled={loadingId === reservation.id}
                    onClick={() => seatReservation(reservation.id)}
                  >
                    Installer client
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loadingId === reservation.id}
                    onClick={() => updateStatus(reservation.id, "NO_SHOW")}
                  >
                    Absent
                  </Button>
                </>
              )}
              {reservation.status === "SEATED" && reservation.openOrderId && (
                <Link href={`/orders/${reservation.openOrderId}`}>
                  <Button size="sm" variant="outline">
                    Ouvrir commande
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
