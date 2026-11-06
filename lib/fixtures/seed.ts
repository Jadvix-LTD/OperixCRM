/*
 * The fixture workspace.
 *
 * Three branches, forty-odd employees, two cohorts, eight projects and a few
 * hundred tasks — large enough that layouts break here rather than in
 * production, and realistic enough that a stakeholder can give real feedback.
 *
 * EVERYTHING IS DETERMINISTIC. The generator is seeded, so the server render
 * and the browser render produce byte-identical data; a Math.random() here
 * would hydrate as a mismatch on every page. Built once at module load.
 *
 * Names are varied and plausible rather than "John Doe", and figures are
 * messy rather than round, because round numbers in a demo read as fake.
 */

import type { Day, Id, Instant } from "../contract/common";
import { money } from "../contract/common";
import type {
  Branch,
  DailyReport,
  KraEvent,
  LeaveRequest,
  PersonDirectory,
  PersonSensitive,
  PersonWork,
  Presence,
  Shift,
  Team,
} from "../contract/people";
import type { Project, Sprint, Task, TaskState } from "../contract/scrum";
import type { Cohort, FeePlan, GateAttempt, Invoice, StageId, StudentProgress } from "../contract/academy";
import type {
  AuditEntry,
  CalendarEvent,
  ClientAccount,
  Grant,
  LedgerEntry,
  Lead,
  Notification,
  Payslip,
  Thread,
} from "../contract/system";
import type { RoleId } from "../access/roles";

/* ------------------------------------------------------------- the dice -- */

