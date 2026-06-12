import { getDefaultBranch, prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { ShiftForm } from "../../../components/shift-form";

export default async function OwnerShiftsPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const [employees, shifts] = await Promise.all([
    prisma.employee.findMany({
      where: { branchId: branch.id, isActive: true },
      orderBy: { lastName: "asc" },
    }),
    prisma.shift.findMany({
      where: {
        branchId: branch.id,
        startAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: { employee: true },
      orderBy: { startAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Planning des shifts</h1>
        <p className="text-zinc-500">Semaine en cours et planification.</p>
      </div>

      <Panel>
        <PanelHeader title="Planifier un shift" />
        <PanelContent>
          <ShiftForm
            employees={employees.map((e) => ({
              id: e.id,
              name: `${e.firstName} ${e.lastName}`,
            }))}
          />
        </PanelContent>
      </Panel>

      <Panel>
        <PanelHeader title="Shifts (7 derniers jours)" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="py-2 pr-4">Employé</th>
                <th className="py-2 pr-4">Début</th>
                <th className="py-2 pr-4">Fin</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id} className="border-b border-zinc-100">
                  <td className="py-3 pr-4">
                    {shift.employee.firstName} {shift.employee.lastName}
                  </td>
                  <td className="py-3 pr-4">
                    {shift.startAt.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3 pr-4">
                    {shift.endAt.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3">
                    <Badge variant={shift.status === "ACTIVE" ? "success" : "muted"}>
                      {shift.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelContent>
      </Panel>
    </div>
  );
}
