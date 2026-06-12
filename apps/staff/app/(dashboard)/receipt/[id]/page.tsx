import { notFound } from "next/navigation";
import { decimalToNumber, prisma } from "@repo/database";
import { ReceiptView } from "../../../../components/receipt-view";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      branch: true,
      table: true,
      lines: true,
    },
  });

  if (!order) return notFound();

  return (
    <ReceiptView
      branchName={order.branch.name}
      orderNumber={order.orderNumber}
      tableName={order.table?.name ?? `Table ${order.table?.number}`}
      paidAt={order.paidAt?.toLocaleString("fr-FR") ?? ""}
      lines={order.lines.map((line) => ({
        name: line.name,
        quantity: line.quantity,
        total: decimalToNumber(line.total),
      }))}
      subtotal={decimalToNumber(order.subtotal)}
      taxAmount={decimalToNumber(order.taxAmount)}
      total={decimalToNumber(order.total)}
    />
  );
}
