import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`ui:w-full ui:rounded-lg ui:border ui:border-surface-100 ui:bg-white ui:px-3 ui:py-2 ui:text-sm ui:text-surface-900 ui:placeholder:text-zinc-400 ui:focus:border-baruk-500 ui:focus:outline-none ui:focus:ring-2 ui:focus:ring-baruk-500/20 ui:dark:border-surface-800 ui:dark:bg-surface-900 ui:dark:text-white ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
