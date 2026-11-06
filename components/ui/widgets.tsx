"use client";

/*
 * Widgets — charts with their framing, ready to drop on a page.
 *
 * A chart answers "what shape is this data". A widget answers "what should
 * I do about it", which means a title, a delta, a caption and sometimes an
 * action. These are the compositions the product repeats, written once so
 * every dashboard assembles from the same parts rather than from scratch.
 */

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, MoreHorizontal, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ICON_SIZE, ICON_STROKE, type Tint } from "./tokens";
import { Card, CardHead } from "./surfaces";
import { Chip } from "./primitives";

/* --------------------------------------------------------------- delta -- */

/**
 * A signed change against a period.
 *
 * Up is not always good — expenses rising is bad — so `goodWhenUp` decides
 * the colour rather than the sign. Getting this backwards is the most
 * common bug in a metrics UI.
 */
export function Delta({
  value,
  period = "than last month",
  goodWhenUp = true,
}: {
  value: number;
  period?: string;
  goodWhenUp?: boolean;
}) {
  const up = value >= 0;
  const good = up === goodWhenUp;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="ox-delta" data-tint={good ? "green" : "red"}>
      <Icon size={ICON_SIZE.xs} strokeWidth={2.2} aria-hidden />
      {up ? "+" : ""}
      {value}%<em>{period}</em>
    </span>
  );
}

/* ----------------------------------------------------------- stat tile -- */

/** The smallest widget: a figure, a label, and what it is doing. */
export function StatTile({
  label,
  value,
  delta,
  goodWhenUp = true,
  sub,
  icon: Icon,
  tint = "blue",
  children,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  goodWhenUp?: boolean;
  sub?: string;
  icon?: LucideIcon;
  tint?: Tint;
  /** A sparkline, a micro bar strip — anything narrow. */
  children?: ReactNode;
}) {
  return (
    <div className="ox-tile">
      <div className="ox-tile-head">
        <span>
          {Icon && (
            <i className="ox-tile-ic" data-tint={tint}>
              <Icon size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
            </i>
          )}
          {label}
        </span>
      </div>
      <p className="ox-tile-value">{value}</p>
      {delta !== undefined && <Delta value={delta} goodWhenUp={goodWhenUp} />}
      {sub && <p className="ox-tile-sub">{sub}</p>}
      {children}
    </div>
  );
}

/** A row of tiles divided by hairlines — the reference's cashflow strip. */
export function StatStrip({ children }: { children: ReactNode }) {
  return <div className="ox-strip-row">{children}</div>;
}

/* --------------------------------------------------------- chart widget -- */

/**
 * The standard frame: title, optional delta, an action, then the chart.
 *
 * Nearly every card on a dashboard is this, which is why it exists — so a
 * new screen inherits the spacing and the header rhythm instead of
 * re-deciding them.
 */
export function ChartCard({
  title,
  icon,
  delta,
  goodWhenUp = true,
  action,
  footer,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  delta?: number;
  goodWhenUp?: boolean;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHead
        title={title}
        icon={icon}
        action={
          action ?? (
            <span className="ox-card-tools">
              {delta !== undefined && <Delta value={delta} goodWhenUp={goodWhenUp} period="this month" />}
              <button type="button" className="ox-circ" aria-label={`${title} options`}>
                <MoreHorizontal size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
              </button>
            </span>
          )
        }
      />
      <div className="ox-chart-body">{children}</div>
      {footer}
    </Card>
  );
}

/* ------------------------------------------------------------- insight -- */

/**
 * A derived conclusion with the actions it implies.
 *
 * The reference frames this as "AI-generated". We do not claim that unless
 * something actually generated it — the rows here are rules the product
 * computed, and calling that AI would be a lie a buyer could check.
 */
export function InsightCard({
  score,
  title,
  delta,
  actions,
}: {
  score: string;
  title: string;
  delta?: number;
  actions: { label: string; value: string }[];
}) {
  return (
    <Card className="ox-insight">
      <div className="ox-insight-head">
        <span className="ox-insight-ic">
          <Sparkles size={ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />
        </span>
        <p>Computed from this month&rsquo;s figures.</p>
      </div>
      <p className="ox-insight-score">{score}</p>
      <p className="ox-insight-title">
        {title}
        {delta !== undefined && <Delta value={delta} />}
      </p>
      <ul className="ox-insight-actions">
        {actions.map((a) => (
          <li key={a.label}>
            <span>{a.label}</span>
            <b>{a.value}</b>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ------------------------------------------------------------- activity -- */

export type ActivityRow = {
  id: string;
  time: string;
  text: string;
  tint: Tint;
  tag: string;
};

/** A time-ordered log. Tags carry the same meaning as everywhere else. */
export function ActivityList({ rows, empty }: { rows: ActivityRow[]; empty?: ReactNode }) {
  if (rows.length === 0 && empty) return <>{empty}</>;
  return (
    <ul className="ox-activity">
      {rows.map((row, i) => (
        <li key={row.id} style={{ animationDelay: `${i * 50}ms` }}>
          <time>{row.time}</time>
          <span>{row.text}</span>
          <Chip tint={row.tint} dot>
            {row.tag}
          </Chip>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------- metric rows -- */

/**
 * Three or four measures with their actual and their benchmark.
 *
 * The support-analytics shape: a row names the measure, states where it sits
 * and how that compares, so "15m" and "good" arrive together.
 */
export function MetricRows({
  rows,
}: {
  rows: { label: string; note: string; actual: string; delta: number; goodWhenUp?: boolean }[];
}) {
  return (
    <table className="ox-metrics">
      <thead>
        <tr>
          <th>Measure</th>
          <th>Actual</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td>
              <b>{r.label}</b>
              <small>{r.note}</small>
            </td>
            <td>{r.actual}</td>
            <td>
              <Delta value={r.delta} goodWhenUp={r.goodWhenUp ?? true} period="" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