/** mulberry32 — small, fast, and identical on both sides of hydration. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r = rng(20261107);
const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];
const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
const chance = (p: number) => r() < p;

/** Days before or after a fixed "today", so the data never goes stale-looking. */
const TODAY = new Date("2026-11-07T00:00:00Z");
function day(offset: number): Day {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}
function instant(offsetDays: number, hour = 9, minute = 0): Instant {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

/* ------------------------------------------------------------- branches -- */

export const branches: Branch[] = [
  { id: "br-ruislip", name: "Ruislip — College House", city: "Ruislip", country: "GB", currency: "GBP", isHead: true, headcount: 0, leadId: null },
  { id: "br-chennai", name: "Chennai — Mount Road", city: "Chennai", country: "IN", currency: "INR", isHead: false, headcount: 0, leadId: null },
  { id: "br-coimbatore", name: "Coimbatore", city: "Coimbatore", country: "IN", currency: "INR", isHead: false, headcount: 0, leadId: null },
];

const branchName = (id: Id) => branches.find((b) => b.id === id)!.name;
const branchCurrency = (id: Id) => branches.find((b) => b.id === id)!.currency;

/* --------------------------------------------------------------- people -- */

const FIRST = [
  "Karthik", "Neha", "Meera", "Arun", "Rahul", "Divya", "Vishnu", "Anjali", "Priya", "Rohan",
  "Sneha", "Vikram", "Aarav", "Kavya", "Ishaan", "Lakshmi", "Nikhil", "Tara", "Joel", "Fatima",
  "Samuel", "Grace", "Oliver", "Amelia", "Noah", "Zara", "Ethan", "Leila", "Marcus", "Priyanka",
  "Deepak", "Ananya", "Suresh", "Riya", "Imran", "Chloe", "Daniel", "Nisha", "Felix", "Aisha",
];
const LAST = [
  "Suresh", "Iyer", "Krishnan", "Varghese", "Nair", "Ramesh", "Prasad", "Thomas", "Raghavan", "Kurian",
  "Pillai", "Das", "Menon", "Sharma", "Bose", "Reddy", "Fernandes", "Khan", "Barnes", "Whitfield",
];

const TITLES: Record<string, string[]> = {
  developer: ["Software Engineer", "Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "UI Designer", "Video Editor"],
  qc: ["QA Lead", "QA Engineer", "QA Analyst"],
  lead: ["Team Leader — Platform", "Team Leader — Web", "Team Leader — Media"],
  manager: ["Delivery Manager", "Engineering Manager"],
  coordinator: ["Technical Coordinator", "English Coordinator"],
  sales: ["Sales Executive", "Sales Manager"],
};

const PRESENCE: Presence[] = ["online", "online", "online", "away", "busy", "offline"];
const STATUS = [
  "Reviewing the Kestrel release branch",
  "Heads down on the checkout regression",
  "Client demo with Lumen Health",
  "Clearing the checklist queue",
  "Back at 15:30",
  "Writing up the sprint notes",
  null,
];

type Person = { dir: PersonDirectory; work: PersonWork; sensitive: PersonSensitive };

function makePerson(i: number, role: RoleId, branchId: Id, teamIds: Id[], fixedName?: string): Person {
  const name = fixedName ?? `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`;
  const id = `u-${String(i).padStart(3, "0")}`;
  const jobTitle = pick(TITLES[role] ?? ["Team Member"]);
  const kra = int(74, 99);
  const minutes = int(120, 190) * 60 + int(0, 59);

  const dir: PersonDirectory = {
    id,
    name,
    jobTitle,
    roles: [role],
    branchId,
    branchName: branchName(branchId),
    teamIds,
    workEmail: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1].toLowerCase()}@jadvix.uk`,
    avatar: null,
    presence: pick(PRESENCE),
    statusText: pick(STATUS),
    state: chance(0.08) ? "leave" : chance(0.1) ? "available" : "active",
  };

  const work: PersonWork = {
    ...dir,
    empId: `JDX-${String(i + 1).padStart(3, "0")}`,
    joinedAt: day(-int(90, 1500)),
    reportsToId: null,
    kra,
    openTasks: int(0, 9),
    doneTasks: int(12, 180),
    consistency: int(68, 99),
    minutesThisMonth: minutes,
    overtimeMinutes: int(0, 1400),
  };

  const currency = branchCurrency(branchId);
  const sensitive: PersonSensitive = {
    id,
    salary: money(currency === "GBP" ? int(2800, 6400) : int(48000, 142000), currency),
    bankLast4: String(int(1000, 9999)),
    personalPhone: currency === "GBP" ? `+44 7${int(100, 999)} ${int(100000, 999999)}` : `+91 9${int(10000, 99999)} ${int(10000, 99999)}`,
    address: `${int(1, 180)} ${pick(["King Edwards Rd", "Mount Road", "Avinashi Road", "College Lane", "Little Mount"])}`,
    dateOfBirth: day(-int(8000, 16000)),
    documents: [
      { id: `doc-${id}-1`, label: "Signed contract", uploadedAt: instant(-int(200, 900)) },
      { id: `doc-${id}-2`, label: "Right to work", uploadedAt: instant(-int(200, 900)) },
    ],
  };

  return { dir, work, sensitive };
}

/* ------------------------------------------------------------- the team -- */

export const teams: Team[] = [
  { id: "t-platform", name: "Platform squad", description: "Core services and the API", leadId: "u-002", memberIds: [], branchId: "br-chennai" },
  { id: "t-web", name: "Web squad", description: "Client-facing applications", leadId: "u-008", memberIds: [], branchId: "br-ruislip" },
  { id: "t-quality", name: "Quality", description: "Checklist, verdicts and release sign-off", leadId: "u-004", memberIds: [], branchId: "br-ruislip" },
  { id: "t-media", name: "Media", description: "Video and design", leadId: null, memberIds: [], branchId: "br-coimbatore" },
  { id: "t-growth", name: "Growth", description: "Leads, accounts and proposals", leadId: null, memberIds: [], branchId: "br-ruislip" },
  { id: "t-academy", name: "Academy", description: "Coordinators and mentors", leadId: null, memberIds: [], branchId: "br-coimbatore" },
];

/*
 * The roster.
 *
 * Index 0–9 are the demo viewers in lib/access/session.tsx, in the same
 * order, so "signed in as Karthik Suresh" reads the row that actually
 * belongs to him rather than a lookalike.
 */
/*
 * The first eight rows are NAMED and are the people the dev role switcher
 * signs you in as. They must exist in the roster: the scope filter resolves
 * a viewer to their row to find their branch and their teams, and a viewer
 * with no row would see nothing at all.
 *
 * Student and Client are deliberately absent — one is not an employee and
 * the other is external. Both reach records by membership instead.
 */
const ROSTER_PLAN: { role: RoleId; branchId: Id; teamIds: Id[]; name?: string }[] = [
  { name: "Jachin Raja", role: "manager", branchId: "br-ruislip", teamIds: [] },
  { name: "Priya Raghavan", role: "manager", branchId: "br-chennai", teamIds: ["t-platform", "t-web"] },
  { name: "Karthik Suresh", role: "lead", branchId: "br-chennai", teamIds: ["t-platform"] },
  { name: "Elavarasi Manoharan", role: "coordinator", branchId: "br-coimbatore", teamIds: ["t-academy"] },
  { name: "Rahul Nair", role: "qc", branchId: "br-ruislip", teamIds: ["t-quality"] },
  { name: "Neha Iyer", role: "developer", branchId: "br-chennai", teamIds: ["t-platform"] },
  { name: "Vishnu Prasad", role: "developer", branchId: "br-chennai", teamIds: ["t-platform"] },
  { name: "Negha Sharma", role: "sales", branchId: "br-ruislip", teamIds: ["t-growth"] },
  { role: "lead", branchId: "br-ruislip", teamIds: ["t-web"] },
  { role: "developer", branchId: "br-coimbatore", teamIds: ["t-media"] },
  { role: "qc", branchId: "br-ruislip", teamIds: ["t-quality"] },
  { role: "qc", branchId: "br-coimbatore", teamIds: ["t-quality"] },
  { role: "manager", branchId: "br-ruislip", teamIds: ["t-web"] },
  { role: "coordinator", branchId: "br-coimbatore", teamIds: ["t-academy"] },
  { role: "sales", branchId: "br-ruislip", teamIds: ["t-growth"] },
];

/** The roster ids the dev role switcher signs in as, by role. */
export const VIEWER_IDS = {
  ceo: "u-000",
  manager: "u-001",
  lead: "u-002",
  coordinator: "u-003",
  qc: "u-004",
  developer: "u-005",
  intern: "u-006",
  sales: "u-007",
} as const;

const people: Person[] = [];
for (let i = 0; i < 42; i += 1) {
  const plan =
    ROSTER_PLAN[i] ??
    {
      role: pick<RoleId>(["developer", "developer", "developer", "qc", "sales"]),
      branchId: pick(branches).id,
      teamIds: [pick(teams).id],
    };
  people.push(makePerson(i, plan.role, plan.branchId, plan.teamIds, plan.name));
}

// Reporting lines: everyone rolls up to a manager in their own branch.
const managers = people.filter((p) => p.dir.roles.includes("manager"));
for (const p of people) {
  if (p.dir.roles.includes("manager")) continue;
  const boss = managers.find((m) => m.dir.branchId === p.dir.branchId) ?? managers[0];
  p.work.reportsToId = boss.dir.id;
}

for (const t of teams) t.memberIds = people.filter((p) => p.dir.teamIds.includes(t.id)).map((p) => p.dir.id);
for (const b of branches) b.headcount = people.filter((p) => p.dir.branchId === b.id).length;

export const directory: PersonDirectory[] = people.map((p) => p.dir);
export const workRecords: PersonWork[] = people.map((p) => p.work);
export const sensitiveRecords: PersonSensitive[] = people.map((p) => p.sensitive);

/* ------------------------------------------------------------- academy -- */

export const cohorts: Cohort[] = [
  {
    id: "c-2026a",
    name: "Cohort 2026-A",
    branchId: "br-coimbatore",
    startedOn: day(-240),
    technicalCoordinatorId: "u-003",
    englishCoordinatorId: "u-013",
    studentIds: [],
  },
  {
    id: "c-2026b",
    name: "Cohort 2026-B",
    branchId: "br-chennai",
    startedOn: day(-90),
    technicalCoordinatorId: "u-003",
    englishCoordinatorId: "u-013",
    studentIds: [],
  },
];

function gatesFor(stage: StageId, i: number): GateAttempt[] {
  const order: StageId[] = ["frontend", "backend", "agentic"];
  const reached = order.indexOf(stage);
  return order.slice(0, reached + 1).map((s, k) => {
    const done = k < reached;
    const parts =
      s === "backend"
        ? [
            { label: "Practical test", passed: done ? true : null, score: done ? int(62, 94) : null },
            { label: "Full stack project", passed: done ? true : null, score: done ? int(60, 92) : null },
          ]
        : [{ label: s === "agentic" ? "Capstone" : "Evaluation", passed: done ? true : null, score: done ? int(64, 96) : null }];
    return {
      id: `g-${i}-${s}`,
      stageId: s,
      attempt: 1,
      outcome: done ? "passed" : chance(0.25) ? "scheduled" : "not-attempted",
      takenOn: done ? day(-int(30, 200)) : null,
      retryAvailableOn: null,
      parts,
      assessorId: done ? "u-003" : null,
      note: null,
    };
  });
}

export const students: StudentProgress[] = [];
for (let i = 0; i < 24; i += 1) {
  const cohort = cohorts[i < 13 ? 0 : 1];
  const stage: StageId = cohort.id === "c-2026a" ? pick(["backend", "backend", "agentic"]) : "frontend";
  const name = `${FIRST[(i * 3 + 5) % FIRST.length]} ${LAST[(i * 11 + 3) % LAST.length]}`;
  const id = `s-${String(i).padStart(3, "0")}`;
  const interning = stage !== "frontend" && chance(0.35);

  students.push({
    id,
    name,
    avatar: null,
    cohortId: cohort.id,
    cohortName: cohort.name,
    branchId: cohort.branchId,
    currentStage: stage,
    state: interning ? "interning" : "enrolled",
    joinedAt: cohort.startedOn,
    coursework: {
      frontend: stage === "frontend" ? int(20, 95) : 100,
      backend: stage === "backend" ? int(15, 88) : stage === "agentic" ? 100 : 0,
      agentic: stage === "agentic" ? int(10, 70) : 0,
    },
    attendance: int(62, 99),
    mentorScore: chance(0.7) ? Number((3 + r() * 2).toFixed(1)) : null,
    gates: gatesFor(stage, i),
    assignedProjectIds: [],
    // Loophole 3: no signature, no client project.
    termsSignedAt: interning || chance(0.5) ? instant(-int(20, 180)) : null,
  });
}
for (const c of cohorts) c.studentIds = students.filter((s) => s.cohortId === c.id).map((s) => s.id);

export const feePlans: FeePlan[] = students.map((s) => {
  const kind = chance(0.55) ? "monthly" : "one-time";
  const total = money(kind === "monthly" ? 75000 : 65000, "INR");
  const count = kind === "monthly" ? 10 : 1;
  const per = Math.round(total.amount / count);
  const paidCount = int(1, count);
  return {
    id: `fp-${s.id}`,
    studentId: s.id,
    kind,
    covers: "full",
    total,
    paid: money(per * paidCount, "INR"),
    instalments: Array.from({ length: count }, (_, k) => ({
      id: `in-${s.id}-${k}`,
      dueOn: day(-240 + k * 30),
      amount: money(per, "INR"),
      state: k < paidCount ? "paid" : k === paidCount && chance(0.3) ? "overdue" : "due",
      paidOn: k < paidCount ? day(-240 + k * 30 + int(0, 4)) : null,
      invoiceId: k < paidCount ? `inv-${s.id}-${k}` : null,
    })),
    adjustment:
      s.state === "interning" ? { reason: "Internship — 50% off the remaining stage fee", percent: 50 } : null,
  };
});

export const invoices: Invoice[] = feePlans.flatMap((fp) =>
  fp.instalments
    .filter((i) => i.state === "paid")
    .map((i, k) => ({
      id: i.invoiceId!,
      number: `JDX-${fp.studentId.slice(2)}-${String(k + 1).padStart(2, "0")}`,
      studentId: fp.studentId,
      issuedOn: i.dueOn,
      amount: i.amount,
      state: "paid" as const,
      providerOrderId: `order_${fp.studentId}${k}`,
      providerPaymentId: `pay_${fp.studentId}${k}`,
    })),
);

/* ------------------------------------------------------------ projects -- */

const PROJECT_SEEDS: { code: string; name: string; client: string; branchId: Id; state: Project["state"] }[] = [
  { code: "NWC", name: "Northwind Commerce", client: "Northwind Ltd", branchId: "br-ruislip", state: "in-scope" },
  { code: "LMP", name: "Lumen Patient Portal", client: "Lumen Health", branchId: "br-chennai", state: "in-scope" },
  { code: "KSF", name: "Kestrel Fleet", client: "Kestrel Logistics", branchId: "br-chennai", state: "running-late" },
  { code: "HBI", name: "Harbour Intranet", client: "Harbour Group", branchId: "br-ruislip", state: "planning" },
  { code: "ORB", name: "Orbit Analytics", client: "Orbit Media", branchId: "br-coimbatore", state: "in-scope" },
  { code: "MER", name: "Meridian Rebrand", client: "Meridian Foods", branchId: "br-coimbatore", state: "delivered" },
  { code: "ACD", name: "Academy Assessment Build", client: null as unknown as string, branchId: "br-coimbatore", state: "in-scope" },
  { code: "INT", name: "OperixCRM Internal", client: null as unknown as string, branchId: "br-ruislip", state: "in-scope" },
];

export const clients: ClientAccount[] = PROJECT_SEEDS.filter((p) => p.client).map((p, i) => ({
  id: `cl-${String(i).padStart(2, "0")}`,
  code: `CL-${String(i + 1).padStart(2, "0")}`,
  name: p.client,
  contact: `${FIRST[(i * 5) % FIRST.length]} ${LAST[(i * 4) % LAST.length]}`,
  email: `hello@${p.client.toLowerCase().replace(/[^a-z]/g, "")}.com`,
  industry: pick(["Retail", "Healthcare", "Logistics", "Media", "Food"]),
  health: pick(["healthy", "healthy", "watch", "at-risk"]),
  lifetimeValue: money(int(42000, 420000), "GBP"),
  since: String(int(2019, 2025)),
  ownerId: "u-010",
  projectIds: [],
}));

export const projects: Project[] = PROJECT_SEEDS.map((seed, i) => {
  const client = clients.find((c) => c.name === seed.client) ?? null;
  const pool = people.filter((p) => p.dir.branchId === seed.branchId || chance(0.3));
  const chosen = pool.slice(0, int(3, 7));
  const currency = branchCurrency(seed.branchId);

  return {
    id: `p-${String(i).padStart(2, "0")}`,
    code: seed.code,
    name: seed.name,
    description: null,
    problemStatement: null,
    solution: null,
    clientId: client?.id ?? null,
    clientName: client?.name ?? null,
    branchId: seed.branchId,
    state: seed.state,
    progress: int(12, 97),
    budget: money(currency === "GBP" ? int(28000, 160000) : int(400000, 2400000), currency),
    startDate: day(-int(60, 400)),
    dueDate: day(int(10, 180)),
    members: chosen.map((p, k) => ({
      userId: p.dir.id,
      role: k === 0 ? ("manager" as const) : ("member" as const),
      state: k === 0 || chance(0.85) ? ("accepted" as const) : ("invited" as const),
      invitedAt: instant(-int(20, 200)),
      respondedAt: instant(-int(1, 19)),
    })),
    teamIds: [pick(teams).id],
    plan: ["Discovery and scope", "Design sign-off", "Build — phase one", "Build — phase two", "UAT and handover"].map(
      (label, k) => ({
        id: `m-${i}-${k}`,
        label,
        due: day(-120 + k * 45),
        state: k < 3 ? ("done" as const) : k === 3 ? ("in-progress" as const) : ("planned" as const),
        note: null,
      }),
    ),
    studentsAllowed: seed.code === "ACD" || seed.code === "INT",
  };
});
for (const c of clients) c.projectIds = projects.filter((p) => p.clientId === c.id).map((p) => p.id);

// Students are only ever assigned to projects that permit them.
const studentProjects = projects.filter((p) => p.studentsAllowed).map((p) => p.id);
for (const s of students) {
  if (s.termsSignedAt) s.assignedProjectIds = [pick(studentProjects)];
}

export const sprints: Sprint[] = projects.flatMap((p, i) =>
  [1, 2, 3].map((n) => ({
    id: `sp-${i}-${n}`,
    projectId: p.id,
    name: `Sprint ${n}`,
    goal: null,
    state: n === 3 ? ("active" as const) : ("completed" as const),
    startDate: day(-90 + n * 21),
    endDate: day(-90 + n * 21 + 14),
  })),
);

/* --------------------------------------------------------------- tasks -- */

const TASK_TITLES = [
  "Checkout totals wrong with a discount code", "Invoice PDF misses the VAT line",
  "Sprint board drag drops on the wrong column", "Payroll export for October",
  "Client portal invoice view", "Rebuild the attendance strip",
  "Rotate refresh tokens on reuse", "Add multikey index on assigneeIds",
  "Gate result email to the student", "Razorpay webhook signature check",
  "Branch currency on the dashboard", "Archive instead of delete for employees",
  "Fee adjustment when an internship starts", "Audit entry on every tier-2 read",
  "Stage unlock after a passing verdict", "Command palette keyboard trap",
  "Daily report reminder at 17:30", "Overtime rollup per branch",
];
const TASK_STATES: TaskState[] = ["not-started", "working", "working", "stuck", "in-qc", "done", "done"];

export const tasks: Task[] = [];
let taskNo = 400;
for (const p of projects) {
  const accepted = p.members.filter((m) => m.state === "accepted").map((m) => m.userId);
  for (let k = 0; k < int(18, 34); k += 1) {
    taskNo += 1;
    const state = pick(TASK_STATES);
    const checklist = Array.from({ length: int(3, 6) }, (_, c) => ({
      id: `ck-${taskNo}-${c}`,
      label: pick([
        "Acceptance criteria met", "Unit tests cover the change", "No console errors",
        "Responsive to 375px", "Copy proofread", "Migration is reversible",
      ]),
      score: state === "done" ? 1 : Number(r().toFixed(2)),
      points: int(1, 3),
    }));
    tasks.push({
      id: `t-${taskNo}`,
      code: `${p.code}-${taskNo}`,
      title: pick(TASK_TITLES),
      description: null,
      projectId: p.id,
      projectName: p.name,
      sprintId: chance(0.8) ? `sp-${projects.indexOf(p)}-${int(1, 3)}` : null,
      assigneeIds: accepted.length ? [accepted[int(0, accepted.length - 1)]] : [],
      state,
      priority: int(1, 5),
      points: checklist.reduce((n, c) => n + c.points, 0),
      checklist,
      qcReviews: [],
      startDate: day(-int(1, 60)),
      dueDate: day(int(-10, 40)),
      origin: chance(0.12)
        ? { kind: "qc-bug", severity: pick(["critical", "major", "major", "minor"]), raisedByUserId: "u-004", foundIn: p.name }
        : null,
      attachmentCount: int(0, 4),
    });
  }
}

/* -------------------------------------------------- attendance and work -- */

export const shifts: Shift[] = [];
export const dailyReports: DailyReport[] = [];
for (const p of people.slice(0, 24)) {
  for (let d = 0; d < 22; d += 1) {
    const date = day(-d);
    const weekend = new Date(`${date}T00:00:00Z`).getUTCDay() % 6 === 0;
    if (weekend) continue;
    const inHour = 8 + int(0, 2);
    shifts.push({
      id: `sh-${p.dir.id}-${d}`,
      userId: p.dir.id,
      date,
      inAt: instant(-d, inHour, int(0, 59)),
      outAt: d === 0 ? null : instant(-d, inHour + int(8, 10), int(0, 59)),
      breakMinutes: int(0, 60),
      tzOffset: p.dir.branchId === "br-ruislip" ? 0 : -330,
    });
    if (chance(0.8)) {
      dailyReports.push({
        id: `dr-${p.dir.id}-${d}`,
        userId: p.dir.id,
        date,
        headline: pick(["Closed the regression", "Sprint planning and two tasks", "Payroll export", "QC queue cleared"]),
        body: "Picked up the assigned work, paired on the tricky part, and left notes on the ticket.",
        stars: chance(0.75) ? int(3, 5) : null,
        ratedById: chance(0.75) ? "u-008" : null,
        feedback: null,
      });
    }
  }
}

export const leaveRequests: LeaveRequest[] = people.slice(0, 14).map((p, i) => ({
  id: `lv-${i}`,
  userId: p.dir.id,
  kind: pick(["annual", "annual", "sick", "unpaid"]),
  firstDay: day(int(2, 40)),
  lastDay: day(int(41, 48)),
  days: int(1, 6),
  state: i < 4 ? "pending" : pick(["approved", "approved", "declined"]),
  note: null,
  decidedById: i < 4 ? null : "u-008",
}));

export const kraEvents: KraEvent[] = people.slice(0, 20).flatMap((p, i) =>
  Array.from({ length: int(2, 5) }, (_, k) => {
    const up = chance(0.65);
    return {
      id: `kra-${i}-${k}`,
      userId: p.dir.id,
      delta: up ? int(1, 5) : -int(1, 4),
      reason: up
        ? pick(["Sprint closed with no QC errors", "Daily reports filed all month", "Picked up work outside the sprint"])
        : pick(["QC error — checkout regression", "QC error — missing tests", "Overdue task reassigned"]),
      balanceAfter: p.work.kra,
      at: instant(-int(1, 60)),
      taskId: null,
    };
  }),
);

/* ------------------------------------------------------ finance and org -- */

export const payslips: Payslip[] = people.map((p, i) => {
  const s = sensitiveRecords[i];
  const deductions = money(Math.round(s.salary.amount * 0.21), s.salary.currency);
  return {
    id: `ps-${p.dir.id}`,
    userId: p.dir.id,
    period: "November 2026",
    gross: s.salary,
    deductions,
    net: money(s.salary.amount - deductions.amount, s.salary.currency),
    state: chance(0.6) ? "paid" : "scheduled",
    paidOn: chance(0.6) ? day(-int(1, 8)) : null,
  };
});

export const ledger: LedgerEntry[] = Array.from({ length: 48 }, (_, i) => {
  const b = pick(branches);
  const revenue = chance(0.45);
  return {
    id: `le-${i}`,
    kind: revenue ? ("revenue" as const) : ("expense" as const),
    category: revenue
      ? pick(["Client invoice", "Academy fees", "Retainer"])
      : pick(["Salaries", "Software", "Office", "Travel", "Marketing"]),
    description: revenue ? pick(clients).name : pick(["Monthly payroll", "Atlas and ImageKit", "Rent", "Client visit"]),
    amount: money(b.currency === "GBP" ? int(1200, 48000) : int(80000, 1900000), b.currency),
    on: day(-int(1, 180)),
    branchId: b.id,
  };
});

export const leads: Lead[] = Array.from({ length: 34 }, (_, i) => ({
  id: `ld-${i}`,
  name: `${FIRST[(i * 9) % FIRST.length]} ${LAST[(i * 6) % LAST.length]}`,
  company: pick(["Brightline", "Calder & Co", "Dunmore Retail", "Everly Health", "Fathom Labs", "Granite Works"]),
  email: `contact${i}@example.com`,
  stage: pick(["contacted", "contacted", "qualified", "proposal", "won", "lost"]),
  value: money(int(4000, 96000), "GBP"),
  ownerId: pick(["u-010", "u-011"]),
  lastTouchedAt: instant(-int(0, 40)),
}));

/* --------------------------------------------------------------- system -- */

export const notifications: Notification[] = Array.from({ length: 18 }, (_, i) => ({
  id: `n-${i}`,
  toUserId: pick(people).dir.id,
  kind: pick(["verdict", "defect", "leave", "kra", "payroll", "invitation"]),
  title: pick([
    "Task signed off by QC",
    "Critical defect raised on Northwind",
    "Leave request awaiting your decision",
    "Your KRA moved to 94",
    "October payslip is ready",
    "You were invited to Kestrel Fleet",
  ]),
  detail: "Opened from the module it belongs to.",
  read: chance(0.6),
  at: instant(-int(0, 6), int(8, 18)),
  href: null,
}));

export const calendarEvents: CalendarEvent[] = Array.from({ length: 26 }, (_, i) => ({
  id: `ev-${i}`,
  kind: pick(["standup", "standup", "meeting", "release", "leave", "gate"]),
  label: pick([
    "Platform squad standup",
    "Northwind sprint review",
    "Kestrel v2.4 release",
    "Payroll sign-off",
    "Backend gate — Cohort 2026-A",
    "Client demo — Lumen",
  ]),
  on: day(int(-10, 24)),
  time: chance(0.85) ? pick(["09:30", "11:00", "14:00", "16:30"]) : null,
  attendeeIds: [],
  branchId: pick(branches).id,
}));

export const threads: Thread[] = [
  { id: "th-1", name: "Platform squad", policy: "staff", memberIds: teams[0].memberIds, projectId: null, cohortId: null, unread: 3, lastMessage: { authorId: "u-000", preview: "Pushed the fix", at: instant(0, 10, 12) } },
  { id: "th-2", name: "Northwind — client", policy: "client", memberIds: ["u-010", "u-008"], projectId: "p-00", cohortId: null, unread: 0, lastMessage: { authorId: "u-010", preview: "Looks good to me", at: instant(-1, 16, 4) } },
  { id: "th-3", name: "QC queue", policy: "staff", memberIds: teams[2].memberIds, projectId: null, cohortId: null, unread: 1, lastMessage: { authorId: "u-004", preview: "Two items sent back", at: instant(0, 9, 40) } },
  { id: "th-4", name: "Cohort 2026-A", policy: "student", memberIds: ["u-012", "u-013"], projectId: null, cohortId: "c-2026a", unread: 0, lastMessage: { authorId: "u-012", preview: "Gate results on Friday", at: instant(-2, 12, 0) } },
  { id: "th-5", name: "Announcements", policy: "announcement", memberIds: [], projectId: null, cohortId: null, unread: 0, lastMessage: { authorId: "u-008", preview: "Payroll runs Friday", at: instant(-3, 9, 0) } },
];

export const grants: Grant[] = [
  { id: "gr-1", userId: "u-008", module: "salary", action: "view", scope: "branch", expiresAt: null, grantedById: "u-ceo", grantedAt: instant(-40) },
  { id: "gr-2", userId: "u-010", module: "employees", action: "view", scope: "all", expiresAt: instant(14), grantedById: "u-ceo", grantedAt: instant(-6) },
];

export const auditLog: AuditEntry[] = [
  { id: "a-1", at: instant(0, 9, 14), actorId: "u-ceo", actorName: "Jachin Raja", action: "grant.added", subject: "Priya Raghavan", detail: "salary.view:branch" },
  { id: "a-2", at: instant(0, 8, 51), actorId: "u-008", actorName: "Priya Raghavan", action: "sensitive.read", subject: "Neha Iyer", detail: "Opened the salary tab" },
  { id: "a-3", at: instant(-1, 17, 2), actorId: "u-004", actorName: "Rahul Nair", action: "verdict.recorded", subject: "NWC-412", detail: "Error — 3 points deducted" },
  { id: "a-4", at: instant(-1, 11, 30), actorId: "u-ceo", actorName: "Jachin Raja", action: "role.changed", subject: "Vishnu Prasad", detail: "student → intern" },
  { id: "a-5", at: instant(-2, 15, 9), actorId: "u-012", actorName: "Elavarasi Manoharan", action: "payment.recorded", subject: "Cohort 2026-A", detail: "Instalment 6 of 10" },
];
