import { type HTMLAttributes, type ReactNode } from "react";

export function Panel({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`ui:rounded-2xl ui:border ui:border-baruk-200/60 ui:bg-cream-50 ui:shadow-[var(--shadow-warm-sm)] ${className}`}
      {...props}
    />
  );
}

export function PanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ui:flex ui:items-start ui:justify-between ui:border-b ui:border-baruk-200/50 ui:px-6 ui:py-4">
      <div>
        <div className="ui:mb-1 ui:h-0.5 ui:w-8 ui:rounded-full ui:bg-gold-500" />
        <h2 className="ui:font-display ui:text-lg ui:font-semibold ui:text-baruk-900">
          {title}
        </h2>
        {description && (
          <p className="ui:mt-1 ui:text-sm ui:text-baruk-700/70">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PanelContent({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ui:p-6 ${className}`} {...props} />;
}
