import type { OrderStatus } from "@repo/database";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  OPEN: "Ouverte",
  SENT: "En cuisine",
  PREPARING: "Préparation",
  READY: "Prête",
  SERVED: "Servie",
  PAID: "Payée",
  CANCELLED: "Annulée",
};

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  OPEN: ["SENT", "CANCELLED"],
  SENT: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["SERVED", "CANCELLED"],
  SERVED: ["CANCELLED"],
  PAID: [],
  CANCELLED: [],
};

export function canTransitionOrderStatus(
  from: OrderStatus,
  to: OrderStatus,
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function statusAfterLinesChange(
  current: OrderStatus,
  hasLines: boolean,
): OrderStatus {
  if (!hasLines) return "OPEN";
  if (current === "OPEN") return "SENT";
  if (current === "PREPARING" || current === "READY" || current === "SERVED") {
    return "SENT";
  }
  return current;
}

export const KITCHEN_STATUSES: OrderStatus[] = ["SENT", "PREPARING", "READY"];
