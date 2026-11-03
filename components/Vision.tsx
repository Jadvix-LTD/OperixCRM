"use client";

import { useEffect, useRef, useState } from "react";
import { VISION_TEXT } from "@/lib/content";

const WORDS = VISION_TEXT.split(" ");

/** The blue band: words light up one by one as the band scrolls through. */
export function Vision() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(3);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.6)));
      setLit(Math.round(WORDS.length * p) + 3);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="vision" id="vision" aria-label="Our vision">
      <div className="vision-glow" aria-hidden />
      <p className="vision-text" ref={ref} aria-label={VISION_TEXT}>
        {WORDS.map((w, i) => (
          <span key={i} className={i < lit ? "on" : undefined} aria-hidden>
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
