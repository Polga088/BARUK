import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "light" | "dark";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant = "light", ...props }, ref) => {
    const styles =
      variant === "dark"
        ? "ui:border-baruk-800 ui:bg-warm-900 ui:text-cream-100 ui:placeholder:text-baruk-400 ui:focus:border-gold-500 ui:focus:ring-gold-500/20"
        : "ui:border-baruk-200 ui:bg-cream-50 ui:text-baruk-900 ui:placeholder:text-baruk-400 ui:focus:border-gold-500 ui:focus:ring-gold-500/20";

    return (
      <input
        ref={ref}
        className={`ui:w-full ui:rounded-xl ui:border ui:px-3 ui:py-2 ui:text-sm ui:transition-colors ui:focus:outline-none ui:focus:ring-2 ${styles} ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
