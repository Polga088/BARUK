"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function ShiftForm({
  employees,
}: {
  employees: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: formData.get("employeeId"),
        startAt: formData.get("startAt"),
        endAt: formData.get("endAt"),
      }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
      <div>
        <Label htmlFor="employeeId">Employé</Label>
        <select
          id="employeeId"
          name="employeeId"
          required
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        >
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="startAt">Début</Label>
        <Input id="startAt" name="startAt" type="datetime-local" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="endAt">Fin</Label>
        <Input id="endAt" name="endAt" type="datetime-local" required className="mt-1" />
      </div>
      <div className="md:col-span-3">
        <Button type="submit" disabled={loading}>
          Planifier
        </Button>
      </div>
    </form>
  );
}
