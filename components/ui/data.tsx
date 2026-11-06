"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ICON_SIZE, ICON_STROKE, type Tint } from "./tokens";

/* ---------------------------------------------------------------- table -- */

export type Column<T> = {
  key: string;
  head: ReactNode;
  /** Right-align and use tabular figures. Set it for anything comparable. */
  numeric?: boolean;
  width?: number | string;
  cell: (row: T) => ReactNode;
};

/**
 * The one table.
 *
 * Headed by small caps, divided by hairlines, hover on the row. It takes a
 * column list rather than children so every table in the product aligns the
 * same way and numeric columns cannot be forgotten.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  caption,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Makes rows keyboard-reachable as well as clickable. */
  onRowClick?: (row: T) => void;
  caption?: string;
  empty?: ReactNode;
}) {
  if (rows.length === 0 && empty) return <>{empty}</>;

  return (
    <table className="ox-table">
      {caption && <caption className="ox-sr">{caption}</caption>}
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ width: c.width }} data-numeric={c.numeric || undefined}>
              {c.head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={rowKey(row)}
            data-clickable={onRowClick ? "true" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            onKeyDown={
              onRowClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }
                : undefined
            }
          >
            {columns.map((c) => (
              <td key={c.key} data-numeric={c.numeric || undefined}>
                {c.cell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Name over role, with an avatar. The most repeated cell in the product. */
export function PersonCell({ name, sub, avatar }: { name: string; sub?: string; avatar?: ReactNode }) {
  return (
    <span className="ox-person">
      {avatar}
      <span>
        <b>{name}</b>
        {sub && <small>{sub}</small>}
      </span>
    </span>
  );
}

/* --------------------------------------------------------------- figure -- */

/** A single statistic: tinted icon chip, label, value, optional sub-line. */
export function Figure({
  icon: Icon,
  label,
  value,
  sub,
  tint = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub?: string;
  tint?: Tint;
}) {
  return (
    <div className="ox-figure">
      <span className="ox-figure-ic" data-tint={tint}>
        <Icon size={ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />
      </span>
      <span>
        <small>{label}</small>
        <b>{value}</b>
        {sub && <i>{sub}</i>}
      </span>
    </div>
  );
}

/** A row of figures divided by hairlines. Four is the comfortable maximum. */
export function FigureRow({ children }: { children: ReactNode }) {
  return <div className="ox-figure-row">{children}</div>;
}

/* ------------------------------------------------------------- key/value -- */

/** The read view of a record. Pairs, not a form — nothing here is editable. */
export function DescList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="ox-desc">
      {items.map((i) => (
        <div key={i.label}>
          <dt>{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------- timeline -- */

export type TimelineStep = {
  id: string;
  label: string;
  meta?: string;
  state: "done" | "current" | "todo" | "late";
  trailing?: ReactNode;
};

const STEP_TINT: Record<TimelineStep["state"], Tint> = {
  done: "green",
  current: "blue",
  todo: "slate",
  late: "orange",
};

/** Milestones, gates, a delivery plan — anything with an order and a state. */
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="ox-timeline">
      {steps.map((s, i) => (
        <li key={s.id} style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
          <span className="ox-tl-dot" data-tint={STEP_TINT[s.state]}>
            {s.state === "done" && <Check size={10} strokeWidth={3} aria-hidden />}
          </span>
          <span className="ox-tl-body">
            <b>{s.label}</b>
            {s.meta && <small>{s.meta}</small>}
          </span>
          {s.trailing}
        </li>
      ))}
    </ol>
  );
}
