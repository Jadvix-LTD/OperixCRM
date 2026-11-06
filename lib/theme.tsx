"use client";

/*
 * Night mode.
 *
 * Three states, not two: `light`, `dark` and `system`. "System" is the
 * default because a tool people sit in for eight hours should follow the
 * machine they are sitting at, but a deliberate choice must stick — so the
 * choice is stored and only `system` listens to the OS.
 *
 * The flash of the wrong theme is dealt with by THEME_SCRIPT below, which
 * runs before paint. Without it a dark-mode user sees a white page for one
 * frame on every navigation, which is the single most noticeable bug a
 * theme switcher can have.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeChoice = "light" | "dark" | "system";
export type Resolved = "light" | "dark";

const KEY = "operix-theme";

/**
 * Inlined in <head>, before any paint.
 *
 * Deliberately tiny and dependency-free: it reads the stored choice, falls
 * back to the OS, and writes the attribute the token file keys off. It must
 * never throw — a private window can make localStorage itself throw on read.
 */
export const THEME_SCRIPT = `(function(){try{
var c=localStorage.getItem("${KEY}")||"system";
var d=c==="dark"||(c==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
document.documentElement.dataset.theme=d?"dark":"light";
}catch(e){document.documentElement.dataset.theme="light";}})();`;

type ThemeValue = {
  choice: ThemeChoice;
  resolved: Resolved;
  setChoice: (c: ThemeChoice) => void;
  /** Flips between light and dark, leaving "system" behind deliberately. */
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

function systemIsDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function apply(resolved: Resolved) {
  document.documentElement.dataset.theme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  /*
   * Starts at "system" on both sides of hydration. The real stored value is
   * read in an effect, which is one frame later than THEME_SCRIPT has
   * already painted — so the page is correct from the first frame and React
   * never renders a different tree on the server than in the browser.
   */
  const [choice, setChoiceState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<Resolved>("light");

  useEffect(() => {
    let stored: ThemeChoice = "system";
    try {
      stored = (localStorage.getItem(KEY) as ThemeChoice) ?? "system";
    } catch {
      // Private window, or site data blocked. "system" is a fine default.
    }
    setChoiceState(stored);
    setResolved(stored === "system" ? (systemIsDark() ? "dark" : "light") : stored);
  }, []);

  // Only "system" follows the OS; an explicit choice must not be overridden.
  useEffect(() => {
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next: Resolved = mq.matches ? "dark" : "light";
      setResolved(next);
      apply(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  const setChoice = useCallback((next: ThemeChoice) => {
    const r: Resolved = next === "system" ? (systemIsDark() ? "dark" : "light") : next;
    setChoiceState(next);
    setResolved(r);
    apply(r);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Not storing it only costs the choice on the next load.
    }
  }, []);

  const value = useMemo<ThemeValue>(
    () => ({
      choice,
      resolved,
      setChoice,
      toggle: () => setChoice(resolved === "dark" ? "light" : "dark"),
    }),
    [choice, resolved, setChoice],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
