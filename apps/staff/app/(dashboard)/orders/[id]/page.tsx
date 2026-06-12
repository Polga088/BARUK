import { notFound } from "next/navigation";
import {
  decimalToNumber,
  getDefaultBranch,
  prisma,
} from "@repo/database";
import { OrderPanel } from "../../../../components/order-panel";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const branch = await getDefaultBranch();
  if (!branch) return notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      table: true,
      lines: true,
    },
  });

  if (!order || order.branchId !== branch.id) return notFound();

  const categories = await prisma.menuCategory.findMany({
    where: { branchId: branch.id, isActive: true },
    include: {
      items: { where: { isAvailable: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  const menuItems = categories.flatMap((category) =>
    category.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: decimalToNumber(item.price),
      categoryName: category.name,
    })),
  );

  return (
    <OrderPanel
      orderId={order.id}
      tableName={order.table?.name ?? `Table ${order.table?.number ?? "—"}`}
      menuItems={menuItems}
      initialLines={order.lines.map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        unitPrice: decimalToNumber(line.unitPrice),
        total: decimalToNumber(line.total),
      }))}
      subtotal={decimalToNumber(order.subtotal)}
      total={decimalToNumber(order.total)}
      status={order.status}
    />
  );
}
