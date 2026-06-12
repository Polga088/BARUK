import { type ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="ui:rounded-2xl ui:border ui:border-baruk-200/60 ui:bg-cream-50 ui:p-6 ui:shadow-[var(--shadow-warm-sm)]">
      <p className="ui:text-xs ui:font-medium ui:uppercase ui:tracking-wider ui:text-baruk-700/60">
        {label}
      </p>
      <p className="ui:mt-2 ui:font-display ui:text-3xl ui:font-bold ui:text-baruk-900">
        {value}
      </p>
      {hint && (
        <p className="ui:mt-1 ui:text-sm ui:text-gold-600">{hint}</p>
      )}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  emptyMessage = "Aucune donnée.",
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, ReactNode>[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="ui:py-8 ui:text-center ui:text-sm ui:text-baruk-700/60">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="ui:overflow-x-auto">
      <table className="ui:w-full ui:text-sm">
        <thead>
          <tr className="ui:border-b ui:border-baruk-200/60 ui:bg-baruk-100/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`ui:px-4 ui:py-3 ui:text-left ui:font-medium ui:text-baruk-800 ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="ui:border-b ui:border-baruk-100 ui:transition-colors hover:ui:bg-cream-100/80"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`ui:px-4 ui:py-3 ui:text-baruk-900 ${col.className ?? ""}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
