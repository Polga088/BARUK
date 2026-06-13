import {
  decimalToNumber,
  formatCurrency,
  getDefaultBranch,
  prisma,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { PageHeader } from "@repo/ui/layout";
import { MenuItemForm } from "../../../components/menu-item-form";
import { MenuCategoryForm } from "../../../components/menu-category-form";
import { MenuCategoryActions } from "../../../components/menu-category-actions";
import { MenuItemActions } from "../../../components/menu-item-actions";

export default async function OwnerMenuPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const categories = await prisma.menuCategory.findMany({
    where: { branchId: branch.id },
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion du menu"
        description="Catégories, plats, disponibilité — reflété sur le site public et le POS staff."
      />

      <Panel>
        <PanelHeader title="Nouvelle catégorie" />
        <PanelContent>
          <MenuCategoryForm />
        </PanelContent>
      </Panel>

      <Panel>
        <PanelHeader title="Ajouter un plat" />
        <PanelContent>
          {categoryOptions.length === 0 ? (
            <p className="text-sm text-baruk-700/60">
              Créez d&apos;abord une catégorie.
            </p>
          ) : (
            <MenuItemForm categories={categoryOptions} />
          )}
        </PanelContent>
      </Panel>

      {categories.map((category) => (
        <Panel key={category.id}>
          <PanelHeader
            title={category.name}
            description={category.description ?? undefined}
            action={
              <MenuCategoryActions
                category={{
                  id: category.id,
                  name: category.name,
                  description: category.description,
                  isActive: category.isActive,
                }}
              />
            }
          />
          <PanelContent>
            {category.items.length === 0 ? (
              <p className="text-sm text-baruk-700/60">Aucun plat dans cette catégorie.</p>
            ) : (
              <ul className="divide-y divide-baruk-50">
                {category.items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-baruk-900">{item.name}</p>
                        <p className="text-sm text-baruk-700/60">{item.description}</p>
                      </div>
                      <p className="font-semibold text-gold-600">
                        {formatCurrency(decimalToNumber(item.price))}
                      </p>
                    </div>
                    <MenuItemActions
                      item={{
                        id: item.id,
                        categoryId: item.categoryId,
                        name: item.name,
                        description: item.description,
                        price: decimalToNumber(item.price),
                        isAvailable: item.isAvailable,
                      }}
                      categories={categoryOptions}
                    />
                  </li>
                ))}
              </ul>
            )}
          </PanelContent>
        </Panel>
      ))}
    </div>
  );
}
