import { prisma } from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { BranchForm } from "../../../components/branch-form";

export default async function BranchesPage() {
  const [branches, organizations] = await Promise.all([
    prisma.branch.findMany({
      include: { organization: true },
      orderBy: { name: "asc" },
    }),
    prisma.organization.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Filiales</h1>
        <p className="text-zinc-500">Restaurants par organisation.</p>
      </div>

      <Panel>
        <PanelHeader title="Ajouter une filiale" />
        <PanelContent>
          <BranchForm
            organizations={organizations.map((o) => ({ id: o.id, name: o.name }))}
          />
        </PanelContent>
      </Panel>

      <Panel>
        <PanelHeader title="Liste des filiales" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Organisation</th>
                <th className="py-2 pr-4">Ville</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium">{branch.name}</td>
                  <td className="py-3 pr-4">{branch.organization.name}</td>
                  <td className="py-3 pr-4">{branch.city}</td>
                  <td className="py-3">
                    <Badge variant={branch.isActive ? "success" : "muted"}>
                      {branch.isActive ? "Active" : "Inactive"}
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
