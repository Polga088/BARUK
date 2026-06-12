"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import type { ReservationStatus } from "@repo/database";

export function ReservationActions({
  id,
  status,
}: {
  id: string;
  status: ReservationStatus;
}) {
  const router = useRouter();

  async function updateStatus(nextStatus: ReservationStatus) {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <Button size="sm" onClick={() => updateStatus("CONFIRMED")}>
          Confirmer
        </Button>
      )}
      {status !== "CANCELLED" && (
        <Button size="sm" variant="outline" onClick={() => updateStatus("CANCELLED")}>
          Annuler
        </Button>
      )}
    </div>
  );
}
