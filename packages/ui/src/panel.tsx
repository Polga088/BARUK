import { type HTMLAttributes, type ReactNode } from "react";

export function Panel({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`ui:rounded-xl ui:border ui:border-surface-100 ui:bg-white ui:shadow-sm ui:dark:border-surface-800 ui:dark:bg-surface-900 ${className}`}
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
    <div className="ui:flex ui:items-start ui:justify-between ui:border-b ui:border-surface-100 ui:px-6 ui:py-4 ui:dark:border-surface-800">
      <div>
        <h2 className="ui:text-lg ui:font-semibold ui:text-surface-900 ui:dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="ui:mt-1 ui:text-sm ui:text-zinc-500">{description}</p>
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
