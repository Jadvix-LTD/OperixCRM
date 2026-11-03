"use client";

/*
 * The module screens shown inside the product mock.
 *
 * Each one is a plausible OperixCRM page rebuilt from the modules the first
 * Jadvix CRM shipped — same figures, same vocabulary (KRA, consistency,
 * verdicts), redrawn in the new UI. They live on the fixed design canvas, so
 * sizes are design pixels; see ./ui.tsx.
 */

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarRange,
  CheckCircle2,
  Clock3,
  Coffee,
  Flame,
  Hourglass,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { Bars, DotMatrix, Gauge, SALES, Sparkline, TOTAL } from "../charts";
import { Avatar, Bar, Card, CardHead, Chip, Dial, Figure, TINTS } from "./ui";

/* ------------------------------------------------------------ overview -- */

export function OverviewScreen({ live }: { live: boolean }) {
  const [col, setCol] = useState(15);
  const peak = col === 15;
  const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");

  return (
    <div className="dk-grid dk-overview">
      <Card className="dk-hero-card">
        <svg className="dk-hero-waves" viewBox="0 0 323 169" aria-hidden preserveAspectRatio="none">
          <path d="M120 169C170 110 220 60 323 95V169Z" fill="rgba(255,255,255,.16)" />
          <path d="M0 70C60 20 110 50 150 100S250 150 323 120V169H0Z" fill="rgba(255,255,255,.07)" />
        </svg>
        <CardHead title="Monthly Revenue" action={<span className="dk-ico glass"><ArrowUpRight size={14} /></span>} />
        <p className="dk-big">£48,260</p>
        <p className="dk-delta"><b className="glass">+4.7%</b> Than last month</p>
      </Card>

      <Card>
        <CardHead title="Tasks Delivered" action={<span className="dk-ico"><ArrowUpRight size={14} /></span>} />
        <p className="dk-big">129,521</p>
        <p className="dk-delta">
          <b style={{ background: TINTS.green.bg, color: TINTS.green.fg }}>+1.2%</b> Than last month
        </p>
      </Card>

      <Card>
        <CardHead title="Payroll Balance" action={<span className="dk-ico"><MoreHorizontal size={14} /></span>} />
        <p className="dk-mid">£9,421,642</p>
        <div className="dk-meter">
          <i style={{ width: "62%" }} />
          <i style={{ width: "16%" }} />
        </div>
        <div className="dk-legend">
          <span><i style={{ background: "#4a80e8" }} />Paid out</span>
          <span><i style={{ background: "#a79bf6" }} />Scheduled</span>
          <span><i style={{ background: "#e3e9fa" }} />Budget</span>
        </div>
      </Card>

      <Card className="dk-chart-card">
        <CardHead
          title="Delivery Summary"
          action={
            <span className="dk-head-tools">
              <span className="dk-mini-pill">This Year</span>
              <span className="dk-ico"><MoreHorizontal size={14} /></span>
            </span>
          }
        />
        <div className="dk-legend tight">
          <span><i style={{ background: "#4a80e8" }} />Closed</span>
          <span><i style={{ background: "#e6eafa" }} />Planned</span>
        </div>
        <div className="dk-plot">
          {["100K", "70K", "50K", "25K", "0"].map((k, i) => (
            <span className="dk-gridline" key={k} style={{ top: `${i * 24}%` }}>
              <em>{k}</em>
            </span>
          ))}
          <DotMatrix lit={SALES} total={TOTAL} focus={col} size={15} pitch={17} label="Tasks closed per month" />
          <span className="dk-cursor" style={{ left: `${(col / 29) * 92 + 5}%` }} />
          <div className="dk-tip" style={{ left: `${(col / 29) * 92 + (col > 18 ? -13 : 7)}%` }}>
            <span><i style={{ background: "#4a80e8" }} />Closed</span>
            <b>{peak ? "70,901" : fmt((SALES[col] / SALES[15]) * 70901)}</b>
            <span><i style={{ background: "#e3e8f8" }} />Planned</span>
            <b>{peak ? "92,921" : fmt((TOTAL[col] / TOTAL[15]) * 92921)}</b>
          </div>
          {live &&
            SALES.map((_, i) => (
              <span
                key={i}
                className="dk-hit"
                style={{ left: `${(i / 29) * 92 + 5}%` }}
                onMouseEnter={() => setCol(i)}
              />
            ))}
        </div>
        <div className="dk-months">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </Card>

      <Card className="dk-gauge-card">
        <CardHead title="QC Pass Rate" action={<span className="dk-ico"><ArrowUpRight size={14} /></span>} />
        <Gauge className="dk-gauge" rich animate active={21} value="8,214" label="Items signed off" />
        <div className="dk-legend">
          <span><i style={{ background: "#4a80e8" }} />Approved</span>
          <span><i style={{ background: "#e6eafa" }} />Sent back</span>
          <span><i style={{ background: "#e3e3e8" }} />Pending</span>
        </div>
        <p className="dk-note">
          <b>+12.2%</b> QC approved 2,921 more items than last month
        </p>
      </Card>
    </div>
  );
}

