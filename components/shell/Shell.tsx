"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SessionProvider } from "@/lib/access/session";
import { AppBar } from "./AppBar";
import { CommandPalette } from "./CommandPalette";

/**
 * The workspace shell.
 *
 * One layout for every role. The reference has no sidebar: the whole of the
 * navigation is the two pill rows, which is why this is a column rather than
 * a grid.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ShellFrame>{children}</ShellFrame>
    </SessionProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="ox-app">
      <a className="ox-skip-link" href="#ox-main">
        Skip to content
      </a>

      <AppBar onOpenPalette={() => setPalette(true)} />

      <main className="ox-main" id="ox-main">
        {children}
      </main>

      {palette && <CommandPalette onClose={() => setPalette(false)} />}
    </div>
  );
}
