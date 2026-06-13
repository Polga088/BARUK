import {
  getDefaultBranch,
  prisma,
  RESERVATION_STATUS_LABELS,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { PageHeader } from "@repo/ui/layout";
import { ReservationActions } from "../../../components/reservation-actions";

const statusVariant = {
  PENDING: "warning",
  CONFIRMED: "success",
  SEATED: "default",
  COMPLETED: "muted",
  CANCELLED: "danger",
  NO_SHOW: "danger",
} as const;

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function OwnerReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const filterDate = dateParam ? new Date(dateParam) : new Date();
  filterDate.setHours(0, 0, 0, 0);

  const reservations = await prisma.reservation.findMany({
    where: {
      branchId: branch.id,
      date: filterDate,
    },
    include: { table: true },
    orderBy: [{ time: "asc" }, { createdAt: "asc" }],
  });

  const dateValue = toDateInputValue(filterDate);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réservations"
        description="Assignation de tables et suivi du workflow."
      />

      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="date"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-baruk-700/70"
          >
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={dateValue}
            className="rounded-xl border border-baruk-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-baruk-600 px-4 py-2 text-sm font-medium text-white"
        >
          Filtrer
        </button>
      </form>

      <Panel>
        <PanelHeader
          title={`${reservations.length} réservation(s) · ${filterDate.toLocaleDateString("fr-FR")}`}
        />
        <PanelContent>
          {reservations.length === 0 ? (
            <p className="text-sm text-baruk-700/60">
              Aucune réservation pour cette date.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-baruk-100 text-left text-baruk-700/70">
                    <th className="py-2 pr-4">Heure</th>
                    <th className="py-2 pr-4">Client</th>
                    <th className="py-2 pr-4">Couverts</th>
                    <th className="py-2 pr-4">Table</th>
                    <th className="py-2 pr-4">Statut</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-b border-baruk-50 align-top"
                    >
                      <td className="py-3 pr-4 font-medium">{reservation.time}</td>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-baruk-900">
                          {reservation.guestName}
                        </p>
                        <p className="text-baruk-700/60">{reservation.guestPhone}</p>
                        {reservation.notes && (
                          <p className="mt-1 text-xs text-baruk-700/50">
                            {reservation.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4">{reservation.partySize}</td>
                      <td className="py-3 pr-4">
                        {reservation.table
                          ? `${reservation.table.name ?? `Table ${reservation.table.number}`}`
                          : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={statusVariant[reservation.status]}>
                          {RESERVATION_STATUS_LABELS[reservation.status]}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <ReservationActions
                          id={reservation.id}
                          status={reservation.status}
                          tableId={reservation.tableId}
                          tableName={
                            reservation.table
                              ? (reservation.table.name ??
                                `Table ${reservation.table.number}`)
                              : null
                          }
                          partySize={reservation.partySize}
                          date={dateValue}
                          time={reservation.time}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelContent>
      </Panel>
    </div>
  );
}
