"use client";

import type { ReactNode } from "react";
import { type Tint } from "./tokens";

/*
 * The chart set, promoted unchanged from the product mock.
 *
 * All of it is hand-drawn SVG and CSS — no charting library. These are the
 * four shapes the product actually needs, they weigh nothing, and they
 * inherit the tokens so a theme switch costs no work.
 *
 * Server and browser trig can differ in the last digit, so every computed
 * coordinate is rounded. Without it React reports a hydration mismatch on
 * every arc.
 */
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ----------------------------------------------------------------- dial -- */

/** A ring with a value in the middle. Percentages, scores, pass rates. */
export function Dial({
  value,
  size = 104,
  stroke = 9,
  tint = "blue",
  children,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tint?: Tint;
  children?: ReactNode;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="ox-dial" style={{ width: size, height: size }}>
      <svg width={size} height={size} role={label ? "img" : "presentation"} aria-label={label}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ox-hairline)" strokeWidth={stroke} />
        <circle
          className="ox-dial-arc"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`var(--t-${tint})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={r2(circumference)}
          strokeDashoffset={r2(circumference - (circumference * pct) / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ox-dial-mid">{children}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- gauge -- */

/**
 * The tick arc. Reads better than a dial when the number is a count out of a
 * whole rather than a percentage — QC pass rate, items signed off.
 */
export function Gauge({
  active = 21,
  total = 31,
  value,
  label,
  className,
  animate = false,
}: {
  active?: number;
  total?: number;
  value: string;
  label: string;
  className?: string;
  animate?: boolean;
}) {
  const cx = 161;
  const cy = 218;
  const R = 145;
  const step = 180 / (total - 1);

  const ticks = Array.from({ length: total }, (_, i) => {
    const angle = ((180 - i * step) * Math.PI) / 180;
    const len = 75 - 17 * Math.sin((i * Math.PI) / (total - 1));
    const inner = R - len;
    const on = i < active;
    const t = i / Math.max(1, active - 1);
    return {
      x1: r2(cx + inner * Math.cos(angle)),
      y1: r2(cy - inner * Math.sin(angle)),
      x2: r2(cx + R * Math.cos(angle)),
      y2: r2(cy - R * Math.sin(angle)),
      // The lit run grades blue → cyan so the arc reads as a direction.
      color: on
        ? `rgb(${Math.round(43 - 12 * t)},${Math.round(79 + 84 * t)},${Math.round(216 - 16 * t)})`
        : "var(--ox-hairline)",
      on,
    };
  });

  return (
    <svg className={className} viewBox="0 0 322 250" role="img" aria-label={`${label}: ${value}`}>
      {ticks.map((t, i) => (
        <line
          key={i}
          className={animate ? "ox-gauge-tick" : undefined}
          style={animate ? { animationDelay: `${i * 26}ms` } : undefined}
          pathLength={1}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.color}
          strokeWidth="13"
          strokeLinecap="round"
        />
      ))}
      <text x={cx} y={cy - 22} textAnchor="middle" className="ox-gauge-value">
        {value}
      </text>
      <text x={cx} y={cy + 4} textAnchor="middle" className="ox-gauge-label">
        {label}
      </text>
    </svg>
  );
}

/* ----------------------------------------------------------- dot matrix -- */

/**
 * Delivery by period: a lit column of dots against a planned total.
 *
 * Used instead of a bar chart because it shows the two numbers (done, planned)
 * in one column without a second series, and it reads at thumbnail size.
 */
export function DotMatrix({
  lit,
  total,
  size = 15,
  pitch = 17,
  focus = null,
  label,
  className,
}: {
  lit: number[];
  total: number[];
  size?: number;
  pitch?: number;
  /** The highlighted column; the rest dim. */
  focus?: number | null;
  label: string;
  className?: string;
}) {
  const rows = Math.max(...total);
  const w = (total.length - 1) * pitch + size;
  const h = (rows - 1) * (size + 1) + size;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMax meet"
    >
      {total.map((n, i) => {
        const t = i / Math.max(1, total.length - 1);
        const colour = `rgb(${Math.round(108 - 48 * t)},${Math.round(99 + 55 * t)},232)`;
        const dim = focus !== null && focus !== i;
        return (
          <g key={i} opacity={dim ? 0.4 : 1} className="ox-dots-col">
            {Array.from({ length: n }, (_, r) => (
              <circle
                key={r}
                cx={i * pitch + size / 2}
                cy={h - size / 2 - r * (size + 1)}
                r={size / 2}
                fill={r < lit[i] ? colour : "var(--ox-hairline)"}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ----------------------------------------------------------- month bars -- */

/** One bar per day. Attendance, hours, anything daily across a month. */
export function MonthBars({
  values,
  over = 100,
  label,
}: {
  /** 0 means the office was closed; it draws as a flat hairline stub. */
  values: number[];
  /** Values at or above this are tinted as overtime. */
  over?: number;
  label: string;
}) {
  return (
    <div className="ox-monthbars" role="img" aria-label={label}>
      {values.map((v, i) => (
        <span
          key={i}
          data-state={v === 0 ? "off" : v >= over ? "over" : "on"}
          style={{ height: `${Math.max(7, v)}%`, animationDelay: `${i * 20}ms` }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ sparkline -- */

export function Sparkline({
  points,
  tint = "red",
  className,
  label,
}: {
  /** 0–100, evenly spaced. */
  points: number[];
  tint?: Tint;
  className?: string;
  label?: string;
}) {
  const w = 200;
  const h = 60;
  const step = w / Math.max(1, points.length - 1);
  const d = points
    .map((p, i) => `${i ? "L" : "M"}${r2(i * step)} ${r2(h - (p / 100) * (h - 8) - 4)}`)
    .join("");
  const last = points[points.length - 1] ?? 0;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      role={label ? "img" : "presentation"}
      aria-label={label}
      preserveAspectRatio="none"
    >
      <path d={`${d}L${w} ${h}L0 ${h}Z`} fill={`var(--t-${tint}-bg)`} opacity=".6" />
      <path d={d} fill="none" stroke={`var(--t-${tint})`} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <circle cx={w} cy={r2(h - (last / 100) * (h - 8) - 4)} r="3" fill={`var(--t-${tint})`} />
    </svg>
  );
}

/* ----------------------------------------------------------- mini bars -- */

/** A small ranked comparison: top three teams, top products. */
export function RankBars({
  data,
  label,
}: {
  data: { label: string; value: number; tint?: Tint }[];
  label: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="ox-rank" role="img" aria-label={label}>
      {data.map((d, i) => (
        <div key={d.label} className="ox-rank-row">
          <span className="ox-rank-label">{d.label}</span>
          <span className="ox-rank-track">
            <i
              data-tint={d.tint ?? (i === 0 ? "blue" : i === 1 ? "sky" : "slate")}
              style={{ width: `${(d.value / max) * 100}%`, animationDelay: `${i * 80}ms` }}
            />
          </span>
          <b>{d.value}</b>
        </div>
      ))}
    </div>
  );
}
