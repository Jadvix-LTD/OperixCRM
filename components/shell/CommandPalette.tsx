"use client";

/*
 * Ctrl K.
 *
 * The one place in the product that floats above the page — and it is a
 * command surface, not a dialog: it holds no form, loses nothing when
 * dismissed, and never asks you to confirm anything. The no-popup rule is
 * about work happening in a layer you can lose, which this is not.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "@/components/ui";
import { MODULES } from "@/lib/access/modules";
import { useSession } from "@/lib/access/session";

/**
 * Mounted only while it is open — the parent renders it conditionally. That
 * is why there is no effect resetting the query: a fresh mount is already
 * fresh, and autoFocus puts the caret in the field without a timeout.
 */
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const { modules } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dev = process.env.NODE_ENV === "development";

  const held = useMemo(() => new Set(modules), [modules]);
  const results = useMemo(() => {
    const available = MODULES.filter((m) => held.has(m.id) && (dev || !m.devOnly));
    const q = query.trim().toLowerCase();
    if (!q) return available;
    return available.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.group.toLowerCase().includes(q) ||
        m.blurb.toLowerCase().includes(q),
    );
  }, [held, query, dev]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div
      className="ox-palette-scrim"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ox-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="ox-palette-field">
          <Search size={ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />
          <input
            /* Safe here: the palette is opened deliberately and exists to be typed into. */
            autoFocus
            value={query}
            placeholder="Search modules…"
            aria-label="Search modules"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => (results.length ? (i + 1) % results.length : 0));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                go(results[active].href);
              }
            }}
          />
          <kbd>Esc</kbd>
        </div>

        <ul className="ox-palette-list" role="listbox" aria-label="Modules">
          {results.length === 0 && <li className="ox-palette-empty">Nothing matches “{query}”.</li>}
          {results.map((m, i) => {
            const Icon = m.icon;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  id={`cmd-${m.id}`}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "is-active" : undefined}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(m.href)}
                >
                  <Icon size={ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />
                  <span>
                    <b>{m.label}</b>
                    <small>{m.blurb}</small>
                  </span>
                  <em>{m.group}</em>
                  {i === active && <CornerDownLeft size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
