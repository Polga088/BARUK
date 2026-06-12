import { type LabelHTMLAttributes } from "react";

export function Label({
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`ui:block ui:text-sm ui:font-medium ui:text-surface-800 ui:dark:text-surface-100 ${className}`}
      {...props}
    />
  );
}
