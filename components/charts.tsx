/*
 * Hand-built SVG charts used by the dashboard mock and the feature cards.
 * Pure render functions: no state, safe in server and client components.
 */

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
/* Server and browser trig can differ in the last digit; round so hydration matches. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ---------------------------------------------------------------- gauge -- */

type GaugeProps = {
  /** Ticks lit, out of 31. */
  active?: number;
  value: string;
  label: string;
  className?: string;
  /** Draw the outer dotted rail, halo and end marker (dashboard style). */
  rich?: boolean;
  animate?: boolean;
};

export function Gauge({ active = 21, value, label, className, rich = false, animate = false }: GaugeProps) {
  const cx = 161;
  const cy = 218;
  const R = 145;
  const N = 31;
  const arc = (r: number) => `M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const ticks = Array.from({ length: N }, (_, i) => {
    const a = ((180 - i * 6) * Math.PI) / 180;
    const len = 75 - 17 * Math.sin((i * Math.PI) / (N - 1));
    const ri = R - len;
    const on = i < active;
    const t = i / Math.max(1, active - 1);
    const color = on
      ? `rgb(${Math.round(43 - 12 * t)},${Math.round(79 + 84 * t)},${Math.round(216 - 16 * t)})`
      : i < active + 6
        ? "#e9eefc"
        : "#ececef";
    return {
      x1: r2(cx + ri * Math.cos(a)),
      y1: r2(cy - ri * Math.sin(a)),
      x2: r2(cx + R * Math.cos(a)),
      y2: r2(cy - R * Math.sin(a)),
      color,
      glow: on && i > active - 6,
    };
  });
  const ea = ((180 - (active - 1) * 6) * Math.PI) / 180;

  return (
    <svg className={className} viewBox="0 0 322 250" role="img" aria-label={`${label}: ${value}`}>
      <defs>
        <radialGradient id="gauge-halo" cx="50%" cy="100%" r="70%">
          <stop offset="0" stopColor="#4a7cf0" stopOpacity=".16" />
          <stop offset="1" stopColor="#4a7cf0" stopOpacity="0" />
        </radialGradient>
        <filter id="gauge-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {rich && (
        <>
          <path d={`${arc(R + 14)}Z`} fill="url(#gauge-halo)" />
          <path d={arc(R + 16)} fill="none" stroke="#e3e8f8" strokeWidth="1" strokeDasharray="2 5" strokeLinecap="round" />
          <path d={arc(R - 86)} fill="none" stroke="#eef0f8" strokeWidth="1" />
          <g filter="url(#gauge-glow)">
            {ticks
              .filter((t) => t.glow)
              .map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.color} strokeWidth="13" strokeLinecap="round" opacity=".55" />
              ))}
          </g>
        </>
      )}
      {ticks.map((t, i) => (
        <line
          key={i}
          className={animate ? "gauge-tick" : undefined}
          style={animate ? { animationDelay: `${i * 28}ms` } : undefined}
          pathLength={1}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.color}
          strokeWidth="13"
          strokeLinecap="round"
        />
      ))}
      {rich && (
        <circle cx={r2(cx + (R + 16) * Math.cos(ea))} cy={r2(cy - (R + 16) * Math.sin(ea))} r="5" fill="#fff" stroke="#1fa3c8" strokeWidth="2.5" />
      )}
      <text x={cx} y={cy - 22} textAnchor="middle" fontSize="40" fontWeight="500" letterSpacing="-1" fill="#0b0b12">
        {value}
      </text>
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill="#8a8a98">
        {label}
      </text>
    </svg>
  );
}

/* ----------------------------------------------------------- dot matrix -- */

export const SALES = [1, 2, 2, 3, 4, 2, 2, 3, 2, 2, 4, 5, 4, 3, 6, 8, 5, 4, 2, 2, 3, 4, 1, 1, 3, 4, 5, 3, 4, 6];
export const TOTAL = [2, 4, 4, 5, 5, 4, 4, 5, 4, 3, 6, 7, 6, 5, 8, 9, 6, 5, 4, 3, 5, 6, 3, 2, 5, 6, 10, 5, 6, 8];

type DotProps = {
  lit: number[];
  total: number[];
  /** Dot diameter and spacing in viewBox units. */
  size?: number;
  pitch?: number;
  /** Column to keep bright while the rest dim. */
  focus?: number | null;
  className?: string;
  label: string;
};

export function DotMatrix({ lit, total, size = 17, pitch = 18.8, focus = null, className, label }: DotProps) {
  const rows = Math.max(...total);
  const w = (total.length - 1) * pitch + size;
  const h = (rows - 1) * (size + 1) + size;
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} preserveAspectRatio="xMidYMax meet">
      {total.map((n, i) => {
        const c = mix([108, 99, 232], [60, 154, 232], i / (total.length - 1));
        const dim = focus !== null && focus !== i;
        return (
          <g key={i} opacity={dim ? 0.4 : 1} style={{ transition: "opacity .2s" }}>
            {Array.from({ length: n }, (_, r) => (
              <circle
                key={r}
                cx={i * pitch + size / 2}
                cy={h - size / 2 - r * (size + 1)}
                r={size / 2}
                fill={r < lit[i] ? `rgb(${c})` : "#e7ebfa"}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ----------------------------------------------------------- leaderboard -- */

type BarsProps = {
  data: { value: number; label: string }[];
  className?: string;
  label: string;
};

const BAR_STYLES = [
  { bg: "linear-gradient(135deg,#2b4fd8,#3b8be8)", fg: "#fff", stripes: true },
  { bg: "linear-gradient(#dfe5fb,#eef1fd)", fg: "#3b6fe0", stripes: false },
  { bg: "linear-gradient(#cdeee6,#e6f7f2)", fg: "#1fa3a0", stripes: false },
];

export function Bars({ data, className, label }: BarsProps) {
  return (
    <div className={`bars ${className ?? ""}`} role="img" aria-label={label}>
      <div className="bars-axis" aria-hidden>
        {[150, 125, 100, 75, 50, 25, 0].map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
      <div className="bars-plot">
        {data.map((d, i) => (
          <div
            key={d.label}
            className={`bar ${BAR_STYLES[i].stripes ? "bar-striped" : ""}`}
            style={{ height: `${(d.value / 150) * 100}%`, background: BAR_STYLES[i].bg, color: BAR_STYLES[i].fg, ["--grow-delay" as string]: `${i * 90}ms` }}
          >
            <b>{d.value}</b>
          </div>
        ))}
      </div>
      <div className="bars-legend" aria-hidden>
        {data.map((d, i) => (
          <span key={d.label}>
            <i style={{ background: i === 0 ? "#2f63e8" : i === 1 ? "#dfe5fb" : "#cdeee6" }} />
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ sparkline -- */

export function Sparkline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 60" aria-hidden preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e5384d" stopOpacity=".14" />
          <stop offset="1" stopColor="#e5384d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 35C15 20 22 45 38 30S60 10 75 28 100 48 115 33 140 15 155 30 185 45 200 32V60H0Z" fill="url(#spark-fill)" />
      <path d="M0 35C15 20 22 45 38 30S60 10 75 28 100 48 115 33 140 15 155 30 185 45 200 32" fill="none" stroke="#e5384d" strokeWidth="1.6" />
      <circle cx="200" cy="32" r="3" fill="#e5384d" />
    </svg>
  );
}
