"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Renders children on a fixed design canvas and scales it to the frame width,
 * so the dashboard mock keeps its exact proportions at any viewport.
 */
export function ScaleFrame({
  width,
  height,
  children,
  className,
}: {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => el.style.setProperty("--k", String(el.clientWidth / width));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} className={`scale-frame ${className ?? ""}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <div className="scale-canvas" style={{ width, height }}>
        {children}
      </div>
    </div>
  );
}
