"use client";

/*
 * Development only.
 *
 * Ten roles would otherwise mean ten logins to check one screen. This is the
 * single biggest time-saver in phase 1 — and it renders nothing at all once
 * `setViewer` is absent, which is every build that is not a dev build.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, FlaskConical } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "@/components/ui";
import { DEMO_VIEWERS, useSession } from "@/lib/access/session";
import { ROLES, landingFor } from "@/lib/access/roles";

export function RoleSwitcher() {
  const { viewer, setViewer } = useSession();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!setViewer) return null;

  return (
    <div
      className="ox-roles"
      ref={wrap}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="ox-roles-btn">
        <FlaskConical size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
        <span>{ROLES[viewer.roles[0]].label}</span>
        <ChevronDown size={ICON_SIZE.xs} strokeWidth={ICON_STROKE} aria-hidden />
      </button>

      {open && (
        <div className="ox-roles-menu">
          <p className="ox-roles-note">
            Development only. Switches who the shell thinks you are, so every role can be walked
            through without ten logins.
          </p>
          <ul>
            {DEMO_VIEWERS.map((v) => {
              const role = ROLES[v.roles[0]];
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    className={v.id === viewer.id ? "is-on" : undefined}
                    onClick={() => {
                      setViewer(v);
                      setOpen(false);
                      // Land somewhere the NEW role can open — the page you
                      // were on may not be theirs. Computed from v, not from
                      // the session, which still holds the old viewer here.
                      router.push(landingFor(v.roles));
                    }}
                  >
                    <span>
                      <b>{role.label}</b>
                      <small>{v.name} · {v.branch}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
