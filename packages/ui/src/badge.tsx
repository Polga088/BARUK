import { type HTMLAttributes } from "react";

const variants = {
  default: "ui:bg-baruk-100 ui:text-baruk-800",
  success: "ui:bg-green-100 ui:text-green-800",
  warning: "ui:bg-amber-100 ui:text-amber-800",
  danger: "ui:bg-red-100 ui:text-red-800",
  muted: "ui:bg-surface-100 ui:text-surface-800",
} as const;

export function Badge({
  variant = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={`ui:inline-flex ui:items-center ui:rounded-full ui:px-2.5 ui:py-0.5 ui:text-xs ui:font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
