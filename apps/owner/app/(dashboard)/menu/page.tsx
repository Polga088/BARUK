import {
  decimalToNumber,
  formatCurrency,
  getDefaultBranch,
  prisma,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { MenuItemForm } from "../../../components/menu-item-form";

export default async function OwnerMenuPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const categories = await prisma.menuCategory.findMany({
    where: { branchId: branch.id },
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion du menu</h1>
        <p className="text-zinc-500">Catégories et plats affichés sur le site public.</p>
      </div>

      <Panel>
        <PanelHeader title="Ajouter un plat" />
        <PanelContent>
          <MenuItemForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        </PanelContent>
      </Panel>

      {categories.map((category) => (
        <Panel key={category.id}>
          <PanelHeader
            title={category.name}
            description={category.description ?? undefined}
          />
          <PanelContent>
            <ul className="divide-y divide-zinc-100">
              {category.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-zinc-500">{item.description}</p>
                  </div>
                  <p className="font-semibold text-baruk-700">
                    {formatCurrency(decimalToNumber(item.price))}
                  </p>
                </li>
              ))}
            </ul>
          </PanelContent>
        </Panel>
      ))}
    </div>
  );
}
