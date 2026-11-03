"use client";

import { Fragment, useRef, useState, type KeyboardEvent } from "react";
import { SHOWCASE } from "@/lib/content";
import { DashboardApp, SCREEN_MAP, type ScreenId } from "./dash/DashboardApp";
import { ScaleFrame } from "./ScaleFrame";

/**
 * Pick a module on the left, see that module's real screen on the right —
 * and drive it. The same component the hero shows, so what a visitor plays
 * with here is the product, not a picture of it.
 */
export function ModuleShowcase() {
  const [screen, setScreen] = useState<ScreenId>("clock");
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const i = SHOWCASE.findIndex((m) => m.screen === screen);
  const active = SHOWCASE[i] ?? SHOWCASE[0];

  const onKey = (e: KeyboardEvent) => {
    const n = SHOWCASE.length;
    const next =
      e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowUp" ? (i - 1 + n) % n : null;
    if (next === null) return;
    e.preventDefault();
    setScreen(SHOWCASE[next].screen);
    items.current[next]?.focus();
  };

  return (
    <div className="showcase">
      <div className="showcase-list" role="tablist" aria-orientation="vertical" aria-label="Modules" onKeyDown={onKey}>
        {SHOWCASE.map((m, k) => {
          const Icon = SCREEN_MAP.get(m.screen)!.icon;
          const on = m.screen === screen;
          // Twenty-four rows need signposting, so each group announces itself.
          const heading = k === 0 || SHOWCASE[k - 1].group !== m.group;
          return (
            <Fragment key={m.screen}>
            {heading && <p className="showcase-group-head" role="presentation">{m.group}</p>}
            <button
              ref={(el) => {
                items.current[k] = el;
              }}
              role="tab"
              aria-selected={on}
              aria-controls="showcase-panel"
              tabIndex={on ? 0 : -1}
              className={`showcase-item ${on ? "on" : ""}`}
              onClick={() => setScreen(m.screen)}
              onMouseEnter={() => setScreen(m.screen)}
            >
              <span className="showcase-ic">
                <Icon size={17} strokeWidth={1.7} aria-hidden />
              </span>
              <span className="showcase-copy">
                <b>{m.name}</b>
                <small>{m.body}</small>
              </span>
            </button>
            </Fragment>
          );
        })}
      </div>

      <div className="showcase-stage">
        <div className="showcase-caption" key={active.screen}>
          <b>{active.name}</b>
          <span>{active.hint}</span>
        </div>
        <div className="tablet" id="showcase-panel" role="tabpanel" aria-label={`${active.name} preview`}>
          <ScaleFrame width={1034} height={734}>
            <DashboardApp screen={screen} live onScreenChange={setScreen} />
          </ScaleFrame>
        </div>
      </div>
    </div>
  );
}
