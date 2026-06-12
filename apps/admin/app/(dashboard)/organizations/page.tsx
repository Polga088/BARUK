import { prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { OrganizationForm } from "../../../components/organization-form";

export default async function OrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    include: { _count: { select: { branches: true, users: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organisations</h1>
        <p className="text-zinc-500">Groupes et enseignes.</p>
      </div>

      <Panel>
        <PanelHeader title="Créer une organisation" />
        <PanelContent>
          <OrganizationForm />
        </PanelContent>
      </Panel>

      <Panel>
        <PanelHeader title="Liste" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Slug</th>
                <th className="py-2 pr-4">Filiales</th>
                <th className="py-2">Utilisateurs</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium">{org.name}</td>
                  <td className="py-3 pr-4">{org.slug}</td>
                  <td className="py-3 pr-4">{org._count.branches}</td>
                  <td className="py-3">{org._count.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelContent>
      </Panel>
    </div>
  );
}
