"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { KRA_POINTS } from "@/lib/content";

const TARGET = 94;

const TRAIL = [
  { delta: +4, reason: "Sprint 24 closed with no QC errors", after: 94, when: "2 Nov" },
  { delta: -3, reason: "QC error — checkout regression", after: 90, when: "28 Oct" },
  { delta: +2, reason: "Daily reports filed all month", after: 93, when: "24 Oct" },
];

/**
 * The KRA score, given its own section because it is the part of OperixCRM
 * that corporate buyers ask about. The dial counts up once it scrolls into
 * view: the number is the claim, the trail beside it is the proof.
 */
export function KraProof() {
  const ref = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // Settling on the number is the point, so skip straight to it when
        // the visitor has asked for less motion.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setScore(TARGET);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          // Ease out cubic, so it settles rather than stopping dead.
          setScore(Math.round(TARGET * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const r = 86;
  const c = 2 * Math.PI * r;

  return (
    <div className="kra" ref={ref}>
      <div className="kra-dial-wrap">
        <svg className="kra-dial" viewBox="0 0 200 200" role="img" aria-label={`KRA score ${TARGET} out of 100`}>
          <defs>
            <linearGradient id="kra-arc" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#7b5cf0" />
              <stop offset=".55" stopColor="#2f63e8" />
              <stop offset="1" stopColor="#1fa3c8" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r={r} fill="none" stroke="#e9ecf7" strokeWidth="13" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="url(#kra-arc)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * score) / 100}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="kra-dial-mid">
          <b>{score}</b>
          <small>KRA score</small>
        </div>
        <span className="kra-badge">
          <ShieldCheck size={13} aria-hidden /> Audit-ready
        </span>
      </div>

      <div className="kra-copy">
        <span className="eyebrow">Proof, not opinion</span>
        <h2 className="h2 sm" id="kra-title">
          A KRA score every employee
          <br />
          can argue with
        </h2>
        <p className="lead">
          Appraisals usually come down to who remembers what. OperixCRM keeps a running score for every
          person, and each point is tied to the event that moved it.
        </p>
        <ul className="kra-points">
          {KRA_POINTS.map((p) => (
            <li key={p.title}>
              <b>{p.title}</b>
              <span>{p.body}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="kra-trail" aria-label="Recent KRA movements">
        {TRAIL.map((e, i) => (
          <li key={i} style={{ ["--delay" as string]: `${i * 110}ms` }}>
            <span className="kra-delta" data-up={e.delta > 0}>
              {e.delta > 0 ? <TrendingUp size={14} aria-hidden /> : <TrendingDown size={14} aria-hidden />}
              {e.delta > 0 ? `+${e.delta}` : e.delta}
            </span>
            <span className="kra-trail-body">
              <b>{e.reason}</b>
              <small>
                {e.when} · balance after {e.after}
              </small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
