import { redirect } from "next/navigation";
import { getDefaultBranch, prisma } from "@repo/database";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ tableId?: string }>;
}) {
  const { tableId } = await searchParams;
  const branch = await getDefaultBranch();
  if (!branch || !tableId) redirect("/");

  const table = await prisma.restaurantTable.findUnique({
    where: { id: tableId },
  });

  if (!table) redirect("/");

  const lastOrder = await prisma.order.findFirst({
    where: { branchId: branch.id },
    orderBy: { orderNumber: "desc" },
  });

  const order = await prisma.order.create({
    data: {
      branchId: branch.id,
      tableId: table.id,
      orderNumber: (lastOrder?.orderNumber ?? 0) + 1,
      status: "OPEN",
    },
  });

  await prisma.restaurantTable.update({
    where: { id: table.id },
    data: { status: "OCCUPIED" },
  });

  redirect(`/orders/${order.id}`);
}
