"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

const ROTATE_MS = 8000;

/** One quote at a time, set in type. No portrait — the words carry it. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;
  const t = TESTIMONIALS[i];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setI((v) => (v + 1) % n), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [i, paused, n]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <figure className="quote-card" aria-roledescription="carousel" aria-label="What the Jadvix team says">
        <Quote className="quote-mark" size={56} aria-hidden />
        <div key={i} aria-live="polite" className="quote-body">
          <blockquote className="fade-swap">{t.quote}</blockquote>
          <figcaption className="fade-swap">
            <cite>
              <b>{t.name}</b>
              <span>{t.role}</span>
            </cite>
          </figcaption>
        </div>
      </figure>
      <div className="quote-nav">
        <button className="quote-arrow" aria-label="Previous quote" onClick={() => setI((i - 1 + n) % n)}>
          <ChevronLeft size={16} />
        </button>
        <div className="quote-track">
          {TESTIMONIALS.map((q, k) => (
            <button key={q.name} aria-label={`Quote from ${q.name}`} aria-current={k === i ? "true" : undefined} onClick={() => setI(k)} />
          ))}
        </div>
        <button className="quote-arrow" aria-label="Next quote" onClick={() => setI((i + 1) % n)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
