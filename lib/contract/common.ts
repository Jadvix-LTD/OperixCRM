/*
 * The API contract — shared vocabulary.
 *
 * These types are the ONLY thing the screens and the future server agree on.
 * Phase 1 satisfies them from fixtures; phase 2 satisfies them from MongoDB.
 * Nothing in a screen may reach past this file for a shape.
 *
 * Rules that live here because they are easy to get wrong everywhere else:
 *   - money always carries its currency (three offices, never one total)
 *   - dates are ISO strings, which is what JSON gives us
 *   - a calendar day is "YYYY-MM-DD", the author's LOCAL day, never derived
 *     from a timestamp
 */

export type Id = string;

/** An ISO 8601 instant, e.g. "2026-11-07T09:02:00.000Z". */
export type Instant = string;

/** A local calendar day, "YYYY-MM-DD". Not a timestamp — see Shift. */
export type Day = string;

export const CURRENCIES = ["GBP", "INR"] as const;
export type Currency = (typeof CURRENCIES)[number];

/**
 * Money is never a bare number.
 *
 * Ruislip bills in GBP, Chennai and Coimbatore in INR, and student fees are
 * INR. A dashboard that adds them is simply wrong, so the currency travels
 * with the amount and `sumMoney` refuses to mix.
 */
export type Money = { amount: number; currency: Currency };

export function money(amount: number, currency: Currency): Money {
  return { amount, currency };
}

/**
 * Totals a list, or throws if it spans currencies.
 *
 * Deliberately a throw rather than a silent conversion: a wrong total that
 * looks right is worse than a crash in development, and a real conversion
 * needs a rate and a date that nobody has supplied.
 */
export function sumMoney(values: readonly Money[]): Money | null {
  if (values.length === 0) return null;
  const currency = values[0].currency;
  if (values.some((v) => v.currency !== currency)) {
    throw new Error("Refusing to sum money across currencies — group by currency first.");
  }
  return { amount: values.reduce((n, v) => n + v.amount, 0), currency };
}

const SYMBOL: Record<Currency, string> = { GBP: "£", INR: "₹" };

export function formatMoney(m: Money, opts: { compact?: boolean } = {}): string {
  const n = opts.compact
    ? new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(m.amount)
    : new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(m.amount);
  return `${SYMBOL[m.currency]}${n}`;
}

/* ------------------------------------------------------------ envelopes -- */

/** A list response. `meta` is what pagination controls read. */
export type Page<T> = {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
};

export type Query = {
  page?: number;
  pageSize?: number;
  search?: string;
  /** Column id, optionally prefixed with "-" for descending. */
  sort?: string;
};

/**
 * What a screen gets back, in every state it can be in.
 *
 * Modelled as a union so a component cannot read `data` without having dealt
 * with loading and error first — which is how the four states in the design
 * system stop being optional.
 */
export type Result<T> =
  | { status: "loading" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ok"; data: T };

/* ---------------------------------------------------------------- tiers -- */

/**
 * Which tier a field belongs to. See section 4 of the structure document.
 *
 * The contract carries the tier in the TYPE so a screen cannot accidentally
 * render something it was not given: a redacted record simply has no such
 * property, and TypeScript says so.
 */
export type Tier = "directory" | "work" | "sensitive";
