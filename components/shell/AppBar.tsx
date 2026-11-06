"use client";

/*
 * The top bar — logo, group pills, tools.
 *
 * This is the Syncrowave chrome the whole product is modelled on: no
 * sidebar, a centred row of rounded pills with the active one in near-black,
 * and three controls on the right. The two-tier pattern from the reference
 * maps exactly onto our structure —
 *
 *   tier 1 (here)        the seven module groups
 *   tier 2 (PageHead)    the modules inside the active group
 *
 * which is how 23 modules fit a bar built for five.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Avatar, ICON_SIZE, ICON_STROKE } from "@/components/ui";
import { LogoMark } from "@/components/Logo";
import { MODULES, MODULE_GROUPS, moduleForPath, type ModuleGroup } from "@/lib/access/modules";
import { useSession } from "@/lib/access/session";
import { RoleSwitcher } from "./RoleSwitcher";

export function AppBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { modules, viewer } = useSession();

  const held = new Set(modules);
  const dev = process.env.NODE_ENV === "development";
  const visible = MODULES.filter((m) => held.has(m.id) && (dev || !m.devOnly));
  const active = moduleForPath(pathname)?.group;

  // Only groups the viewer actually holds something in.
  const groups = MODULE_GROUPS.filter((g) => visible.some((m) => m.group === g));

  const openGroup = (g: ModuleGroup) => {
    const first = visible.find((m) => m.group === g);
    if (first) router.push(first.href);
  };

  return (
    <header className="ox-appbar">
      <Link href="/overview/dashboard" className="ox-appbar-brand" aria-label="OperixCRM home">
        <LogoMark size={22} />
        <span>OperixCRM</span>
      </Link>

      <nav className="ox-pillnav" aria-label="Sections">
        {groups.map((g) => (
          <button
            key={g}
            type="button"
            className={g === active ? "is-on" : undefined}
            aria-current={g === active ? "page" : undefined}
            onClick={() => openGroup(g)}
          >
            {g}
          </button>
        ))}
      </nav>

      <div className="ox-appbar-tools">
        <button type="button" className="ox-circ" onClick={onOpenPalette} aria-label="Search — Ctrl K">
          <Search size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
        </button>
        <button type="button" className="ox-circ" aria-label="Notifications — 3 unread">
          <Bell size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
          <i className="ox-circ-ping" aria-hidden />
        </button>
        <RoleSwitcher />
        <span className="ox-appbar-me" title={viewer.name}>
          <Avatar name={viewer.name} size={37} />
        </span>
      </div>
    </header>
  );
}
