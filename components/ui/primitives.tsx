"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ICON_SIZE, ICON_STROKE, tintForName, type Tint } from "./tokens";

/* --------------------------------------------------------------- button -- */

type ButtonVariant = "solid" | "outline" | "subtle" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  /** Put the icon after the label — for "next" and "open" actions. */
  iconAfter?: boolean;
  /** Shows a spinner and blocks the click without changing the width. */
  busy?: boolean;
  children?: ReactNode;
};

export function Button({
  variant = "outline",
  size = "md",
  icon: Icon,
  iconAfter = false,
  busy = false,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const glyph = Icon ? (
    <Icon size={size === "sm" ? ICON_SIZE.xs : ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
  ) : null;

  return (
    <button
      type="button"
      className={`ox-btn ox-btn-${variant} ox-btn-${size} ${className}`}
      disabled={disabled || busy}
      data-busy={busy || undefined}
      {...rest}
    >
      {!iconAfter && glyph}
      {children}
      {iconAfter && glyph}
      {busy && <span className="ox-spin" aria-hidden />}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  size = "md",
  variant = "outline",
  className = "",
  ...rest
}: Omit<ButtonProps, "children" | "icon" | "iconAfter"> & { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`ox-iconbtn ox-btn-${variant} ox-btn-${size} ${className}`}
      {...rest}
    >
      <Icon size={size === "sm" ? ICON_SIZE.sm : ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />
    </button>
  );
}

/* ----------------------------------------------------------------- chip -- */

export function Chip({
  children,
  tint = "slate",
  dot = false,
  icon: Icon,
}: {
  children: ReactNode;
  tint?: Tint;
  /** A status dot. Use when the chip reports a live state. */
  dot?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <span className="ox-chip" data-tint={tint}>
      {dot && <i className="ox-chip-dot" aria-hidden />}
      {Icon && <Icon size={ICON_SIZE.xs} strokeWidth={ICON_STROKE} aria-hidden />}
      {children}
    </span>
  );
}

/** A count or a short label with no state behind it. Square, not a pill. */
export function Badge({ children, tint = "slate" }: { children: ReactNode; tint?: Tint }) {
  return (
    <span className="ox-badge" data-tint={tint}>
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- avatar -- */

export function Avatar({
  name,
  src,
  size = 28,
  presence,
}: {
  name: string;
  src?: string | null;
  size?: number;
  /** Draws the presence ring. Omit when presence is unknown or irrelevant. */
  presence?: "online" | "away" | "busy" | "offline";
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span className="ox-avatar-wrap" style={{ width: size, height: size }}>
      <span
        className="ox-avatar"
        data-tint={tintForName(name)}
        style={{ fontSize: Math.round(size * 0.38) }}
        aria-hidden
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- the package must not depend on a framework
          <img src={src} alt="" />
        ) : (
          initials
        )}
      </span>
      {presence && <i className="ox-presence" data-state={presence} aria-hidden />}
      <span className="ox-sr">{name}</span>
    </span>
  );
}

/** Overlapping avatars for a team cell. */
export function AvatarStack({ names, size = 22, max = 4 }: { names: string[]; size?: number; max?: number }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className="ox-stack">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={size} />
      ))}
      {rest > 0 && (
        <span className="ox-stack-rest" style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}>
          +{rest}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------ progress -- */

export function Bar({
  value,
  tint = "blue",
  label,
}: {
  /** 0–100. Clamped, because a computed percentage overshoots eventually. */
  value: number;
  tint?: Tint;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <span className="ox-bar" role="img" aria-label={label ?? `${Math.round(pct)}%`}>
      <i data-tint={tint} style={{ width: `${pct}%` }} />
    </span>
  );
}

/* ------------------------------------------------------------ skeleton -- */

/** A loading placeholder shaped like the content it replaces, never a spinner. */
export function Skeleton({
  w = "100%",
  h = 14,
  radius = "var(--ox-r-chip)",
}: {
  w?: number | string;
  h?: number | string;
  radius?: string;
}) {
  return <span className="ox-skel" style={{ width: w, height: h, borderRadius: radius }} aria-hidden />;
}

export function SkeletonRows({ rows = 5, gap = 10 }: { rows?: number; gap?: number }) {
  return (
    <div className="ox-skel-rows" style={{ gap }} aria-busy="true" aria-live="polite">
      <span className="ox-sr">Loading</span>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} h={34} radius="var(--ox-r-control)" />
      ))}
    </div>
  );
}
