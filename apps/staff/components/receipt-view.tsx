"use client";

import { Button } from "@repo/ui/button";

interface ReceiptLine {
  name: string;
  quantity: number;
  total: number;
}

export function ReceiptView({
  branchName,
  orderNumber,
  tableName,
  paidAt,
  lines,
  subtotal,
  taxAmount,
  total,
}: {
  branchName: string;
  orderNumber: number;
  tableName: string;
  paidAt: string;
  lines: ReceiptLine[];
  subtotal: number;
  taxAmount: number;
  total: number;
}) {
  function printReceipt() {
    window.print();
  }

  return (
    <div className="mx-auto max-w-md">
      <div
        id="receipt"
        className="rounded-xl bg-white p-6 text-black print:shadow-none"
      >
        <div className="text-center">
          <p className="text-lg font-bold">{branchName}</p>
          <p className="text-sm text-zinc-600">Reçu #{orderNumber}</p>
          <p className="text-xs text-zinc-500">{tableName} · {paidAt}</p>
        </div>

        <ul className="mt-6 space-y-2 border-t border-dashed border-zinc-300 pt-4 text-sm">
          {lines.map((line, index) => (
            <li key={index} className="flex justify-between">
              <span>
                {line.quantity}x {line.name}
              </span>
              <span>{line.total.toFixed(2)} MAD</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-dashed border-zinc-300 pt-4 text-sm space-y-1">
          <p className="flex justify-between">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} MAD</span>
          </p>
          <p className="flex justify-between">
            <span>TVA (10%)</span>
            <span>{taxAmount.toFixed(2)} MAD</span>
          </p>
          <p className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{total.toFixed(2)} MAD</span>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Merci de votre visite — BARUK
        </p>
      </div>

      <div className="mt-4 flex gap-3 print:hidden">
        <Button onClick={printReceipt} className="flex-1">
          Imprimer (PDF / thermique)
        </Button>
      </div>
    </div>
  );
}
