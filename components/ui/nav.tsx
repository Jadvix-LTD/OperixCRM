"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "./tokens";

/* ----------------------------------------------------------- breadcrumb -- */

export type Crumb = { label: string; href?: string };

/**
 * The trail, and the reason there are no modals.
 *
 * Every crumb points at a page that genuinely exists — nothing in the trail
 * is a dead label. The last one is the current page and is not a link.
 */
export function Breadcrumb({
  items,
  render,
}: {
  items: Crumb[];
  /** Supplied by the app so this package stays free of a router dependency. */
  render?: (c: Crumb, children: ReactNode) => ReactNode;
}) {
  return (
    <nav className="ox-crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          const body = <span>{c.label}</span>;
          return (
            <li key={`${c.label}-${i}`} aria-current={last ? "page" : undefined}>
              {last || !c.href ? body : (render?.(c, body) ?? <a href={c.href}>{body}</a>)}
              {!last && <ChevronRight size={ICON_SIZE.xs} strokeWidth={ICON_STROKE} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------------- pills -- */

export type PillItem = { id: string; label: string; count?: number };

/**
 * The dark segmented control from the mock's header.
 * Used for the primary view switch on a page, never for navigation between
 * modules — that is the rail's job.
 */
export function NavPills({
  items,
  value,
  onChange,
  label,
}: {
  items: PillItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div className="ox-navpills" role="tablist" aria-label={label}>
      {items.map((i) => (
        <button
          key={i.id}
          role="tab"
          type="button"
          aria-selected={i.id === value}
          className={i.id === value ? "is-on" : undefined}
          onClick={() => onChange(i.id)}
        >
          {i.label}
          {i.count !== undefined && <em>{i.count}</em>}
        </button>
      ))}
    </div>
  );
}

/** The lighter sub-filter row that sits under a page title. */
export function FilterPills({
  items,
  value,
  onChange,
  label,
}: {
  items: PillItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div className="ox-filterpills" role="tablist" aria-label={label}>
      {items.map((i) => (
        <button
          key={i.id}
          role="tab"
          type="button"
          aria-selected={i.id === value}
          className={i.id === value ? "is-on" : undefined}
          onClick={() => onChange(i.id)}
        >
          {i.label}
          {i.count !== undefined && <em>{i.count}</em>}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- tabs -- */

/** Underlined tabs, for sections of one record: profile · work · documents. */
export function Tabs({
  items,
  value,
  onChange,
  label,
}: {
  items: PillItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div className="ox-tabs" role="tablist" aria-label={label}>
      {items.map((i) => (
        <button
          key={i.id}
          role="tab"
          type="button"
          aria-selected={i.id === value}
          className={i.id === value ? "is-on" : undefined}
          onClick={() => onChange(i.id)}
        >
          {i.label}
          {i.count !== undefined && <em>{i.count}</em>}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- side panel -- */

/**
 * The quick view that replaces a modal.
 *
 * It pushes the list aside instead of covering it, so the row you came from
 * stays visible and the page behind never goes dark. The app gives it a URL
 * through a search param, which is what makes it linkable.
 */
export function SidePanel({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <aside className="ox-side" aria-label={title}>
      <header>
        <h2>{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close panel">
          <ChevronRight size={ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />
        </button>
      </header>
      <div className="ox-side-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </aside>
  );
}
