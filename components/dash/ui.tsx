/*
 * Primitives for the product mock.
 *
 * Everything here is drawn on a fixed 1034 x 734 design canvas that
 * ScaleFrame shrinks to fit, so sizes are design pixels, not layout pixels.
 * Keep them in whole numbers — a half pixel here lands on a fractional device
 * pixel once scaled and softens the whole screen.
 */

import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export const INK = "#0b0b12";
export const MUTED = "#8a8a98";
export const BLUE = "#4a80e8";

export function Card({
  children,
  className = "",
  style,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  pad?: boolean;
}) {
  return (
    <div className={`dk-card ${pad ? "dk-pad" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardHead({
  title,
  action,
  icon: Icon,
}: {
  title: string;
  action?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="dk-head">
      <h3>
        {Icon && <Icon size={15} strokeWidth={1.8} aria-hidden />}
        {title}
      </h3>
      {action}
    </div>
  );
}

/** Small stat: label above, value below, tinted icon chip at the left. */
export function Figure({
  icon: Icon,
  label,
  value,
  tint = "blue",
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tint?: keyof typeof TINTS;
  sub?: string;
}) {
  const t = TINTS[tint];
  return (
    <div className="dk-fig">
      <span className="dk-fig-ic" style={{ background: t.bg, color: t.fg }}>
        <Icon size={15} strokeWidth={1.8} aria-hidden />
      </span>
      <span>
        <small>{label}</small>
        <b>{value}</b>
        {sub && <i>{sub}</i>}
      </span>
    </div>
  );
}

export const TINTS = {
  blue: { bg: "#e8efff", fg: "#2f63e8", solid: "#2f63e8" },
  purple: { bg: "#eee9fe", fg: "#6d4aef", solid: "#6d4aef" },
  sky: { bg: "#e2f4fd", fg: "#1b92c9", solid: "#1b92c9" },
  green: { bg: "#ddf6e4", fg: "#1f9d4d", solid: "#1f9d4d" },
  orange: { bg: "#fef0dd", fg: "#d2800f", solid: "#d2800f" },
  red: { bg: "#fde4e7", fg: "#d93a4d", solid: "#d93a4d" },
  slate: { bg: "#eceef4", fg: "#5b6478", solid: "#5b6478" },
} as const;

export function Chip({
  children,
  tint = "slate",
  dot = false,
}: {
  children: ReactNode;
  tint?: keyof typeof TINTS;
  dot?: boolean;
}) {
  const t = TINTS[tint];
  return (
    <span className="dk-chip" style={{ background: t.bg, color: t.fg }}>
      {dot && <i style={{ background: t.solid }} />}
      {children}
    </span>
  );
}

export function Bar({ value, tint = "blue" }: { value: number; tint?: keyof typeof TINTS }) {
  return (
    <span className="dk-bar">
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: TINTS[tint].solid }} />
    </span>
  );
}

/** Round progress dial. Used for consistency, KRA and QC pass rate. */
export function Dial({
  value,
  size = 104,
  stroke = 9,
  tint = "blue",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tint?: keyof typeof TINTS;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="dk-dial" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#edeff6" strokeWidth={stroke} />
        <circle
          className="dk-dial-arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TINTS[tint].solid}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.max(0, Math.min(100, value))) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="dk-dial-mid">{children}</span>
    </div>
  );
}

/** Round avatar built from initials, tinted deterministically by name. */
export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const keys = Object.keys(TINTS) as (keyof typeof TINTS)[];
  const t = TINTS[keys[name.charCodeAt(0) % keys.length]];
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className="dk-avatar"
      style={{ width: size, height: size, background: t.bg, color: t.fg, fontSize: size * 0.4 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
