/*
 * Generates the glossy silk ribbons behind the hero and CTA as static SVGs in
 * public/ribbons. Run `npm run ribbons` after changing a shape.
 *
 * A ribbon is a bundle of thin strands laid across a twisting band: each
 * strand sits at a fixed position across the band's width, and the band
 * rotates along its length, so it narrows where it turns edge-on. Strands are
 * shaded by their position across the band, then tinted violet-to-cyan along
 * its length. Stacked, they read as folded satin with a sheen, which a single
 * blurred blob (the HTML template's approach) cannot.
 *
 * They are files rather than inline JSX because the path data is ~60KB per
 * ribbon: inline, it would ship twice (HTML and React payload) per instance.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHAPES = {
  // c: centerline cubic bezier; w: widest band width; phi/turns: the twist.
  hero: { c: [[-80, 600], [220, 330], [430, 690], [800, 360]], w: 340, phi: 0.1, turns: 0.62 },
  cta: { c: [[-80, 260], [230, 560], [480, 180], [800, 440]], w: 300, phi: 0.15, turns: 0.6 },
};

const SAMPLES = 28;
const STRANDS = 64;

const bez = (p, s) => {
  const u = 1 - s;
  const a = u * u * u, b = 3 * u * u * s, c = 3 * u * s * s, d = s * s * s;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
};

const tangent = (p, s) => {
  const u = 1 - s;
  const x = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * s * (p[2][0] - p[1][0]) + 3 * s * s * (p[3][0] - p[2][0]);
  const y = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * s * (p[2][1] - p[1][1]) + 3 * s * s * (p[3][1] - p[2][1]);
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};

// Strand colour by position across the band: dark edge, bright crease, mid body.
const DARK = [24, 36, 170];
const MID = [44, 82, 232];
const LIGHT = [176, 196, 255];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

function shade(t) {
  const crease = Math.exp(-((t - 0.32) ** 2) / 0.006);
  const body = 0.5 + 0.5 * Math.sin(t * Math.PI);
  return hex(mix(mix(DARK, MID, body), LIGHT, crease * 0.85));
}

function strands(shape) {
  const frames = Array.from({ length: SAMPLES + 1 }, (_, k) => {
    const s = k / SAMPLES;
    const [x, y] = bez(shape.c, s);
    const [tx, ty] = tangent(shape.c, s);
    const width = shape.w * (0.55 + 0.45 * Math.sin(s * Math.PI));
    const twist = Math.cos(shape.phi + s * shape.turns * Math.PI);
    return { x, y, nx: -ty, ny: tx, span: width * twist };
  });
  return Array.from({ length: STRANDS }, (_, i) => {
    const t = i / (STRANDS - 1);
    const off = t - 0.5;
    const d = frames
      .map((f, k) => `${k ? "L" : "M"}${Math.round(f.x + f.nx * off * f.span)} ${Math.round(f.y + f.ny * off * f.span)}`)
      .join("");
    return { d, color: shade(t) };
  });
}

function svg(shape) {
  const lines = strands(shape);
  const haze = lines.filter((_, i) => i % 8 === 4).map((l) => `<path d="${l.d}"/>`).join("");
  // Geometry once in <defs>; both passes reference it, so each <use> can set
  // its own stroke (a stroke on the path itself would block the tint pass).
  const geom = lines.map((l, i) => `<path id="s${i}" d="${l.d}"/>`).join("");
  const body = lines.map((l, i) => `<use href="#s${i}" stroke="${l.color}"/>`).join("");
  const tint = lines.map((_, i) => `<use href="#s${i}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
<defs>${geom}
<linearGradient id="tint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8f7cff"/><stop offset=".45" stop-color="#3651ff" stop-opacity="0"/><stop offset="1" stop-color="#35c0f0"/></linearGradient>
<filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.4"/></filter>
<filter id="haze" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="28"/></filter>
</defs>
<g filter="url(#haze)" opacity=".45" fill="none" stroke="#3a5cf0" stroke-width="30">${haze}</g>
<g filter="url(#soft)" fill="none" stroke-width="4.4" stroke-linejoin="round">${body}<g opacity=".55" stroke="url(#tint)">${tint}</g></g>
</svg>
`;
}

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "ribbons");
mkdirSync(out, { recursive: true });
for (const [name, shape] of Object.entries(SHAPES)) {
  const file = join(out, `${name}.svg`);
  writeFileSync(file, svg(shape));
  console.log(`wrote ${file}`);
}
