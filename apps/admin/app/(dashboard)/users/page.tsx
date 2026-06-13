import { prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { UserForm } from "../../../components/user-form";

export default async function UsersPage() {
  const [users, organizations, branches] = await Promise.all([
    prisma.user.findMany({
      include: {
        organization: true,
        employee: { include: { branch: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.organization.findMany({ orderBy: { name: "asc" } }),
    prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <p className="text-zinc-500">
          Comptes admin, owner et staff avec fiche employé automatique.
        </p>
      </div>

      <Panel>
        <PanelHeader title="Créer un utilisateur" />
        <PanelContent>
          <UserForm
            organizations={organizations.map((org) => ({
              id: org.id,
              name: org.name,
            }))}
            branches={branches.map((branch) => ({
              id: branch.id,
              name: branch.name,
              organizationId: branch.organizationId,
            }))}
          />
        </PanelContent>
      </Panel>

      <Panel>
        <PanelHeader title="Liste" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Rôle</th>
                <th className="py-2 pr-4">Organisation</th>
                <th className="py-2">Employé</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium">{user.name}</td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4">
                    <Badge>{user.role}</Badge>
                  </td>
                  <td className="py-3 pr-4">{user.organization?.name ?? "—"}</td>
                  <td className="py-3">
                    {user.employee ? (
                      <span className="text-zinc-600">
                        {user.employee.branch.name}
                        {user.employee.pinCode
                          ? ` · PIN ${user.employee.pinCode}`
                          : ""}
                      </span>
                    ) : user.role === "STAFF" ? (
                      <Badge variant="warning">Sans fiche</Badge>
                    ) : (
                      "—"
                    )}
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
