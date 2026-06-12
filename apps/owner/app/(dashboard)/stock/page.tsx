import {
  decimalToNumber,
  getDefaultBranch,
  prisma,
} from "@repo/database";
import { Panel, PanelContent, PanelHeader } from "@repo/ui/panel";
import { Badge } from "@repo/ui/badge";
import { StockMovementForm } from "../../../components/stock-movement-form";

export default async function OwnerStockPage() {
  const branch = await getDefaultBranch();
  if (!branch) return <p>Aucune filiale.</p>;

  const items = await prisma.stockItem.findMany({
    where: { branchId: branch.id },
    include: {
      movements: { orderBy: { createdAt: "desc" }, take: 3 },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion du stock</h1>
        <p className="text-zinc-500">Quantités, seuils et mouvements.</p>
      </div>

      <Panel>
        <PanelHeader title="Enregistrer un mouvement" />
        <PanelContent>
          <StockMovementForm
            items={items.map((item) => ({ id: item.id, name: item.name }))}
          />
        </PanelContent>
      </Panel>

      <Panel>
        <PanelHeader title="Inventaire" />
        <PanelContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="py-2 pr-4">Article</th>
                <th className="py-2 pr-4">Quantité</th>
                <th className="py-2 pr-4">Seuil</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const qty = decimalToNumber(item.quantity);
                const threshold = decimalToNumber(item.minThreshold);
                const low = qty <= threshold;

                return (
                  <tr key={item.id} className="border-b border-zinc-100">
                    <td className="py-3 pr-4 font-medium">{item.name}</td>
                    <td className="py-3 pr-4">
                      {qty} {item.unit}
                    </td>
                    <td className="py-3 pr-4">
                      {threshold} {item.unit}
                    </td>
                    <td className="py-3">
                      <Badge variant={low ? "danger" : "success"}>
                        {low ? "Bas" : "OK"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </PanelContent>
      </Panel>
    </div>
  );
}
