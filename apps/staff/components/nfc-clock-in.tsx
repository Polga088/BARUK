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
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pointage shift</h1>
        <p className="text-zinc-400">
          Scan NFC ou code PIN pour pointer début/fin de service.
        </p>
      </div>

      <div className="rounded-xl border border-surface-700 bg-surface-900 p-6 space-y-4">
        <Button onClick={scanNfc} disabled={loading} className="w-full" size="lg">
          Scanner carte NFC
        </Button>

        <div className="border-t border-surface-700 pt-4">
          <p className="mb-2 text-sm text-zinc-400">Secours — code PIN</p>
          <div className="flex gap-2">
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="1234"
              className="flex-1"
            />
            <Button variant="secondary" onClick={clockWithPin} disabled={loading}>
              Valider
            </Button>
          </div>
        </div>

        {message && (
          <p className="rounded-lg bg-baruk-950 px-3 py-2 text-sm text-baruk-200">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
