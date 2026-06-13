import { getDefaultBranch, prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { PageHeader } from "@repo/ui/layout";
import { EmployeeActions } from "../../../components/employee-actions";

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
      <PageHeader
        title="Équipe"
        description="Serveurs, codes PIN, cartes NFC et pointage."
      />

      <Panel>
        <PanelHeader title="Employés" />
        <PanelContent>
          {employees.length === 0 ? (
            <p className="text-sm text-baruk-700/60">
              Aucun employé. Créez un compte STAFF depuis l&apos;admin.
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-baruk-100 text-left text-baruk-700/70">
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2 pr-4">Compte</th>
                  <th className="py-2 pr-4">Poste</th>
                  <th className="py-2 pr-4">Pointage</th>
                  <th className="py-2 pr-4">Dernier pointage</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-baruk-50 align-top">
                    <td className="py-3 pr-4 font-medium text-baruk-900">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="py-3 pr-4 text-baruk-700/70">
                      {employee.user?.email ?? "—"}
                    </td>
                    <td className="py-3 pr-4">{employee.position}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {employee.pinCode && (
                          <Badge variant="default">PIN {employee.pinCode}</Badge>
                        )}
                        {employee.nfcCardUid && (
                          <Badge>{employee.nfcCardUid}</Badge>
                        )}
                        {!employee.pinCode && !employee.nfcCardUid && (
                          <span className="text-baruk-700/50">Non configuré</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {employee.timeEntries[0]
                        ? `${employee.timeEntries[0].type} · ${employee.timeEntries[0].recordedAt.toLocaleString("fr-FR")}`
                        : "—"}
                    </td>
                    <td className="py-3">
                      <EmployeeActions
                        employee={{
                          id: employee.id,
                          firstName: employee.firstName,
                          lastName: employee.lastName,
                          position: employee.position,
                          pinCode: employee.pinCode,
                          nfcCardUid: employee.nfcCardUid,
                          isActive: employee.isActive,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </PanelContent>
      </Panel>
    </div>
  );
}
