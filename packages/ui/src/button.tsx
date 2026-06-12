import { type ButtonHTMLAttributes, forwardRef } from "react";

const variants = {
  primary:
    "ui:bg-baruk-600 ui:text-white ui:hover:bg-baruk-500 ui:shadow-sm",
  secondary:
    "ui:bg-surface-800 ui:text-white ui:hover:bg-surface-700 ui:border ui:border-surface-700",
  outline:
    "ui:border ui:border-baruk-600 ui:text-baruk-600 ui:hover:bg-baruk-50 ui:dark:text-baruk-400 ui:dark:hover:bg-baruk-950",
  ghost: "ui:text-baruk-700 ui:hover:bg-baruk-50 ui:dark:text-baruk-300",
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
        className={`ui:inline-flex ui:items-center ui:justify-center ui:rounded-lg ui:font-medium ui:transition-colors ui:disabled:opacity-50 ui:disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
