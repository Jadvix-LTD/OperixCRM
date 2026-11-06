/*
 * The typed half of the token set.
 *
 * tokens.css is the source of truth for anything CSS can express. This file
 * exists for the cases CSS cannot reach: picking a tint in TypeScript, driving
 * an SVG `stroke`, or iterating the palette to build the reference page.
 *
 * Values here are CSS variable REFERENCES, never literals, so there is still
 * exactly one place a colour is written down.
 */

export const TINTS = [
  "blue",
  "purple",
  "sky",
  "green",
  "orange",
  "red",
  "slate",
] as const;

export type Tint = (typeof TINTS)[number];

/** `var()` references for a tint's three roles. Safe anywhere CSS is accepted. */
export function tint(name: Tint) {
  return {
    bg: `var(--t-${name}-bg)`,
    fg: `var(--t-${name}-fg)`,
    solid: `var(--t-${name})`,
  } as const;
}

/**
 * What each tint means. Colour carries meaning, not decoration — a chart
 * series never borrows a status colour, and nothing is green unless it went
 * well. Kept here so the reference page can state it and reviewers can check
 * a new screen against it.
 */
export const TINT_MEANING: Record<Tint, string> = {
  blue: "Primary, selection, in progress, the brand",
  purple: "In review, scheduled, secondary emphasis",
  sky: "Informational, neutral data, this period",
  green: "Approved, paid, present, on track",
  orange: "Overtime, pending, running late, warning",
  red: "Error verdict, overdue, critical, destructive",
  slate: "Inactive, archived, not started, minor",
};

/** Deterministic tint for a name, so one person is the same colour everywhere. */
export function tintForName(name: string): Tint {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
}

export const RADIUS = {
  chip: "var(--ox-r-chip)",
  control: "var(--ox-r-control)",
  card: "var(--ox-r-card)",
  panel: "var(--ox-r-panel)",
  pill: "var(--ox-r-pill)",
} as const;

export const MOTION = {
  ease: "var(--ox-ease)",
  fast: "var(--ox-t-fast)",
  mid: "var(--ox-t-mid)",
  slow: "var(--ox-t-slow)",
} as const;

/** One stroke weight across the whole product. Lucide's default is 2. */
export const ICON_STROKE = 1.7;

/** Sizes that read correctly in a dense tool. */
export const ICON_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
} as const;
