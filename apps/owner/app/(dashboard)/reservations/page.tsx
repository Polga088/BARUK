import { getDefaultBranch, prisma, ReservationStatus } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { ReservationActions } from "../../../components/reservation-actions";

const statusVariant = {
  PENDING: "warning",
  CONFIRMED: "success",
  SEATED: "default",
  COMPLETED: "muted",
  CANCELLED: "danger",
  NO_SHOW: "danger",
} as const;

export default async function OwnerReservationsPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const reservations = await prisma.reservation.findMany({
    where: { branchId: branch.id },
    orderBy: [{ date: "desc" }, { time: "desc" }],
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Réservations</h1>
        <p className="text-zinc-500">Demandes en ligne et confirmations.</p>
      </div>

      <Panel>
        <PanelHeader title="Liste des réservations" />
        <PanelContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-zinc-500">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Couverts</th>
                  <th className="py-2 pr-4">Statut</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-zinc-100">
                    <td className="py-3 pr-4">
                      {reservation.date.toLocaleDateString("fr-FR")} {reservation.time}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium">{reservation.guestName}</p>
                      <p className="text-zinc-500">{reservation.guestPhone}</p>
                    </td>
                    <td className="py-3 pr-4">{reservation.partySize}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant[reservation.status]}>
                        {reservation.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <ReservationActions
                        id={reservation.id}
                        status={reservation.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelContent>
      </Panel>
    </div>
  );
}
