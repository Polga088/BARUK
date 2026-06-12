"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

export function NfcClockIn() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");

  async function clockWithPin() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/clock-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinCode: pin }),
    });

    const data = await response.json();
    setMessage(data.message ?? data.error);
    setLoading(false);
  }

  async function scanNfc() {
    if (!("NDEFReader" in window)) {
      setMessage(
        "Web NFC non disponible sur cet appareil. Utilisez une tablette Android Chrome ou le code PIN.",
      );
      return;
    }

    setLoading(true);
    setMessage("Approchez la carte NFC...");

    try {
      // @ts-expect-error Web NFC API
      const reader = new NDEFReader();
      await reader.scan();

      reader.addEventListener("reading", async (event: { serialNumber: string }) => {
        const response = await fetch("/api/clock-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nfcCardUid: event.serialNumber }),
        });

        const data = await response.json();
        setMessage(data.message ?? data.error);
        setLoading(false);
      });
    } catch {
      setMessage("Erreur NFC. Utilisez le code PIN de secours.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          Pointage
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-cream-100">
          Pointage shift
        </h1>
        <p className="mt-2 text-baruk-300">
          Scan NFC ou code PIN pour pointer début/fin de service.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-baruk-800 bg-warm-800 p-6">
        <Button onClick={scanNfc} disabled={loading} className="min-h-[52px] w-full" size="lg">
          Scanner carte NFC
        </Button>

        <div className="border-t border-baruk-800 pt-5">
          <p className="mb-3 text-sm text-baruk-400">Secours — code PIN</p>
          <div className="flex gap-3">
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="1234"
              variant="dark"
              className="min-h-[48px] flex-1 text-center text-lg tracking-[0.3em]"
            />
            <Button
              variant="gold"
              onClick={clockWithPin}
              disabled={loading}
              className="min-h-[48px] px-6"
            >
              Valider
            </Button>
          </div>
        </div>

        {message && (
          <p className="rounded-xl border border-baruk-700 bg-warm-900 px-4 py-3 text-sm text-baruk-200">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
