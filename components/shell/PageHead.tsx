"use client";

/*
 * The title block and the second pill row.
 *
 * Straight from the reference: a large tight title with a grey sub-line, an
 * Export Data pill and a gear on the right, then a row of filter pills with
 * the date range on the far right.
 *
 * Tier 2 of the navigation lives here — the modules inside the active group.
 * A breadcrumb appears ONLY when you are deeper than a module root, because
 * at the top level there is nothing to trace and the reference shows none.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { CalendarDays, Download, MoreHorizontal, Settings } from "lucide-react";
import { Breadcrumb, ICON_SIZE, ICON_STROKE } from "@/components/ui";
import { MODULES, moduleForPath } from "@/lib/access/modules";
import { useSession } from "@/lib/access/session";
import { crumbsFor } from "./crumbs";

export function PageHead({
  title,
  sub,
  actions,
  filters,
  activeFilter,
  onFilter,
}: {
  title: string;
  sub?: string;
  /** Replaces Export Data + gear when a page needs its own actions. */
  actions?: ReactNode;
  /** A page's own sub-views. Omitted, the row shows sibling modules instead. */
  filters?: { id: string; label: string }[];
  activeFilter?: string;
  onFilter?: (id: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { modules } = useSession();

  const current = moduleForPath(pathname);
  const held = new Set(modules);
  const dev = process.env.NODE_ENV === "development";

  const siblings = current
    ? MODULES.filter((m) => m.group === current.group && held.has(m.id) && (dev || !m.devOnly))
    : [];

  const crumbs = crumbsFor(pathname);
  // Group › Module is the whole trail at a module root; only show the
  // breadcrumb once there is something past it.
  const deep = crumbs.length > 2;

  return (
    <header className="ox-pagehead">
      {deep && (
        <Breadcrumb items={crumbs} render={(c, children) => <Link href={c.href ?? "#"}>{children}</Link>} />
      )}

      <div className="ox-pagehead-row">
        <div className="ox-pagehead-title">
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
        <div className="ox-pagehead-actions">
          {actions ?? (
            <>
              <button type="button" className="ox-pill">
                <Download size={ICON_SIZE.xs} strokeWidth={ICON_STROKE} aria-hidden />
                Export Data
              </button>
              <button type="button" className="ox-circ" aria-label="Page settings">
                <Settings size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="ox-pagehead-row ox-pagehead-filters">
        <nav className="ox-pillrow" aria-label={filters ? "Views" : "Modules in this section"}>
          {filters
            ? filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={f.id === activeFilter ? "is-on" : undefined}
                  aria-current={f.id === activeFilter ? "true" : undefined}
                  onClick={() => onFilter?.(f.id)}
                >
                  {f.label}
                </button>
              ))
            : siblings.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={m.id === current?.id ? "is-on" : undefined}
                  aria-current={m.id === current?.id ? "page" : undefined}
                  onClick={() => router.push(m.href)}
                >
                  {m.label}
                </button>
              ))}
        </nav>

        <div className="ox-daterange">
          <button type="button" className="ox-circ" aria-label="Pick a date range">
            <CalendarDays size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
          </button>
          <button type="button" className="ox-pill">1 Jun 2026</button>
          <button type="button" className="ox-pill">7 Nov 2026</button>
          <button type="button" className="ox-circ" aria-label="More options">
            <MoreHorizontal size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
