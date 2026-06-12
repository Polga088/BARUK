"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Container } from "@repo/ui/layout";

const schema = z.object({
  guestName: z.string().min(2, "Nom requis"),
  guestPhone: z.string().min(8, "Téléphone requis"),
  guestEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  partySize: z.number().min(1).max(20),
  date: z.string().min(1, "Date requise"),
  time: z.string().min(1, "Heure requise"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ReservationPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      partySize: 2,
      time: "20:00",
    },
  });

  async function onSubmit(data: FormData) {
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Erreur lors de la réservation");
      return;
    }

    setSuccess(result.confirmationCode);
    reset({ partySize: 2, time: "20:00" });
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
          Réservation
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-baruk-900">
          Réserver une table
        </h1>
        <p className="mt-3 text-baruk-800/70">
          Indiquez vos préférences, nous confirmons rapidement votre demande.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5 rounded-2xl border border-baruk-200/60 bg-cream-50 p-8 shadow-[var(--shadow-warm-sm)]"
        >
          <div>
            <Label htmlFor="guestName">Nom complet</Label>
            <Input id="guestName" {...register("guestName")} className="mt-1.5" />
            {errors.guestName && (
              <p className="mt-1 text-sm text-red-600">{errors.guestName.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="guestPhone">Téléphone</Label>
              <Input id="guestPhone" {...register("guestPhone")} className="mt-1.5" />
              {errors.guestPhone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.guestPhone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="guestEmail">Email (optionnel)</Label>
              <Input id="guestEmail" type="email" {...register("guestEmail")} className="mt-1.5" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} className="mt-1.5" />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="time">Heure</Label>
              <Input id="time" type="time" {...register("time")} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="partySize">Couverts</Label>
              <Input
                id="partySize"
                type="number"
                min={1}
                max={20}
                {...register("partySize", { valueAsNumber: true })}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Allergie, anniversaire..."
              {...register("notes")}
              className="mt-1.5"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
              Réservation enregistrée. Code : <strong>{success}</strong>
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Envoi..." : "Confirmer la demande"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
