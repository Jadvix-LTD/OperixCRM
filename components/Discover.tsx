"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { DISCOVER_TABS } from "@/lib/content";
import { DashboardApp, SCREEN_MAP, type ScreenId } from "./dash/DashboardApp";
import { ScaleFrame } from "./ScaleFrame";

const ROTATE_MS = 9000;

/**
 * Three tabs that switch the tablet between the leadership, maker and
 * performance views. Rotates on its own until the visitor takes over, and
 * pauses while the pointer or focus is inside.
 */
export function Discover() {
  const [index, setIndex] = useState(0);
  // The mock header can reach screens no tab covers, so the screen is held
  // here rather than derived from the tab, and the tab follows when it can.
  const [screen, setScreen] = useState<ScreenId>(DISCOVER_TABS[0].screen);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!auto || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      const next = (index + 1) % DISCOVER_TABS.length;
      setIndex(next);
      setScreen(DISCOVER_TABS[next].screen);
    }, ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [index, auto, paused]);

  const pick = (i: number) => {
    setAuto(false);
    setIndex(i);
    setScreen(DISCOVER_TABS[i].screen);
  };

  const onKey = (e: KeyboardEvent) => {
    const n = DISCOVER_TABS.length;
    const next = e.key === "ArrowRight" ? (index + 1) % n : e.key === "ArrowLeft" ? (index - 1 + n) % n : null;
    if (next === null) return;
    e.preventDefault();
    pick(next);
    tabs.current[next]?.focus();
  };

  const def = SCREEN_MAP.get(screen)!;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="tablet discover-shot" id="discover-panel" role="tabpanel" aria-label={def.title}>
        <ScaleFrame width={1034} height={734}>
          <DashboardApp
            screen={screen}
            live
            onScreenChange={(id) => {
              setAuto(false);
              setScreen(id);
              const i = DISCOVER_TABS.findIndex((t) => t.screen === id);
              if (i >= 0) setIndex(i);
            }}
          />
        </ScaleFrame>
      </div>
      <div className="tabs" role="tablist" aria-label="OperixCRM views" onKeyDown={onKey}>
        {DISCOVER_TABS.map((t, i) => (
          <button
            key={t.screen}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            className="tab"
            aria-selected={i === index && t.screen === screen}
            aria-controls="discover-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => pick(i)}
          >
            <b>{t.title}</b>
            {t.body}
            <span
              key={`${index}-${paused}`}
              className={`tab-progress ${auto && !paused ? "run" : ""}`}
              style={{ ["--dur" as string]: `${ROTATE_MS}ms` }}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
}
