import { getDefaultBranch, prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";

export default async function OwnerStaffPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const employees = await prisma.employee.findMany({
    where: { branchId: branch.id },
    include: {
      user: true,
      timeEntries: { orderBy: { recordedAt: "desc" }, take: 1 },
    },
    orderBy: { lastName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Équipe</h1>
        <p className="text-zinc-500">Serveurs, cartes NFC et statuts.</p>
      </div>

      <Panel>
        <PanelHeader title="Employés" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Poste</th>
                <th className="py-2 pr-4">Carte NFC</th>
                <th className="py-2">Dernier pointage</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="py-3 pr-4">{employee.position}</td>
                  <td className="py-3 pr-4">
                    {employee.nfcCardUid ? (
                      <Badge>{employee.nfcCardUid}</Badge>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    {employee.timeEntries[0]
                      ? `${employee.timeEntries[0].type} — ${employee.timeEntries[0].recordedAt.toLocaleString("fr-FR")}`
                      : "—"}
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
