import {
  decimalToNumber,
  getDefaultBranch,
  prisma,
} from "@repo/database";
import { Menu3DViewer } from "../../components/menu-3d-viewer";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const branch = await getDefaultBranch();

  const categories = branch
    ? await prisma.menuCategory.findMany({
        where: { branchId: branch.id, isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            where: { isAvailable: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      })
    : [];

  const view = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: decimalToNumber(item.price),
    })),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Menu3DViewer categories={view} />
    </div>
  );
}
