"use client";

/*
 * The remaining module screens.
 *
 * Split from ./screens.tsx only for file size — same canvas, same
 * primitives, same rule: the vocabulary (verdicts, KRA, "Awaiting You",
 * "Running Late", mandatory modules) is lifted from the first Jadvix CRM so
 * the mock matches the product it is selling.
 */

import { useState } from "react";
import {
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  Bug,
  Building2,
  CalendarOff,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FolderKanban,
  GitBranch,
  GraduationCap,
  Inbox,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  MessagesSquare,
  Paperclip,
  Send,
  Settings as SettingsIcon,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import { Avatar, Bar, Card, CardHead, Chip, Dial, Figure, TINTS } from "./ui";

/* ------------------------------------------------------------ projects -- */

const PROJECTS = [
  { name: "Northwind Commerce", client: "Northwind Ltd", pct: 78, budget: "£96,400", state: "In scope", tint: "green" as const, team: ["Karthik Suresh", "Neha Iyer", "Divya Ramesh"] },
  { name: "Lumen Patient Portal", client: "Lumen Health", pct: 46, budget: "£142,000", state: "In scope", tint: "blue" as const, team: ["Meera Krishnan", "Arun Varghese"] },
  { name: "Kestrel Fleet", client: "Kestrel Logistics", pct: 91, budget: "£64,800", state: "Running Late", tint: "orange" as const, team: ["Rahul Nair", "Vishnu Prasad"] },
  { name: "Harbour Intranet", client: "Harbour Group", pct: 23, budget: "£38,200", state: "In scope", tint: "slate" as const, team: ["Neha Iyer"] },
];

export function ProjectsScreen() {
  return (
    <div className="dk-grid dk-projects">
      <Card className="dk-proj-stats" pad={false}>
        <div className="dk-stat-row">
          <Figure icon={FolderKanban} label="Active projects" value="14" tint="blue" />
          <Figure icon={Target} label="Delivered on time" value="86%" tint="green" />
          <Figure icon={AlertTriangle} label="Running late" value="2" tint="orange" />
          <Figure icon={Wallet} label="Budget committed" value="£341k" tint="purple" />
        </div>
      </Card>

      <Card className="dk-proj-table" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Your Projects" icon={FolderKanban} action={<span className="dk-mini-pill">New project</span>} />
        </div>
        <table className="dk-table">
          <thead>
            <tr><th>Project</th><th>Client</th><th>Progress</th><th>Budget</th><th>Team</th><th>State</th></tr>
          </thead>
          <tbody>
            {PROJECTS.map((p) => (
              <tr key={p.name}>
                <td><b>{p.name}</b></td>
                <td>{p.client}</td>
                <td className="dk-td-bar">
                  <Bar value={p.pct} tint={p.tint} />
                  <i>{p.pct}%</i>
                </td>
                <td>{p.budget}</td>
                <td>
                  <span className="dk-stack">
                    {p.team.map((m) => (
                      <Avatar key={m} name={m} size={22} />
                    ))}
                  </span>
                </td>
                <td><Chip tint={p.tint}>{p.state}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- bugs -- */

const BUGS = [
  { id: "BUG-118", title: "Checkout totals wrong with a discount code", sev: "Critical", tint: "red" as const, who: "Neha Iyer", found: "Northwind Commerce", state: "Not Started" },
  { id: "BUG-121", title: "Invoice PDF misses the VAT line", sev: "Major", tint: "orange" as const, who: "Divya Ramesh", found: "Lumen Patient Portal", state: "Done" },
  { id: "BUG-124", title: "Sprint board drag drops on the wrong column", sev: "Major", tint: "orange" as const, who: "Meera Krishnan", found: "Kestrel Fleet", state: "Not Started" },
  { id: "BUG-127", title: "Avatar initials clip at 1px scale", sev: "Minor", tint: "slate" as const, who: "Arun Varghese", found: "Harbour Intranet", state: "Fixed" },
];

export function BugsScreen() {
  return (
    <div className="dk-grid dk-bugs">
      <Card className="dk-bug-list" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Open Defects" icon={Bug} action={<Chip tint="red">{BUGS.length} raised</Chip>} />
        </div>
        <ul className="dk-bug-rows">
          {BUGS.map((b, i) => (
            <li key={b.id} style={{ animationDelay: `${i * 70}ms` }}>
              <span className="dk-sev" style={{ background: TINTS[b.tint].solid }} />
              <span className="dk-bug-body">
                <b>{b.title}</b>
                <small>{b.id} · found in {b.found}</small>
              </span>
              <Chip tint={b.tint}>{b.sev}</Chip>
              <Avatar name={b.who} size={24} />
              <Chip tint={b.state === "Fixed" || b.state === "Done" ? "green" : "slate"}>{b.state}</Chip>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dk-bug-side">
        <CardHead title="By severity" icon={AlertTriangle} />
        <div className="dk-dial-row">
          <Dial value={64} tint="red">
            <b>11</b>
            <small>open</small>
          </Dial>
          <ul className="dk-health">
            <li><Chip tint="red" dot>Critical</Chip> 1</li>
            <li><Chip tint="orange" dot>Major</Chip> 6</li>
            <li><Chip tint="slate" dot>Minor</Chip> 4</li>
          </ul>
        </div>
        <p className="dk-note">
          <b>Blocking</b> One critical defect is blocking a release
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------ requests -- */

const INVITES = [
  { project: "Lumen Patient Portal", from: "Priya Raghavan", as: "To join", tint: "blue" as const, when: "2 hours ago" },
  { project: "Kestrel Fleet", from: "Rohan Kurian", as: "To lead", tint: "purple" as const, when: "Yesterday" },
];

export function RequestsScreen({ live }: { live: boolean }) {
  const [done, setDone] = useState<number[]>([]);
  const left = INVITES.filter((_, i) => !done.includes(i));

  return (
    <div className="dk-grid dk-requests">
      <Card className="dk-invites">
        <CardHead
          title="Project invitations"
          icon={Inbox}
          action={<Chip tint={left.length ? "blue" : "green"}>{left.length ? `${left.length} waiting on you` : "All clear"}</Chip>}
        />
        {left.length === 0 ? (
          <p className="dk-empty">Nothing waiting on you.</p>
        ) : (
          <ul className="dk-invite-list">
            {INVITES.map((inv, i) =>
              done.includes(i) ? null : (
                <li key={inv.project}>
                  <span className="dk-fig-ic" style={{ background: TINTS[inv.tint].bg, color: TINTS[inv.tint].fg }}>
                    <Inbox size={14} strokeWidth={1.8} />
                  </span>
                  <span className="dk-invite-body">
                    <b>{inv.project}</b>
                    <small>{inv.from} invited you {inv.as.toLowerCase()} · {inv.when}</small>
                  </span>
                  <Chip tint={inv.tint}>{inv.as}</Chip>
                  <button
                    type="button"
                    className="dk-mini-pill solid"
                    onClick={() => live && setDone((d) => [...d, i])}
                    tabIndex={live ? 0 : -1}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="dk-mini-pill"
                    onClick={() => live && setDone((d) => [...d, i])}
                    tabIndex={live ? 0 : -1}
                  >
                    Decline
                  </button>
                </li>
              ),
            )}
          </ul>
        )}
      </Card>

      <Card className="dk-req-side">
        <CardHead title="Why this exists" icon={UserCheck} />
        <p className="dk-sub">
          An invitation has to be answered somewhere, so Requests is the one module no portal can have taken
          away.
        </p>
        <div className="dk-split">
          <Figure icon={Users} label="Projects you are on" value="6" tint="blue" />
          <Figure icon={Award} label="Projects you lead" value="2" tint="purple" />
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------- communication -- */

const CHANNELS = [
  { name: "Platform squad", last: "Karthik: pushed the fix", unread: 3 },
  { name: "Northwind — client", last: "Daniel: looks good to me", unread: 0 },
  { name: "QC queue", last: "Rahul: two items sent back", unread: 1 },
  { name: "Announcements", last: "Payroll runs Friday", unread: 0 },
];

const THREAD = [
  { who: "Rahul Nair", me: false, text: "TSK-402 is back with you — the 375px layout breaks on the invoice table." },
  { who: "Divya Ramesh", me: true, text: "Got it. Rebuilding that table as a stacked list under 480px." },
  { who: "Rahul Nair", me: false, text: "Perfect. I'll re-run the checklist as soon as it lands." },
];

export function CommunicationScreen() {
  return (
    <div className="dk-grid dk-comms">
      <Card className="dk-channels" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Conversations" icon={MessagesSquare} />
        </div>
        <ul className="dk-channel-list">
          {CHANNELS.map((c, i) => (
            <li key={c.name}>
              <button type="button" className={i === 0 ? "on" : ""} tabIndex={-1}>
                <span>
                  <b>{c.name}</b>
                  <small>{c.last}</small>
                </span>
                {c.unread > 0 && <i className="dk-unread">{c.unread}</i>}
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dk-thread">
        <CardHead title="Platform squad" icon={Users} action={<Chip tint="green" dot>4 online</Chip>} />
        <ul className="dk-messages">
          {THREAD.map((m, i) => (
            <li key={i} className={m.me ? "me" : ""} style={{ animationDelay: `${i * 90}ms` }}>
              {!m.me && <Avatar name={m.who} size={26} />}
              <span className="dk-bubble">
                {!m.me && <em>{m.who}</em>}
                {m.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="dk-composer">
          <Paperclip size={14} aria-hidden />
          <span>Write a message…</span>
          <i><Send size={13} aria-hidden /></i>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------- monitor -- */

const MILESTONES = [
  { name: "Discovery and scope", date: "12 Aug", state: "Done", tint: "green" as const },
  { name: "Design sign-off", date: "26 Aug", state: "Done", tint: "green" as const },
  { name: "Build — phase one", date: "30 Sep", state: "Done", tint: "green" as const },
  { name: "Build — phase two", date: "14 Nov", state: "In scope", tint: "blue" as const },
  { name: "UAT and handover", date: "5 Dec", state: "Nothing scheduled", tint: "slate" as const },
];

export function MonitorScreen() {
  return (
    <div className="dk-grid dk-monitor">
      <Card className="dk-plan">
        <CardHead title="Northwind Commerce" icon={Target} action={<Chip tint="green">Everything on schedule</Chip>} />
        <ol className="dk-timeline">
          {MILESTONES.map((m, i) => (
            <li key={m.name} style={{ animationDelay: `${i * 80}ms` }} data-done={m.state === "Done"}>
              <span className="dk-tl-dot" style={{ background: TINTS[m.tint].solid }}>
                {m.state === "Done" && <Check size={10} strokeWidth={3} />}
              </span>
              <span className="dk-tl-body">
                <b>{m.name}</b>
                <small>{m.date}</small>
              </span>
              <Chip tint={m.tint}>{m.state}</Chip>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="dk-plan-side">
        <CardHead title="Milestones Done" icon={CheckCircle2} />
        <div className="dk-dial-row">
          <Dial value={60} tint="green">
            <b>3/5</b>
            <small>complete</small>
          </Dial>
          <div>
            <p className="dk-sub">Next Milestone</p>
            <p className="dk-kra-name">14 Nov</p>
            <p className="dk-sub">Build — phase two</p>
          </div>
        </div>
        <div className="dk-split">
          <Figure icon={Wallet} label="Invoiced to date" value="£61,200" tint="purple" />
        </div>
        <div className="dk-quick">
          <span className="dk-mini-pill solid">Open with Jadvix</span>
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------- employees -- */

const ROSTER2 = [
  { name: "Karthik Suresh", role: "Team Leader — Platform", dept: "Engineering", branch: "Chennai", kra: 97, state: "Active" },
  { name: "Neha Iyer", role: "Software Engineer", dept: "Engineering", branch: "Chennai", kra: 94, state: "Active" },
  { name: "Meera Krishnan", role: "Team Leader — Web", dept: "Engineering", branch: "Ruislip", kra: 91, state: "Active" },
  { name: "Arun Varghese", role: "UI Designer", dept: "Design", branch: "Chennai", kra: 86, state: "Available" },
  { name: "Rahul Nair", role: "QA Lead", dept: "Quality", branch: "Ruislip", kra: 93, state: "Active" },
];

export function EmployeesScreen() {
  return (
    <div className="dk-grid dk-employees">
      <Card className="dk-emp-stats" pad={false}>
        <div className="dk-stat-row">
          <Figure icon={Users} label="Headcount" value="128" tint="blue" sub="Across the whole roster" />
          <Figure icon={Target} label="Average KRA" value="91.4" tint="green" />
          <Figure icon={Building2} label="Branches" value="2" tint="purple" />
          <Figure icon={Clock3} label="Clocked in now" value="74" tint="sky" />
        </div>
      </Card>

      <Card className="dk-emp-table" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Employee Directory" icon={Users} action={<span className="dk-mini-pill">Invite</span>} />
        </div>
        <table className="dk-table">
          <thead>
            <tr><th>Name</th><th>Department</th><th>Branch</th><th>KRA</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ROSTER2.map((p) => (
              <tr key={p.name}>
                <td>
                  <span className="dk-cell-id">
                    <Avatar name={p.name} size={26} />
                    <span>
                      <b>{p.name}</b>
                      <small>{p.role}</small>
                    </span>
                  </span>
                </td>
                <td>{p.dept}</td>
                <td>{p.branch}</td>
                <td className="dk-td-bar">
                  <Bar value={p.kra} tint={p.kra >= 95 ? "green" : p.kra >= 90 ? "blue" : "orange"} />
                  <i>{p.kra}</i>
                </td>
                <td><Chip tint={p.state === "Active" ? "green" : "slate"} dot>{p.state}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* --------------------------------------------------------------- teams -- */

const TEAMS = [
  { name: "Platform squad", lead: "Karthik Suresh", members: ["Karthik Suresh", "Neha Iyer", "Divya Ramesh", "Arun Varghese"], on: "Northwind Commerce" },
  { name: "Web squad", lead: "Meera Krishnan", members: ["Meera Krishnan", "Arun Varghese", "Neha Iyer"], on: "Lumen Patient Portal" },
  { name: "Quality", lead: "Rahul Nair", members: ["Rahul Nair", "Vishnu Prasad", "Anjali Thomas"], on: "Every release" },
];

export function TeamsScreen() {
  return (
    <div className="dk-grid dk-teams">
      {TEAMS.map((t) => (
        <Card key={t.name}>
          <CardHead title={t.name} icon={UsersRound} action={<Chip tint="blue">{t.members.length}</Chip>} />
          <p className="dk-sub">Currently on <b>{t.on}</b></p>
          <ul className="dk-team-members">
            {t.members.map((m) => (
              <li key={m}>
                <Avatar name={m} size={28} />
                <span>
                  <b>{m}</b>
                  <small>{m === t.lead ? "Team lead" : "Member"}</small>
                </span>
                {m === t.lead && <Chip tint="purple">Lead</Chip>}
              </li>
            ))}
          </ul>
          <div className="dk-quick">
            <span className="dk-mini-pill solid">Put on a project</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- reports -- */

const REPORTS = [
  { day: "Mon 2 Nov", text: "Closed the checkout regression and paired with Divya on the invoice table.", rating: 5, by: "Priya Raghavan" },
  { day: "Fri 30 Oct", text: "Sprint 24 planning, then picked up two tasks outside the sprint.", rating: 4, by: "Priya Raghavan" },
  { day: "Thu 29 Oct", text: "Spent the day on the payroll export and its tests.", rating: 4, by: "Awaiting a rating" },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="dk-stars" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((k) => (
        <Star key={k} size={12} fill={k <= n ? "#f0a93a" : "none"} stroke={k <= n ? "#f0a93a" : "#d7dae6"} />
      ))}
    </span>
  );
}

export function ReportsScreen() {
  return (
    <div className="dk-grid dk-reports">
      <Card className="dk-report-write">
        <CardHead title="File the day" icon={ClipboardList} action={<Chip tint="orange">Not written up</Chip>} />
        <div className="dk-textarea">
          What did you get done today?
          <i />
        </div>
        <div className="dk-quick">
          <span className="dk-mini-pill solid">File the day</span>
          <span className="dk-mini-pill">Save draft</span>
        </div>
      </Card>

      <Card className="dk-report-stats">
        <CardHead title="Filed this month" icon={TrendingUp} />
        <div className="dk-dial-row">
          <Dial value={88} tint="green">
            <b>4.6</b>
            <small>avg rating</small>
          </Dial>
          <div>
            <p className="dk-sub"><b>21</b> of 24 days filed</p>
            <p className="dk-sub"><b>3</b> awaiting a rating</p>
          </div>
        </div>
      </Card>

      <Card className="dk-report-list" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Recent reports" action={<span className="dk-mini-pill">Everyone</span>} />
        </div>
        <ul className="dk-report-rows">
          {REPORTS.map((r, i) => (
            <li key={r.day} style={{ animationDelay: `${i * 70}ms` }}>
              <span className="dk-report-body">
                <b>{r.day}</b>
                <small>{r.text}</small>
              </span>
              {r.by === "Awaiting a rating" ? <Chip tint="slate">Awaiting a rating</Chip> : <Stars n={r.rating} />}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* --------------------------------------------------------------- leave -- */

const LEAVE = [
  { who: "Divya Ramesh", kind: "Annual leave", first: "17 Nov", last: "21 Nov", days: 5, state: "Pending" },
  { who: "Vishnu Prasad", kind: "Sick leave", first: "3 Nov", last: "3 Nov", days: 1, state: "Approved" },
  { who: "Arun Varghese", kind: "Annual leave", first: "24 Dec", last: "31 Dec", days: 6, state: "Pending" },
];

export function LeaveScreen() {
  return (
    <div className="dk-grid dk-leave">
      <Card className="dk-leave-stats" pad={false}>
        <div className="dk-stat-row">
          <Figure icon={CalendarOff} label="Awaiting You" value="2" tint="orange" sub="Awaiting a decision" />
          <Figure icon={CheckCircle2} label="Approved this month" value="9" tint="green" />
          <Figure icon={Users} label="Off today" value="3" tint="blue" />
          <Figure icon={Clock3} label="Your balance" value="12 days" tint="purple" />
        </div>
      </Card>

      <Card className="dk-leave-table" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Leave Requests" icon={CalendarOff} action={<span className="dk-mini-pill">All time</span>} />
        </div>
        <table className="dk-table">
          <thead>
            <tr><th>Person</th><th>Kind</th><th>First day</th><th>Last day</th><th>Days</th><th>State</th></tr>
          </thead>
          <tbody>
            {LEAVE.map((l) => (
              <tr key={l.who + l.first}>
                <td>
                  <span className="dk-cell-id">
                    <Avatar name={l.who} size={24} />
                    <b>{l.who}</b>
                  </span>
                </td>
                <td>{l.kind}</td>
                <td>{l.first}</td>
                <td>{l.last}</td>
                <td><b>{l.days}</b></td>
                <td>
                  {l.state === "Pending" ? (
                    <span className="dk-row-actions">
                      <span className="dk-mini-pill solid">Approve</span>
                      <span className="dk-mini-pill">Decline</span>
                    </span>
                  ) : (
                    <Chip tint="green">Approved</Chip>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------- salary -- */

const PAYSLIPS = [
  { who: "Karthik Suresh", gross: "£5,400", ded: "£1,180", net: "£4,220", state: "Paid" },
  { who: "Neha Iyer", gross: "£4,100", ded: "£890", net: "£3,210", state: "Paid" },
  { who: "Meera Krishnan", gross: "£4,600", ded: "£1,010", net: "£3,590", state: "Scheduled" },
  { who: "Arun Varghese", gross: "£3,250", ded: "£700", net: "£2,550", state: "Scheduled" },
];

export function SalaryScreen() {
  return (
    <div className="dk-grid dk-salary">
      <Card className="dk-pay-run">
        <CardHead title="November run" icon={Wallet} action={<Chip tint="orange">Runs Friday</Chip>} />
        <p className="dk-mid">£84,317</p>
        <div className="dk-meter">
          <i style={{ width: "58%" }} />
          <i style={{ width: "22%" }} />
        </div>
        <div className="dk-legend">
          <span><i style={{ background: "#4a80e8" }} />Paid</span>
          <span><i style={{ background: "#a79bf6" }} />Scheduled</span>
          <span><i style={{ background: "#e3e9fa" }} />Budget</span>
        </div>
        <div className="dk-split">
          <Figure icon={Users} label="Payslips" value="128" tint="blue" />
          <Figure icon={TrendingUp} label="Deductions" value="£18,940" tint="orange" />
        </div>
      </Card>

      <Card className="dk-pay-table" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Payslips" icon={Wallet} action={<span className="dk-mini-pill">Export</span>} />
        </div>
        <table className="dk-table">
          <thead>
            <tr><th>Person</th><th>Gross</th><th>Deductions</th><th>Net</th><th>State</th></tr>
          </thead>
          <tbody>
            {PAYSLIPS.map((p) => (
              <tr key={p.who}>
                <td>
                  <span className="dk-cell-id">
                    <Avatar name={p.who} size={24} />
                    <b>{p.who}</b>
                  </span>
                </td>
                <td>{p.gross}</td>
                <td>−{p.ded}</td>
                <td><b>{p.net}</b></td>
                <td><Chip tint={p.state === "Paid" ? "green" : "purple"}>{p.state}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------- companies -- */

const COMPANIES = [
  { name: "Jadvix Ltd", place: "Ruislip, United Kingdom", head: "College House", people: 46, branches: 1, state: "Enabled" },
  { name: "Jadvix Technologies", place: "Saidapet, Chennai", head: "Mount Road", people: 82, branches: 1, state: "Enabled" },
  { name: "Jadvix Digital Academy", place: "Chennai", head: "Mount Road", people: 24, branches: 1, state: "Enabled" },
];

export function CompaniesScreen() {
  return (
    <div className="dk-grid dk-companies">
      {COMPANIES.map((c) => (
        <Card key={c.name}>
          <CardHead title={c.name} icon={Building2} action={<Chip tint="green" dot>{c.state}</Chip>} />
          <p className="dk-sub"><MapPin size={11} /> {c.place}</p>
          <div className="dk-split">
            <Figure icon={Users} label="Headcount" value={String(c.people)} tint="blue" />
            <Figure icon={GitBranch} label="Head branch" value={c.head} tint="purple" />
          </div>
          <div className="dk-quick">
            <span className="dk-mini-pill">Edit company</span>
            <span className="dk-mini-pill">Branches</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ branches -- */

const BRANCHES = [
  { name: "Ruislip — College House", place: "17 King Edwards Rd, HA4 7AE", lead: "Meera Krishnan", people: 46, open: true },
  { name: "Chennai — Mount Road", place: "No 19/35, Little Mount, Saidapet", lead: "Karthik Suresh", people: 82, open: true },
];

export function BranchesScreen() {
  return (
    <div className="dk-grid dk-branches">
      <Card className="dk-branch-list" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Branches" icon={GitBranch} action={<span className="dk-mini-pill">New branch</span>} />
        </div>
        <ul className="dk-branch-rows">
          {BRANCHES.map((b, i) => (
            <li key={b.name} style={{ animationDelay: `${i * 80}ms` }}>
              <span className="dk-fig-ic" style={{ background: TINTS.blue.bg, color: TINTS.blue.fg }}>
                <MapPin size={15} strokeWidth={1.8} />
              </span>
              <span className="dk-branch-body">
                <b>{b.name}</b>
                <small>{b.place}</small>
              </span>
              <span className="dk-branch-lead">
                <Avatar name={b.lead} size={24} />
                <small>{b.lead}</small>
              </span>
              <i className="dk-people-hrs">{b.people}</i>
              <Chip tint="green" dot>Open</Chip>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dk-branch-side">
        <CardHead title="Where everyone is" icon={Users} />
        <div className="dk-dial-row">
          <Dial value={64} tint="blue">
            <b>128</b>
            <small>people</small>
          </Dial>
          <ul className="dk-health">
            <li><Chip tint="blue" dot>Chennai</Chip> 82</li>
            <li><Chip tint="purple" dot>Ruislip</Chip> 46</li>
          </ul>
        </div>
        <p className="dk-note">
          <b>Live</b> Headcount follows the roster, not a spreadsheet
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------- notifications -- */

const NOTES = [
  { icon: CheckCircle2, tint: "green" as const, title: "TSK-397 signed off by QC", when: "2 minutes ago", unread: true },
  { icon: Bug, tint: "red" as const, title: "BUG-118 raised as Critical on Northwind", when: "18 minutes ago", unread: true },
  { icon: CalendarOff, tint: "orange" as const, title: "Divya Ramesh requested 5 days of leave", when: "1 hour ago", unread: true },
  { icon: Target, tint: "blue" as const, title: "Your KRA moved to 94 — sprint closed clean", when: "Yesterday", unread: false },
  { icon: Wallet, tint: "purple" as const, title: "October payslip is ready", when: "2 days ago", unread: false },
];

export function NotificationsScreen() {
  return (
    <div className="dk-grid dk-notes">
      <Card className="dk-note-list" pad={false}>
        <div className="dk-sheet-head">
          <CardHead
            title="Notifications"
            icon={Bell}
            action={
              <span className="dk-head-tools">
                <Chip tint="red">3 unread</Chip>
                <span className="dk-mini-pill">Mark all read</span>
              </span>
            }
          />
        </div>
        <ul className="dk-note-rows">
          {NOTES.map((n, i) => {
            const Icon = n.icon;
            return (
              <li key={i} data-unread={n.unread} style={{ animationDelay: `${i * 60}ms` }}>
                <span className="dk-fig-ic" style={{ background: TINTS[n.tint].bg, color: TINTS[n.tint].fg }}>
                  <Icon size={14} strokeWidth={1.8} />
                </span>
                <span className="dk-note-body">
                  <b>{n.title}</b>
                  <small>{n.when}</small>
                </span>
                {n.unread && <i className="dk-dot-unread" />}
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="dk-note-side">
        <CardHead title="Delivered live" icon={Bell} />
        <p className="dk-sub">
          Notifications arrive over the same websocket as presence, so a verdict reaches the developer the
          moment QC saves it.
        </p>
        <div className="dk-split">
          <Figure icon={Bell} label="This week" value="214" tint="blue" />
          <Figure icon={Clock3} label="Median delivery" value="0.4s" tint="green" />
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------- module access -- */

const ACCESS_ROWS = [
  { portal: "Master Portal", grants: [true, true, true, true, true, true] },
  { portal: "Super Admin", grants: [true, true, true, true, true, true] },
  { portal: "Manager 1", grants: [true, true, true, false, true, true] },
  { portal: "Team Leader 1", grants: [true, false, true, false, true, false] },
  { portal: "Quality Check 1", grants: [false, false, true, false, true, false] },
  { portal: "Client Portal", grants: [false, false, false, false, false, true] },
];

const ACCESS_COLS = ["Dashboard", "Salary", "Playground", "Companies", "Checklist", "Monitor"];

export function AccessScreen({ live }: { live: boolean }) {
  const [rows, setRows] = useState(ACCESS_ROWS);

  return (
    <div className="dk-grid dk-access">
      <Card className="dk-access-grid" pad={false}>
        <div className="dk-sheet-head">
          <CardHead
            title="Module Access"
            icon={KeyRound}
            action={<span className="dk-head-tools"><Chip tint="orange">Unsaved changes</Chip><span className="dk-mini-pill solid">Save access</span></span>}
          />
        </div>
        <table className="dk-table dk-matrix">
          <thead>
            <tr>
              <th>Portal</th>
              {ACCESS_COLS.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.portal}>
                <td><b>{r.portal}</b></td>
                {r.grants.map((g, ci) => (
                  <td key={ci}>
                    <button
                      type="button"
                      className={`dk-toggle ${g ? "on" : ""}`}
                      aria-pressed={g}
                      aria-label={`${ACCESS_COLS[ci]} for ${r.portal}`}
                      tabIndex={live ? 0 : -1}
                      onClick={() =>
                        live &&
                        setRows((rs) =>
                          rs.map((row, k) =>
                            k === ri ? { ...row, grants: row.grants.map((v, j) => (j === ci ? !v : v)) } : row,
                          ),
                        )
                      }
                    >
                      <i />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="dk-access-side">
        <CardHead title="Always on" icon={Lock} />
        <p className="dk-sub">
          Ten modules are mandatory for every portal — Projects, Tasks, Requests, Communication and the rest a
          role needs to do any work at all. They render locked on.
        </p>
        <ul className="dk-locked">
          {["Projects", "Tasks", "Requests", "Communication", "Clock", "Calendar"].map((m) => (
            <li key={m}>
              <Lock size={11} /> {m}
            </li>
          ))}
        </ul>
        <p className="dk-note">
          <b>Mandatory</b> Withholding these would leave work with nowhere to go
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------ settings -- */

export function SettingsScreen() {
  return (
    <div className="dk-grid dk-settings">
      <Card className="dk-set-profile">
        <CardHead title="Profile" icon={UserCheck} />
        <div className="dk-person-top">
          <Avatar name="Neha Iyer" size={48} />
          <span>
            <b>Neha Iyer</b>
            <small>Software Engineer · Platform squad</small>
          </span>
        </div>
        <div className="dk-fields">
          <label>
            Full name
            <span>Neha Iyer</span>
          </label>
          <label>
            Work email
            <span><Mail size={11} /> neha@jadvix.uk</span>
          </label>
          <label>
            Branch
            <span><MapPin size={11} /> Chennai — Mount Road</span>
          </label>
        </div>
        <div className="dk-quick">
          <span className="dk-mini-pill solid">Save changes</span>
        </div>
      </Card>

      <Card className="dk-set-security">
        <CardHead title="Security" icon={Lock} />
        <ul className="dk-set-list">
          <li>
            <span><b>Password</b><small>Changed 42 days ago</small></span>
            <span className="dk-mini-pill">Change</span>
          </li>
          <li>
            <span><b>Active sessions</b><small>2 devices signed in</small></span>
            <span className="dk-mini-pill">Review</span>
          </li>
          <li>
            <span><b>Refresh tokens</b><small>Rotate on every use</small></span>
            <Chip tint="green" dot>On</Chip>
          </li>
        </ul>
      </Card>

      <Card className="dk-set-appearance">
        <CardHead title="Workspace" icon={SettingsIcon} />
        <ul className="dk-set-list">
          <li>
            <span><b>Accent</b><small>Used across your portal</small></span>
            <span className="dk-swatches">
              {["#2f63e8", "#6d4aef", "#1b92c9", "#1f9d4d", "#d2800f"].map((c, i) => (
                <i key={c} className={i === 0 ? "on" : ""} style={{ background: c }} />
              ))}
            </span>
          </li>
          <li>
            <span><b>Density</b><small>How much fits on a screen</small></span>
            <Chip tint="blue">Comfortable</Chip>
          </li>
          <li>
            <span><b>Desktop notifications</b><small>Verdicts and mentions</small></span>
            <Chip tint="green" dot>On</Chip>
          </li>
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------- student -- */

const COURSES = [
  { name: "React and Next.js foundations", pct: 100, state: "Complete", tint: "green" as const },
  { name: "TypeScript for production apps", pct: 72, state: "In progress", tint: "blue" as const },
  { name: "API design and Prisma", pct: 38, state: "In progress", tint: "purple" as const },
  { name: "Testing and release process", pct: 0, state: "Locked", tint: "slate" as const },
];

export function StudentScreen() {
  return (
    <div className="dk-grid dk-student">
      <Card className="dk-course-list" pad={false}>
        <div className="dk-sheet-head">
          <CardHead title="Your coursework" icon={BookOpen} action={<Chip tint="blue">Internship · week 9</Chip>} />
        </div>
        <ul className="dk-course-rows">
          {COURSES.map((c, i) => (
            <li key={c.name} style={{ animationDelay: `${i * 80}ms` }}>
              <span className="dk-course-body">
                <b>{c.name}</b>
                <Bar value={c.pct} tint={c.tint} />
              </span>
              <i className="dk-people-hrs">{c.pct}%</i>
              <Chip tint={c.tint}>{c.state}</Chip>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dk-student-side">
        <CardHead title="Attendance" icon={Clock3} />
        <div className="dk-dial-row">
          <Dial value={88} tint="green">
            <b>88%</b>
            <small>present</small>
          </Dial>
          <div>
            <p className="dk-sub">44 of 50 sessions</p>
            <p className="dk-streak"><GraduationCap size={13} /> <b>Week 9</b> of 12</p>
          </div>
        </div>
        <div className="dk-split">
          <Figure icon={Award} label="Mentor review" value="4.5 / 5" tint="purple" sub="Elavarasi Manoharan" />
        </div>
      </Card>

      <Card className="dk-cert">
        <CardHead title="Certificate" icon={Award} action={<Chip tint="orange">3 weeks to go</Chip>} />
        <div className="dk-cert-body">
          <span className="dk-cert-seal">
            <GraduationCap size={26} strokeWidth={1.6} />
          </span>
          <div>
            <p className="dk-kra-name">Jadvix Digital Academy</p>
            <p className="dk-sub">Issued once coursework, attendance and the mentor review are all complete.</p>
          </div>
        </div>
        <ul className="dk-cert-checks">
          <li data-ok="true"><CheckCircle2 size={13} /> Attendance above 80%</li>
          <li data-ok="true"><CheckCircle2 size={13} /> Mentor review filed</li>
          <li data-ok="false"><Clock3 size={13} /> All four courses complete</li>
        </ul>
      </Card>
    </div>
  );
}
