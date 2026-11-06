"use client";

/*
 * The second chart set.
 *
 * Shapes taken from the reference boards and rebuilt in OperixCRM's own
 * language — our seven tints, our one easing curve, our tabular figures —
 * rather than copied. Everything is hand-drawn SVG and CSS: no charting
 * library, every mark inherits the token set, and a theme switch costs
 * nothing.
 *
 * All of it works in light and dark because not one colour is a literal:
 * marks reference `var(--ox-t-*)`, surfaces reference `var(--ox-*)`.
 *
 * Server and browser trig can differ in the last digit, so every computed
 * coordinate is rounded — otherwise React reports a hydration mismatch on
 * every path.
 */

import { useId, useState, type ReactNode } from "react";
import type { Tint } from "./tokens";

const r2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/* ============================================================ area chart -- */

export type Point = { label: string; value: number };

/**
 * A line with a filled area, a crosshair and a read-out.
 *
 * The workhorse for anything over time — revenue, hours, pipeline. The
 * tooltip follows the pointer by column rather than by pixel, so it never
 * lands between two values.
 */
export function AreaChart({
  points,
  tint = "blue",
  height = 180,
  format = (n) => n.toLocaleString("en-GB"),
  label,
  /** A second, muted series drawn behind — last year, or a projection. */
  compare,
}: {
  points: Point[];
  tint?: Tint;
  height?: number;
  format?: (n: number) => string;
  label: string;
  compare?: number[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");

  const w = 600;
  const h = height;
  const pad = { top: 14, right: 8, bottom: 22, left: 8 };
  const max = Math.max(...points.map((p) => p.value), ...(compare ?? []), 1);
  const stepX = (w - pad.left - pad.right) / Math.max(1, points.length - 1);
  const y = (v: number) => r2(pad.top + (1 - v / max) * (h - pad.top - pad.bottom));
  const x = (i: number) => r2(pad.left + i * stepX);

  const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join("");
  const main = line(points.map((p) => p.value));
  const active = hover ?? points.length - 1;

  return (
    <div className="ox-chart" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={label}>
        <defs>
          <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`var(--ox-t-${tint})`} stopOpacity=".28" />
            <stop offset="1" stopColor={`var(--ox-t-${tint})`} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad.left}
            x2={w - pad.right}
            y1={r2(pad.top + f * (h - pad.top - pad.bottom))}
            y2={r2(pad.top + f * (h - pad.top - pad.bottom))}
            stroke="var(--ox-hairline)"
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {compare && (
          <path
            d={line(compare)}
            fill="none"
            stroke="var(--ox-faint)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        )}

        <path d={`${main}L${x(points.length - 1)} ${h - pad.bottom}L${x(0)} ${h - pad.bottom}Z`} fill={`url(#${gid}-fill)`} />
        <path d={main} fill="none" stroke={`var(--ox-t-${tint})`} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />

        <line
          x1={x(active)}
          x2={x(active)}
          y1={pad.top}
          y2={h - pad.bottom}
          stroke={`var(--ox-t-${tint})`}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
          opacity={hover === null ? 0 : 0.7}
        />
        <circle cx={x(active)} cy={y(points[active].value)} r="4" fill={`var(--ox-t-${tint})`} stroke="var(--ox-card)" strokeWidth="2" />
      </svg>

      <div className="ox-chart-hits">
        {points.map((p, i) => (
          <button
            key={p.label}
            type="button"
            aria-label={`${p.label}: ${format(p.value)}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
          />
        ))}
      </div>

      {hover !== null && (
        <div
          className="ox-chart-tip"
          style={{ left: `${(hover / Math.max(1, points.length - 1)) * 100}%` }}
        >
          <b>{format(points[hover].value)}</b>
          <small>{points[hover].label}</small>
        </div>
      )}

      <div className="ox-chart-axis">
        {points.map((p, i) => (
          <span key={p.label} data-on={i === active || undefined}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================= bar chart -- */

/**
 * Columns with a highlighted bar and a read-out.
 *
 * The hovered column fills with the tint's gradient while the rest stay
 * muted, which is how the reference draws attention without colouring
 * everything.
 */
export function BarChart({
  points,
  tint = "blue",
  height = 180,
  format = (n) => n.toLocaleString("en-GB"),
  label,
  tipLabel = "Value",
}: {
  points: Point[];
  tint?: Tint;
  height?: number;
  format?: (n: number) => string;
  label: string;
  tipLabel?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...points.map((p) => p.value), 1);
  const active = hover ?? points.findIndex((p) => p.value === max);

  return (
    <div className="ox-bars" style={{ height }} role="img" aria-label={label}>
      <div className="ox-bars-plot">
        {points.map((p, i) => (
          <button
            key={p.label}
            type="button"
            className="ox-bars-col"
            data-on={i === active || undefined}
            data-tint={tint}
            aria-label={`${p.label}: ${format(p.value)}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
          >
            <i style={{ height: `${clamp((p.value / max) * 100)}%`, animationDelay: `${i * 40}ms` }} />
          </button>
        ))}

        {active >= 0 && (
          <div
            className="ox-bars-tip"
            style={{ left: `${((active + 0.5) / points.length) * 100}%` }}
          >
            <small>{tipLabel}</small>
            <b>{format(points[active].value)}</b>
          </div>
        )}
      </div>
      <div className="ox-chart-axis">
        {points.map((p, i) => (
          <span key={p.label} data-on={i === active || undefined}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ========================================================== target line -- */

/**
 * Actual against projected, with the handover marked.
 *
 * The solid run is what happened; the grey run past the marker is the
 * forecast. Used for a sales target, a burn-down, a cohort's progress.
 */
export function TargetLine({
  actual,
  projected,
  markerLabel,
  height = 150,
  tint = "orange",
  label,
}: {
  actual: number[];
  /** Continues from the last actual point. Drawn muted. */
  projected: number[];
  markerLabel: string;
  height?: number;
  tint?: Tint;
  label: string;
}) {
  const w = 600;
  const h = height;
  const all = [...actual, ...projected];
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const span = max - min || 1;
  const stepX = w / Math.max(1, all.length - 1);
  const y = (v: number) => r2(10 + (1 - (v - min) / span) * (h - 34));
  const x = (i: number) => r2(i * stepX);

  const path = (vals: number[], offset: number) =>
    vals.map((v, i) => `${i ? "L" : "M"}${x(i + offset)} ${y(v)}`).join("");

  const markerX = x(actual.length - 1);
  const markerY = y(actual[actual.length - 1]);

  return (
    <div className="ox-target" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={label}>
        <path d={path(actual, 0)} fill="none" stroke={`var(--ox-t-${tint})`} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        <path
          d={path([actual[actual.length - 1], ...projected], actual.length - 1)}
          fill="none"
          stroke="var(--ox-faint)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        <line x1={markerX} x2={markerX} y1={markerY} y2={h - 16} stroke="var(--ox-line-strong)" vectorEffect="non-scaling-stroke" />
        <circle cx={markerX} cy={markerY} r="5" fill={`var(--ox-t-${tint})`} stroke="var(--ox-card)" strokeWidth="2.5" />
      </svg>
      <span className="ox-target-marker" style={{ left: `${(markerX / w) * 100}%` }}>
        {markerLabel}
      </span>
      <div className="ox-target-baseline" aria-hidden>
        {Array.from({ length: 34 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
    </div>
  );
}

/* =========================================================== segment bar -- */

export type Segment = { label: string; value: number; tint: Tint; striped?: boolean };

/**
 * One bar made of labelled segments, as the reference's cashflow strip is.
 *
 * Reads as a composition rather than a progress bar: each segment is a
 * share of the whole, and the legend names them. `striped` gives a segment
 * the hatched treatment the reference uses for the "incoming" run.
 */
export function SegmentBar({
  segments,
  height = 34,
  label,
  showLegend = true,
}: {
  segments: Segment[];
  height?: number;
  label: string;
  showLegend?: boolean;
}) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  return (
    <div className="ox-segbar-wrap">
      <div className="ox-segbar" style={{ height }} role="img" aria-label={label}>
        {segments.map((s, i) => (
          <i
            key={s.label}
            data-tint={s.tint}
            data-striped={s.striped || undefined}
            style={{ width: `${(s.value / total) * 100}%`, animationDelay: `${i * 90}ms` }}
            title={s.label}
          />
        ))}
      </div>
      {showLegend && (
        <div className="ox-legend">
          {segments.map((s) => (
            <span key={s.label}>
              <i data-tint={s.tint} style={{ background: `var(--ox-t-${s.tint})` }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================= progress ticks -- */

/**
 * A filled bar against a ruler, with a handle at the current value.
 *
 * Better than a plain progress bar when the REMAINING part matters as much
 * as the done part — a budget, a sprint, a fee plan.
 */
export function ProgressTicks({
  value,
  tint = "blue",
  label,
  caption,
}: {
  value: number;
  tint?: Tint;
  label: string;
  caption?: ReactNode;
}) {
  const pct = clamp(value);
  return (
    <div className="ox-ticks-wrap">
      <div className="ox-ticks" role="img" aria-label={`${label}: ${Math.round(pct)}%`}>
        <span className="ox-ticks-fill" data-tint={tint} style={{ width: `${pct}%` }}>
          <em>{Math.round(pct)}%</em>
        </span>
        <span className="ox-ticks-rule" aria-hidden>
          {Array.from({ length: 40 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
        <span className="ox-ticks-handle" style={{ left: `${pct}%` }} aria-hidden />
        <b>100%</b>
      </div>
      {caption && <p className="ox-ticks-caption">{caption}</p>}
    </div>
  );
}

/* =========================================================== radial gauge -- */

/**
 * The speedometer: a fan of tick rays with the figure beneath.
 *
 * Reads a rate against a ceiling at a glance — a daily target, a pass rate,
 * utilisation. Distinct from Gauge (the half arc) because the rays carry a
 * sense of travel that a solid arc does not.
 */
export function RadialGauge({
  value,
  max = 100,
  big,
  sub,
  tint = "blue",
  label,
  size = 190,
}: {
  value: number;
  max?: number;
  big: string;
  sub?: string;
  tint?: Tint;
  label: string;
  size?: number;
}) {
  const rays = 48;
  const lit = Math.round((clamp(value, 0, max) / max) * rays);
  const cx = 100;
  const cy = 96;
  const inner = 60;
  const outer = 90;

  return (
    <div className="ox-radial" style={{ width: size }}>
      <svg viewBox="0 0 200 118" role="img" aria-label={`${label}: ${big}`}>
        {Array.from({ length: rays }, (_, i) => {
          const a = ((180 - (i * 180) / (rays - 1)) * Math.PI) / 180;
          const on = i < lit;
          const len = on ? outer : outer - 6;
          return (
            <line
              key={i}
              x1={r2(cx + inner * Math.cos(a))}
              y1={r2(cy - inner * Math.sin(a))}
              x2={r2(cx + len * Math.cos(a))}
              y2={r2(cy - len * Math.sin(a))}
              stroke={on ? `var(--ox-t-${tint})` : "var(--ox-hairline)"}
              strokeWidth="2"
              strokeLinecap="round"
              opacity={on ? 0.45 + 0.55 * (i / rays) : 1}
            />
          );
        })}
      </svg>
      <div className="ox-radial-mid">
        <b>{big}</b>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}

/* ============================================================= semi gauge -- */

/**
 * A thick half arc with a handle and end labels — the satisfaction score.
 *
 * Where RadialGauge is a rate, this is a SCORE out of a stated range, so it
 * labels both ends and puts the denominator beside the figure.
 */
export function SemiGauge({
  value,
  max = 100,
  tint = "blue",
  label,
  caption,
}: {
  value: number;
  max?: number;
  tint?: Tint;
  label: string;
  caption?: ReactNode;
}) {
  const pct = clamp((value / max) * 100);
  const cx = 110;
  const cy = 104;
  const rad = 88;
  const arc = (from: number, to: number) => {
    const a0 = (Math.PI * (180 - from * 180)) / 180;
    const a1 = (Math.PI * (180 - to * 180)) / 180;
    const big = to - from > 0.5 ? 1 : 0;
    return `M${r2(cx + rad * Math.cos(a0))} ${r2(cy - rad * Math.sin(a0))}A${rad} ${rad} 0 ${big} 1 ${r2(cx + rad * Math.cos(a1))} ${r2(cy - rad * Math.sin(a1))}`;
  };
  const handleA = (Math.PI * (180 - (pct / 100) * 180)) / 180;

  return (
    <div className="ox-semi">
      <svg viewBox="0 0 220 124" role="img" aria-label={`${label}: ${value} out of ${max}`}>
        <path d={arc(0, 1)} fill="none" stroke="var(--ox-hairline)" strokeWidth="14" strokeLinecap="round" />
        <path
          className="ox-semi-arc"
          d={arc(0, Math.max(0.001, pct / 100))}
          fill="none"
          stroke={`var(--ox-t-${tint})`}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle
          cx={r2(cx + rad * Math.cos(handleA))}
          cy={r2(cy - rad * Math.sin(handleA))}
          r="7"
          fill={`var(--ox-t-${tint})`}
          stroke="var(--ox-card)"
          strokeWidth="3"
        />
      </svg>
      <div className="ox-semi-mid">
        <b>{value}</b>
        <span>/{max}</span>
      </div>
      <div className="ox-semi-ends">
        <span>0</span>
        <span>{max}</span>
      </div>
      {caption && <div className="ox-semi-caption">{caption}</div>}
    </div>
  );
}

/* ============================================================= micro bars -- */

/**
 * A dense strip of thin bars, lit up to a percentage.
 *
 * Carries a proportion in almost no space, so it fits on a row in a list
 * where a real chart would not. The lit run grades across the tint.
 */
export function MicroBars({
  value,
  bars = 44,
  tint = "green",
  label,
}: {
  value: number;
  bars?: number;
  tint?: Tint;
  label: string;
}) {
  const lit = Math.round((clamp(value) / 100) * bars);
  return (
    <span className="ox-micro" role="img" aria-label={`${label}: ${Math.round(value)}%`}>
      {Array.from({ length: bars }, (_, i) => (
        <i
          key={i}
          data-on={i < lit || undefined}
          data-tint={tint}
          style={{ opacity: i < lit ? 0.45 + 0.55 * (i / Math.max(1, lit)) : 1, animationDelay: `${i * 8}ms` }}
        />
      ))}
    </span>
  );
}

/* ======================================================= stacked columns -- */

/**
 * A few labelled columns side by side, each split into parts.
 *
 * The finance-balance shape: earning, profit and target as three stacks you
 * can compare at a glance without a legend per column.
 */
export function StackedColumns({
  columns,
  height = 120,
  label,
}: {
  columns: { label: string; parts: { value: number; tint: Tint }[] }[];
  height?: number;
  label: string;
}) {
  const max = Math.max(...columns.map((c) => c.parts.reduce((n, p) => n + p.value, 0)), 1);
  return (
    <div className="ox-stacks" style={{ height }} role="img" aria-label={label}>
      {columns.map((c, i) => {
        const total = c.parts.reduce((n, p) => n + p.value, 0);
        return (
          <div key={c.label} className="ox-stack" title={c.label}>
            <span className="ox-stack-col" style={{ height: `${(total / max) * 100}%`, animationDelay: `${i * 80}ms` }}>
              {c.parts.map((p, k) => (
                <i key={k} data-tint={p.tint} style={{ flex: p.value }} />
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ====================================================== geo distribution -- */

/**
 * Value by place, as labelled pills.
 *
 * The reference floats these over a world map. We drop the map: it is a
 * large decorative asset that carries no information the pills do not, and
 * it would have to be re-drawn for dark mode. The pills sort themselves, so
 * the biggest market reads first.
 */
export function GeoDistribution({
  places,
  format,
  label,
}: {
  places: { place: string; flag: string; value: number }[];
  format: (n: number) => string;
  label: string;
}) {
  const sorted = [...places].sort((a, b) => b.value - a.value);
  const max = sorted[0]?.value || 1;
  return (
    <ul className="ox-geo" aria-label={label}>
      {sorted.map((p, i) => (
        <li key={p.place} style={{ animationDelay: `${i * 60}ms` }}>
          <span className="ox-geo-flag" aria-hidden>
            {p.flag}
          </span>
          <span className="ox-geo-name">{p.place}</span>
          <span className="ox-geo-track">
            <i data-tint={i === 0 ? "blue" : i < 3 ? "sky" : "slate"} style={{ width: `${(p.value / max) * 100}%` }} />
          </span>
          <b>{format(p.value)}</b>
        </li>
      ))}
    </ul>
  );
}
