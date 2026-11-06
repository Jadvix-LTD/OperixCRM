"use client";

/*
 * The dashboard, exactly as the reference draws it.
 *
 * Three cards across the top — a gradient hero, a plain figure, a segmented
 * meter — then a wide dot-matrix chart beside the gauge. This is the shape
 * every OperixCRM overview follows, and the one shown on the marketing site,
 * so the two can be compared side by side and match.
 *
 * Figures here are placeholders with the real shapes; phase 3 swaps the data
 * source and touches none of this layout.
 */

import { useState } from "react";
import { ArrowUpRight, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardHead,
  DotMatrix,
  Gauge,
  ICON_SIZE,
  ICON_STROKE,
} from "@/components/ui";
import { PageHead } from "@/components/shell/PageHead";
import { useSession } from "@/lib/access/session";

const SALES = [1, 2, 2, 3, 4, 2, 2, 3, 2, 2, 4, 5, 4, 3, 6, 8, 5, 4, 2, 2, 3, 4, 1, 1, 3, 4, 5, 3, 4, 6];
const TOTAL = [2, 4, 4, 5, 5, 4, 4, 5, 4, 3, 6, 7, 6, 5, 8, 9, 6, 5, 4, 3, 5, 6, 3, 2, 5, 6, 10, 5, 6, 8];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PEAK = 15;

const FILTERS = [
  { id: "summary", label: "Summary" },
  { id: "insight", label: "Insight" },
  { id: "service", label: "Service" },
  { id: "analytic", label: "Analytic" },
  { id: "target", label: "Target" },
];

function CircleButton({ label, glass = false }: { label: string; glass?: boolean }) {
  return (
    <button type="button" className="ox-circ" aria-label={label}>
      {glass ? (
        <ArrowUpRight size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
      ) : (
        <MoreHorizontal size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
      )}
    </button>
  );
}

export function OverviewScreen() {
  const { viewer, scopeFor } = useSession();
  const [filter, setFilter] = useState("summary");
  const [col, setCol] = useState(PEAK);

  const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");
  const peak = col === PEAK;
  const scope = scopeFor("dashboard");

  return (
    <>
      <PageHead
        title="Company Overview"
        sub={
          scope === "all"
            ? "Every company, branch and portal in one view."
            : `What ${viewer.name.split(" ")[0]} can see, scoped to ${scope ?? "nothing"}.`
        }
        filters={FILTERS}
        activeFilter={filter}
        onFilter={setFilter}
      />

      {/* ------------------------------------------------- three figures -- */}
      <div className="ox-grid-3">
        <Card className="ox-card-hero">
          <svg className="ox-card-hero-waves" viewBox="0 0 323 169" preserveAspectRatio="none" aria-hidden>
            <path d="M120 169C170 110 220 60 323 95V169Z" fill="rgba(255,255,255,.16)" />
            <path d="M0 70C60 20 110 50 150 100S250 150 323 120V169H0Z" fill="rgba(255,255,255,.07)" />
          </svg>
          <CardHead title="Monthly Revenue" action={<CircleButton label="Open revenue" glass />} />
          <p className="ox-stat-big">£48,260</p>
          <p className="ox-stat-delta">
            <b>+4.7%</b> Than last month
          </p>
        </Card>

        <Card>
          <CardHead title="Tasks Delivered" action={<CircleButton label="Open delivery" glass />} />
          <p className="ox-stat-big">129,521</p>
          <p className="ox-stat-delta" data-tint="green">
            <b>+1.2%</b> Than last month
          </p>
        </Card>

        <Card>
          <CardHead title="Payroll Balance" action={<CircleButton label="Payroll options" />} />
          <p className="ox-stat-mid">£9,421,642</p>
          <div className="ox-meter">
            <i style={{ width: "62%" }} />
            <i style={{ width: "16%" }} />
          </div>
          <div className="ox-legend">
            <span><i style={{ background: "var(--ox-t-blue)" }} />Paid out</span>
            <span><i style={{ background: "var(--ox-t-purple)" }} />Scheduled</span>
            <span><i style={{ background: "var(--ox-t-blue-bg)" }} />Budget</span>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------ chart and gauge -- */}
      <div className="ox-grid-wide">
        <Card className="ox-chart-card">
          <CardHead
            title="Delivery Summary"
            action={
              <span style={{ display: "flex", gap: "var(--ox-s-2)", alignItems: "center" }}>
                <button type="button" className="ox-pill">
                  This Year <ChevronDown size={ICON_SIZE.xs} strokeWidth={ICON_STROKE} aria-hidden />
                </button>
                <CircleButton label="Chart options" />
              </span>
            }
          />
          <div className="ox-legend" style={{ marginTop: "var(--ox-s-2)" }}>
            <span><i style={{ background: "var(--ox-t-blue)" }} />Closed</span>
            <span><i style={{ background: "var(--ox-t-blue-bg)" }} />Planned</span>
          </div>

          <div className="ox-plot">
            {["100K", "70K", "50K", "25K", "0"].map((k, i) => (
              <span className="ox-gridline" key={k} style={{ top: `${i * 24}%` }}>
                <em>{k}</em>
              </span>
            ))}
            <DotMatrix
              lit={SALES}
              total={TOTAL}
              focus={col}
              size={14}
              pitch={16}
              label="Tasks closed per month"
              className="ox-plot-dots"
            />
            <span className="ox-cursor" style={{ left: `${(col / 29) * 92 + 5}%` }} />
            <div className="ox-tip" style={{ left: `${(col / 29) * 92 + (col > 18 ? -15 : 7)}%` }}>
              <span><i style={{ background: "var(--ox-t-blue)" }} />Closed</span>
              <b>{peak ? "70,901" : fmt((SALES[col] / SALES[PEAK]) * 70901)}</b>
              <span><i style={{ background: "var(--ox-t-blue-bg)" }} />Planned</span>
              <b>{peak ? "92,921" : fmt((TOTAL[col] / TOTAL[PEAK]) * 92921)}</b>
            </div>
            {SALES.map((_, i) => (
              <span
                key={i}
                className="ox-hit"
                style={{ left: `${(i / 29) * 92 + 5}%` }}
                onMouseEnter={() => setCol(i)}
              />
            ))}
          </div>

          <div className="ox-months">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="QC Pass Rate" action={<CircleButton label="Open quality" glass />} />
          <Gauge active={21} value="8,214" label="Items signed off" animate className="ox-gauge-lg" />
          <div className="ox-legend" style={{ justifyContent: "center" }}>
            <span><i style={{ background: "var(--ox-t-blue)" }} />Approved</span>
            <span><i style={{ background: "var(--ox-t-blue-bg)" }} />Sent back</span>
            <span><i style={{ background: "var(--ox-hairline)" }} />Pending</span>
          </div>
          <p className="ox-note-strip">
            <b>+12.2%</b> QC approved 2,921 more items than last month
          </p>
        </Card>
      </div>
    </>
  );
}
