import { prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { UserForm } from "../../../components/user-form";

export default async function UsersPage() {
  const [users, organizations] = await Promise.all([
    prisma.user.findMany({
      include: { organization: true },
      orderBy: { name: "asc" },
    }),
    prisma.organization.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <p className="text-zinc-500">Comptes admin, owner et staff.</p>
      </div>

      <Panel>
        <PanelHeader title="Créer un utilisateur" />
        <PanelContent>
          <UserForm
            organizations={organizations.map((o) => ({ id: o.id, name: o.name }))}
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
                <th className="py-2">Organisation</th>
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
                  <td className="py-3">{user.organization?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelContent>
      </Panel>
    </div>
  );
}
