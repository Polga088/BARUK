import Link from "next/link";
import { type ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`ui:mx-auto ui:max-w-6xl ui:px-4 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`ui:py-16 md:ui:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ui:flex ui:flex-wrap ui:items-end ui:justify-between ui:gap-4">
      <div>
        <div className="ui:mb-2 ui:h-0.5 ui:w-10 ui:rounded-full ui:bg-gold-500" />
        <h1 className="ui:font-display ui:text-2xl ui:font-bold ui:text-baruk-900 md:ui:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="ui:mt-1 ui:text-baruk-700/70">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="ui:rounded-2xl ui:border ui:border-dashed ui:border-baruk-300 ui:bg-cream-50 ui:px-6 ui:py-12 ui:text-center">
      <p className="ui:font-display ui:text-lg ui:font-semibold ui:text-baruk-800">
        {title}
      </p>
      {description && (
        <p className="ui:mt-2 ui:text-sm ui:text-baruk-700/60">{description}</p>
      )}
    </div>
  );
}