/* --------------------------------------------------------------- clock -- */

const SHIFTS = [
  { day: "Mon 2 Nov", in: "09:02", out: "18:14", total: "9h 12m", extra: "+1h 12m" },
  { day: "Fri 30 Oct", in: "08:58", out: "17:46", total: "8h 48m", extra: "+48m" },
  { day: "Thu 29 Oct", in: "09:14", out: "17:30", total: "8h 16m", extra: "+16m" },
  { day: "Wed 28 Oct", in: "09:00", out: "19:05", total: "10h 05m", extra: "+2h 05m" },
];

const MONTH_BARS = [72, 88, 95, 64, 100, 0, 0, 83, 91, 100, 78, 86, 0, 0, 94, 88, 100, 70, 92, 0, 0, 85];

/** Clock module: the live shift, the month's hours, and the timesheet. */
export function ClockScreen({ live }: { live: boolean }) {
  const [secs, setSecs] = useState(6 * 3600 + 39 * 60 + 32);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!live || !running) return;
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [live, running]);

  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="dk-grid dk-clock">
      <Card className="dk-shift">
        <CardHead
          title="Today's shift"
          icon={Clock3}
          action={<Chip tint={running ? "green" : "slate"} dot>{running ? "Clocked in" : "On break"}</Chip>}
        />
        <p className="dk-timer">
          {hh}<em>:</em>{mm}<em>:</em><span className="dk-secs">{ss}</span>
        </p>
        <p className="dk-sub">Clocked in 09:02 · Little Mount, Chennai</p>
        <button
          type="button"
          className={`dk-btn ${running ? "ghost" : "solid"}`}
          onClick={() => live && setRunning((r) => !r)}
          tabIndex={live ? 0 : -1}
        >
          {running ? <><Pause size={13} /> Take a break</> : <><Play size={13} /> Resume shift</>}
        </button>
        <div className="dk-split">
          <Figure icon={Hourglass} label="Total hours worked" value="164h 20m" tint="purple" sub="This month" />
          <Figure icon={Flame} label="Total extra hours" value="18h 45m" tint="orange" sub="Paid overtime" />
        </div>
      </Card>

      <Card className="dk-consistency">
        <CardHead title="Consistency" icon={Activity} />
        <div className="dk-dial-row">
          <Dial value={92} tint="green">
            <b>92%</b>
            <small>attendance</small>
          </Dial>
          <div>
            <p className="dk-sub">22 of 24 days the office was open</p>
            <p className="dk-streak"><Flame size={13} /> <b>11 days</b> in a row</p>
            <p className="dk-sub">Average day <b>8h 12m</b></p>
          </div>
        </div>
      </Card>

      <Card className="dk-month">
        <CardHead title="This month, day by day" icon={CalendarRange} action={<Chip tint="blue">Nov 2026</Chip>} />
        <div className="dk-month-bars">
          {MONTH_BARS.map((v, i) => (
            <span
              key={i}
              className={v === 0 ? "off" : v >= 100 ? "over" : ""}
              style={{ height: `${Math.max(7, v)}%`, animationDelay: `${i * 22}ms` }}
            />
          ))}
        </div>
        <div className="dk-legend">
          <span><i style={{ background: "#4a80e8" }} />Worked</span>
          <span><i style={{ background: TINTS.orange.solid }} />Over 8h</span>
          <span><i style={{ background: "#e7e9f2" }} />Closed</span>
        </div>
      </Card>

      <Card className="dk-sheet" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Your timesheet" action={<span className="dk-mini-pill">Export</span>} />
        </div>
        <table className="dk-table">
          <thead>
            <tr><th>Day</th><th>In</th><th>Out</th><th>Total</th><th>Extra</th></tr>
          </thead>
          <tbody>
            {SHIFTS.map((s) => (
              <tr key={s.day}>
                <td>{s.day}</td>
                <td>{s.in}</td>
                <td>{s.out}</td>
                <td><b>{s.total}</b></td>
                <td><Chip tint="orange">{s.extra}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------ calendar -- */

type Ev = { kind: "standup" | "meeting" | "release" | "leave"; label: string; time: string };

const EVENTS: Record<number, Ev[]> = {
  3: [
    { kind: "standup", label: "Platform squad standup", time: "09:30" },
    { kind: "meeting", label: "Northwind sprint review", time: "14:00" },
  ],
  5: [{ kind: "release", label: "Kestrel v2.4 release", time: "17:00" }],
  9: [{ kind: "standup", label: "Web squad standup", time: "09:30" }],
  12: [{ kind: "meeting", label: "Payroll sign-off", time: "11:00" }],
  17: [{ kind: "leave", label: "Divya — annual leave", time: "All day" }],
  19: [{ kind: "release", label: "Harbour hotfix", time: "16:30" }],
  24: [{ kind: "meeting", label: "Client demo — Lumen", time: "15:00" }],
};

const EV_TINT = { standup: "blue", meeting: "purple", release: "green", leave: "orange" } as const;
const EV_ICON = { standup: Users, meeting: Video, release: BadgeCheck, leave: Coffee };

export function CalendarScreen({ live }: { live: boolean }) {
  const [day, setDay] = useState(3);
  const events = EVENTS[day] ?? [];

  return (
    <div className="dk-grid dk-calendar">
      <Card className="dk-cal">
        <CardHead
          title="November 2026"
          icon={CalendarRange}
          action={
            <span className="dk-head-tools">
              <span className="dk-mini-pill">Month</span>
              <span className="dk-ico"><Plus size={14} /></span>
            </span>
          }
        />
        <div className="dk-weekdays">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="dk-days">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
            const evs = EVENTS[d] ?? [];
            const weekend = d % 7 === 6 || d % 7 === 0;
            return (
              <button
                key={d}
                type="button"
                className={`dk-day ${d === day ? "on" : ""} ${weekend ? "off" : ""}`}
                onClick={() => live && setDay(d)}
                tabIndex={live ? 0 : -1}
                aria-label={`${d} November, ${evs.length} events`}
              >
                <span>{d}</span>
                <i className="dk-day-dots">
                  {evs.map((e, k) => (
                    <em key={k} style={{ background: TINTS[EV_TINT[e.kind]].solid }} />
                  ))}
                </i>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="dk-agenda">
        <CardHead title={`${day} November`} action={<Chip tint="blue">{events.length} marked</Chip>} />
        {events.length === 0 ? (
          <p className="dk-empty">Nothing marked yet. Pick another day, or add a standup.</p>
        ) : (
          <ul className="dk-agenda-list">
            {events.map((e, i) => {
              const Icon = EV_ICON[e.kind];
              const t = EV_TINT[e.kind];
              return (
                <li key={i} style={{ animationDelay: `${i * 70}ms` }}>
                  <span className="dk-fig-ic" style={{ background: TINTS[t].bg, color: TINTS[t].fg }}>
                    <Icon size={14} strokeWidth={1.8} />
                  </span>
                  <span>
                    <b>{e.label}</b>
                    <small>{e.time} · {e.kind}</small>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="dk-quick">
          <span className="dk-mini-pill solid"><Plus size={12} /> Mark standup</span>
          <span className="dk-mini-pill"><Video size={12} /> Add meeting</span>
        </div>
      </Card>

      <Card className="dk-upnext">
        <CardHead title="Up next this week" />
        <ul className="dk-upnext-list">
          <li><Chip tint="blue" dot>09:30</Chip> Platform squad standup <em>in 20m</em></li>
          <li><Chip tint="purple" dot>14:00</Chip> Northwind sprint review <em>today</em></li>
          <li><Chip tint="green" dot>17:00</Chip> Kestrel v2.4 release <em>Thu</em></li>
        </ul>
      </Card>
    </div>
  );
}

/* --------------------------------------------------------------- KRA -- */

const KRA_TRAIL = [
  { delta: +4, reason: "Sprint closed with no QC errors", after: 94, when: "2 Nov" },
  { delta: -3, reason: "QC error — Northwind checkout regression", after: 90, when: "28 Oct" },
  { delta: +2, reason: "Daily reports filed every day this month", after: 93, when: "24 Oct" },
  { delta: +5, reason: "Picked up two tasks outside the sprint", after: 91, when: "17 Oct" },
];

const KRA_BOARD = [
  { name: "Karthik Suresh", role: "Team Leader — Platform", score: 97 },
  { name: "Neha Iyer", role: "Software Engineer", score: 94 },
  { name: "Meera Krishnan", role: "Team Leader — Web", score: 91 },
  { name: "Arun Varghese", role: "UI Designer", score: 86 },
];

/**
 * The KRA score, which is the part of OperixCRM that corporate buyers ask
 * about: every point is a recorded event with a reason, so the number on
 * someone's record can always be argued from the trail rather than asserted.
 */
export function KraScreen() {
  return (
    <div className="dk-grid dk-kra">
      <Card className="dk-kra-hero">
        <CardHead title="KRA Score" icon={Target} action={<Chip tint="green" dot>Verified trail</Chip>} />
        <div className="dk-kra-main">
          <Dial value={94} size={148} stroke={12} tint="blue">
            <b className="dk-kra-num">94</b>
            <small>out of 100</small>
          </Dial>
          <div className="dk-kra-side">
            <p className="dk-kra-name">Neha Iyer</p>
            <p className="dk-sub">Software Engineer · Platform squad</p>
            <ul className="dk-kra-stats">
              <li><b>+11</b><small>Earned this month</small></li>
              <li><b>−3</b><small>QC deductions</small></li>
              <li><b>Top 8%</b><small>Company rank</small></li>
            </ul>
          </div>
        </div>
        <div className="dk-kra-scale" aria-hidden>
          <span style={{ width: "94%" }} />
          <em style={{ left: "94%" }} />
        </div>
        <p className="dk-note dk-kra-foot">
          <b>Audit-ready</b> Every point traces to a recorded event — no manual edits
        </p>
      </Card>

      <Card className="dk-kra-trail" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Why the score is 94" action={<span className="dk-mini-pill">All events</span>} />
        </div>
        <ul className="dk-trail">
          {KRA_TRAIL.map((e, i) => (
            <li key={i} style={{ animationDelay: `${i * 80}ms` }}>
              <span className="dk-trail-delta" data-up={e.delta > 0}>
                {e.delta > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {e.delta > 0 ? `+${e.delta}` : e.delta}
              </span>
              <span className="dk-trail-body">
                <b>{e.reason}</b>
                <small>{e.when} · balance after {e.after}</small>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dk-kra-board">
        <CardHead title="Company leaderboard" icon={Users} />
        <ul className="dk-board">
          {KRA_BOARD.map((p, i) => (
            <li key={p.name}>
              <em>{i + 1}</em>
              <Avatar name={p.name} size={26} />
              <span>
                <b>{p.name}</b>
                <small>{p.role}</small>
              </span>
              <span className="dk-board-score">
                <Bar value={p.score} tint={p.score >= 95 ? "green" : p.score >= 90 ? "blue" : "orange"} />
                <i>{p.score}</i>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- team -- */

const ROSTER = [
  { name: "Karthik Suresh", role: "Team Leader — Platform", status: "available", note: "Reviewing the Kestrel release branch", hours: "7h 40m" },
  { name: "Neha Iyer", role: "Software Engineer", status: "focus", note: "Heads down on the checkout regression", hours: "6h 39m" },
  { name: "Divya Ramesh", role: "Frontend Engineer", status: "meeting", note: "Client demo with Lumen Health", hours: "5h 02m" },
  { name: "Arun Varghese", role: "UI Designer", status: "break", note: "Back at 15:30", hours: "4h 18m" },
  { name: "Rahul Nair", role: "QA Lead", status: "available", note: "Clearing the checklist queue", hours: "7h 05m" },
  { name: "Vishnu Prasad", role: "QA Engineer", status: "away", note: "Annual leave until Friday", hours: "—" },
];

const STATUS: Record<string, { label: string; tint: keyof typeof TINTS }> = {
  available: { label: "Available", tint: "green" },
  focus: { label: "Focus", tint: "purple" },
  meeting: { label: "In a meeting", tint: "blue" },
  break: { label: "On a break", tint: "orange" },
  away: { label: "Away", tint: "slate" },
};

export function TeamScreen({ live }: { live: boolean }) {
  const [sel, setSel] = useState(1);
  const person = ROSTER[sel];

  return (
    <div className="dk-grid dk-team">
      <Card className="dk-roster" pad={false}>
        <div className="dk-sheet-head">
          <CardHead
            title="Who is in right now"
            icon={Users}
            action={<Chip tint="green" dot>4 clocked in</Chip>}
          />
        </div>
        <ul className="dk-people">
          {ROSTER.map((p, i) => {
            const s = STATUS[p.status];
            return (
              <li key={p.name}>
                <button
                  type="button"
                  className={i === sel ? "on" : ""}
                  onClick={() => live && setSel(i)}
                  tabIndex={live ? 0 : -1}
                >
                  <Avatar name={p.name} size={30} />
                  <span className="dk-people-id">
                    <b>{p.name}</b>
                    <small>{p.note}</small>
                  </span>
                  <Chip tint={s.tint} dot>{s.label}</Chip>
                  <i className="dk-people-hrs">{p.hours}</i>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="dk-person">
        <CardHead title="Quick status" icon={MessageSquare} />
        <div className="dk-person-top">
          <Avatar name={person.name} size={44} />
          <span>
            <b>{person.name}</b>
            <small>{person.role}</small>
          </span>
        </div>
        <p className="dk-person-note">“{person.note}”</p>
        <div className="dk-person-stats">
          <Figure icon={Clock3} label="Today" value={person.hours} tint="blue" />
          <Figure icon={Target} label="KRA" value="94" tint="green" />
        </div>
        <div className="dk-quick">
          <span className="dk-mini-pill solid"><MessageSquare size={12} /> Message</span>
          <span className="dk-mini-pill">Assign task</span>
        </div>
      </Card>
    </div>
  );
}

/* --------------------------------------------------------------- tasks -- */

const COLUMNS = [
  {
    name: "In progress",
    tint: "blue" as const,
    items: [
      { id: "TSK-412", title: "Checkout regression on Northwind", who: "Neha Iyer", tag: "Bug", pts: 5 },
      { id: "TSK-418", title: "Payroll export for October", who: "Karthik Suresh", tag: "Finance", pts: 3 },
    ],
  },
  {
    name: "In QC",
    tint: "purple" as const,
    items: [
      { id: "TSK-402", title: "Client portal invoice view", who: "Divya Ramesh", tag: "Feature", pts: 8 },
    ],
  },
  {
    name: "Signed off",
    tint: "green" as const,
    items: [
      { id: "TSK-397", title: "Sprint board drag and drop", who: "Meera Krishnan", tag: "Feature", pts: 5 },
      { id: "TSK-391", title: "Leave balance rounding", who: "Arun Varghese", tag: "Fix", pts: 2 },
    ],
  },
];

export function TasksScreen({ live }: { live: boolean }) {
  return (
    <div className="dk-grid dk-tasks">
      {COLUMNS.map((c) => (
        <Card key={c.name} className="dk-col">
          <CardHead
            title={c.name}
            action={<Chip tint={c.tint}>{c.items.length}</Chip>}
          />
          <ul className="dk-cards">
            {c.items.map((t, i) => (
              <li key={t.id} style={{ animationDelay: `${i * 90}ms` }} data-live={live || undefined}>
                <span className="dk-task-top">
                  <Chip tint={c.tint}>{t.tag}</Chip>
                  <em>{t.id}</em>
                </span>
                <b>{t.title}</b>
                <span className="dk-task-foot">
                  <Avatar name={t.who} size={22} />
                  <small>{t.who}</small>
                  <i>{t.pts} pts</i>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
      <Card className="dk-sprint">
        <CardHead title="Sprint 24 · burn-down" icon={Activity} action={<Chip tint="green">On track</Chip>} />
        <div className="dk-sprint-body">
          <Bars
            label="Tasks delivered by squad"
            data={[
              { value: 146, label: "Platform" },
              { value: 109, label: "Web" },
              { value: 75, label: "Video" },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------- checklist -- */

const CHECKS = [
  { label: "Acceptance criteria met", ok: true, pts: 2 },
  { label: "Unit tests cover the fix", ok: true, pts: 2 },
  { label: "No console errors on the happy path", ok: true, pts: 1 },
  { label: "Responsive down to 375px", ok: false, pts: 3 },
  { label: "Copy proofread", ok: true, pts: 1 },
];

export function ChecklistScreen({ live }: { live: boolean }) {
  const [checks, setChecks] = useState(CHECKS);
  const failed = checks.filter((c) => !c.ok);
  const deduction = failed.reduce((n, c) => n + c.pts, 0);

  return (
    <div className="dk-grid dk-checklist">
      <Card className="dk-review" pad={false}>
        <div className="dk-sheet-head">
          <CardHead
            title="TSK-402 · Client portal invoice view"
            icon={BadgeCheck}
            action={<Chip tint="purple">In QC</Chip>}
          />
        </div>
        <ul className="dk-checks">
          {checks.map((c, i) => (
            <li key={c.label}>
              <button
                type="button"
                className={c.ok ? "ok" : "bad"}
                onClick={() =>
                  live && setChecks((cs) => cs.map((x, k) => (k === i ? { ...x, ok: !x.ok } : x)))
                }
                tabIndex={live ? 0 : -1}
                aria-pressed={c.ok}
              >
                {c.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{c.label}</span>
                <i>{c.pts} KRA</i>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dk-verdict">
        <CardHead title="KRA impact" icon={Target} />
        <p className="dk-verdict-num" data-bad={deduction > 0}>
          {deduction > 0 ? `−${deduction}` : "0"}
        </p>
        <p className="dk-sub">
          {deduction > 0
            ? `${failed.length} item${failed.length === 1 ? "" : "s"} rejected. Only an Error verdict moves KRA.`
            : "Nothing rejected. Approving costs the assignee nothing."}
        </p>
        <div className="dk-assignee">
          <Avatar name="Divya Ramesh" size={30} />
          <span>
            <b>Divya Ramesh</b>
            <small>KRA 91 → {Math.max(0, 91 - deduction)}</small>
          </span>
        </div>
        <div className="dk-quick">
          <span className={`dk-mini-pill ${deduction > 0 ? "" : "solid"}`}>Approve</span>
          <span className="dk-mini-pill">Corrections</span>
          <span className={`dk-mini-pill ${deduction > 0 ? "danger" : ""}`}>Error</span>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------ pipeline -- */

const STAGES = [
  { name: "Contacted", n: 48, v: "£96k", tint: "slate" as const },
  { name: "Qualified", n: 31, v: "£142k", tint: "blue" as const },
  { name: "Proposal", n: 17, v: "£88k", tint: "purple" as const },
  { name: "Won", n: 9, v: "£64k", tint: "green" as const },
];

const INVOICES = [
  { client: "Northwind Ltd", amount: "£12,400", state: "Settled", tint: "green" as const },
  { client: "Lumen Health", amount: "£8,900", state: "Sent", tint: "blue" as const },
  { client: "Kestrel Logistics", amount: "£21,750", state: "Overdue", tint: "red" as const },
];

export function PipelineScreen() {
  return (
    <div className="dk-grid dk-pipeline">
      <Card className="dk-stages">
        <CardHead title="Pipeline by stage" icon={Target} action={<Chip tint="green">+9.3%</Chip>} />
        <ul className="dk-funnel">
          {STAGES.map((s, i) => (
            <li key={s.name} style={{ animationDelay: `${i * 90}ms` }}>
              <span className="dk-funnel-top">
                <b>{s.name}</b>
                <i>{s.v}</i>
              </span>
              <Bar value={(s.n / 48) * 100} tint={s.tint} />
              <small>{s.n} leads</small>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dk-clients">
        <CardHead title="Client health" icon={Users} />
        <div className="dk-dial-row">
          <Dial value={78} tint="blue">
            <b>184</b>
            <small>accounts</small>
          </Dial>
          <ul className="dk-health">
            <li><Chip tint="green" dot>Healthy</Chip> 142</li>
            <li><Chip tint="orange" dot>Watch</Chip> 31</li>
            <li><Chip tint="red" dot>At risk</Chip> 11</li>
          </ul>
        </div>
        <Sparkline className="dk-spark" />
      </Card>

      <Card className="dk-invoices" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Invoices" icon={Banknote} action={<span className="dk-mini-pill">This month</span>} />
        </div>
        <table className="dk-table">
          <thead>
            <tr><th>Client</th><th>Amount</th><th>State</th></tr>
          </thead>
          <tbody>
            {INVOICES.map((inv) => (
              <tr key={inv.client}>
                <td>{inv.client}</td>
                <td><b>{inv.amount}</b></td>
                <td><Chip tint={inv.tint}>{inv.state}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
