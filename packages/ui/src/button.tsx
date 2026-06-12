import { type ButtonHTMLAttributes, forwardRef } from "react";

const variants = {
  primary:
    "ui:bg-baruk-600 ui:text-white ui:hover:bg-baruk-700 ui:shadow-[var(--shadow-warm-sm)] ui:hover:shadow-[var(--shadow-warm-md)]",
  gold:
    "ui:border ui:border-gold-500 ui:text-gold-600 ui:hover:bg-gold-500/10 ui:bg-transparent",
  secondary:
    "ui:bg-warm-900 ui:text-cream-100 ui:hover:bg-baruk-900 ui:border ui:border-warm-800",
  outline:
    "ui:border ui:border-baruk-600 ui:text-baruk-700 ui:hover:bg-baruk-100 ui:bg-transparent",
  ghost:
    "ui:text-baruk-800 ui:hover:bg-baruk-100 ui:bg-transparent",
  danger: "ui:bg-red-600 ui:text-white ui:hover:bg-red-500",
} as const;

const sizes = {
  sm: "ui:px-3 ui:py-1.5 ui:text-sm",
  md: "ui:px-4 ui:py-2 ui:text-sm",
  lg: "ui:px-6 ui:py-3 ui:text-base",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`ui:inline-flex ui:items-center ui:justify-center ui:rounded-xl ui:font-medium ui:transition-all ui:duration-200 ui:disabled:opacity-50 ui:disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
