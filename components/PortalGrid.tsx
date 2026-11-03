"use client";

import { useState, type PointerEvent } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Code2,
  Crown,
  Flag,
  GraduationCap,
  Handshake,
  LineChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PORTALS } from "@/lib/content";
import { Reveal } from "./Reveal";

const ICONS: Record<string, LucideIcon> = {
  command: Crown,
  management: Briefcase,
  leads: Flag,
  makers: Code2,
  quality: BadgeCheck,
  sales: LineChart,
  student: GraduationCap,
  client: Handshake,
};

/** Feeds the card's spotlight, which tracks the cursor. */
const track = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export function PortalGrid() {
  const [open, setOpen] = useState(0);

  return (
    <ul className="portal-grid" role="list">
      {PORTALS.map((p, i) => {
        const Icon = ICONS[p.id];
        return (
          <Reveal
            as="li"
            key={p.id}
            delay={i * 70}
            className={`portal ${i === 0 ? "wide feature" : ""} ${i === open ? "open" : ""}`}
            onPointerMove={track}
          >
            <article
              onMouseEnter={() => setOpen(i)}
              onFocusCapture={() => setOpen(i)}
            >
              <span className="portal-sweep" aria-hidden />
              <header className="portal-top">
                <span className="portal-icon">
                  <Icon size={20} strokeWidth={1.7} aria-hidden />
                </span>
                <span className="portal-seats">{p.seats}</span>
              </header>
              <h3>{p.name}</h3>
              <p className="portal-who">{p.who}</p>
              <p className="portal-body">{p.body}</p>
              <ul className="chips" aria-label={`${p.name} modules`}>
                {p.modules.map((m, k) => (
                  <li key={m} style={{ ["--k" as string]: `${k * 55}ms` }}>
                    {m}
                  </li>
                ))}
              </ul>
              <span className="portal-go" aria-hidden>
                <ArrowUpRight size={15} />
              </span>
            </article>
          </Reveal>
        );
      })}
    </ul>
  );
}
