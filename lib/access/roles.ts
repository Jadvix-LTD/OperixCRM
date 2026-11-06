/*
 * The ten roles and their default capability sets.
 *
 * A role is a JOB, not a portal. There is one application shell; what it
 * shows is computed. The old CRM's `manager-1`, `employee-2`,
 * `quality-check-3` shells were demo logins and are not carried over.
 *
 * These templates encode the access matrix in section 5 of
 * docs/structure/OperixCRM-Structure.pdf. They are DEFAULTS: a new account is
 * safe on day one, and the CEO adjusts from Settings → Access. Nothing here
 * is final, and nothing here is the enforcement — phase 2's server twin is.
 */

import type { Scope } from "./capabilities";

export const ROLE_IDS = [
  "ceo",
  "manager",
  "lead",
  "coordinator",
  "qc",
  "developer",
  "intern",
  "student",
  "sales",
  "client",
] as const;

export type RoleId = (typeof ROLE_IDS)[number];

export type RoleDef = {
  id: RoleId;
  label: string;
  /** Shown under the name on their card, and in the dev role switcher. */
  blurb: string;
  defaultScope: Scope;
  /** Where this role lands when it opens the workspace. */
  landing: string;
};

export const ROLES: Record<RoleId, RoleDef> = {
  ceo: {
    id: "ceo",
    label: "CEO",
    blurb: "Owns the workspace. The only role that can delegate capability.",
    defaultScope: "all",
    landing: "/overview/dashboard",
  },
  manager: {
    id: "manager",
    label: "Manager",
    blurb: "Delivery and people for a branch.",
    defaultScope: "branch",
    landing: "/overview/dashboard",
  },
  lead: {
    id: "lead",
    label: "Team Leader",
    blurb: "Runs a squad: sprints, standups, assignment.",
    defaultScope: "team",
    landing: "/scrum/projects",
  },
  coordinator: {
    id: "coordinator",
    label: "Coordinator",
    blurb: "Academy. Curriculum, code review, gates and cohort fees.",
    defaultScope: "team",
    landing: "/people/students",
  },
  qc: {
    id: "qc",
    label: "QC / QA",
    blurb: "Scores finished work and returns a verdict.",
    defaultScope: "team",
    landing: "/scrum/tasks",
  },
  developer: {
    id: "developer",
    label: "Developer",
    blurb: "Does the work. Tasks, clock, daily report.",
    defaultScope: "self",
    landing: "/scrum/tasks",
  },
  intern: {
    id: "intern",
    label: "Intern",
    blurb: "A student who cleared a gate. Real work, still has coursework.",
    defaultScope: "self",
    landing: "/scrum/tasks",
  },
  student: {
    id: "student",
    label: "Student",
    blurb: "Academy learner. Coursework, assessment projects, own fees.",
    defaultScope: "self",
    landing: "/overview/dashboard",
  },
  sales: {
    id: "sales",
    label: "Sales",
    blurb: "Leads and client accounts, first contact to close.",
    defaultScope: "all",
    landing: "/org/leads",
  },
  client: {
    id: "client",
    label: "Client",
    blurb: "External. Their own delivery plan, invoices and requests.",
    defaultScope: "assigned",
    landing: "/overview/monitor",
  },
};

/*
 * Granted to every account and not revocable.
 *
 * Settings is where you change your own password. Requests is where a project
 * invitation is ANSWERED — withholding it would leave an invitation with
 * nowhere to go. Chat and Dashboard are how anyone finds out anything.
 */
export const BASELINE: readonly string[] = [
  "settings.edit:self",
  "requests.edit:self",
  "chat.edit:self",
  // Overview is the one group every role gets in full. What differs is the
  // SCOPE: a developer's Monitor is their own squad, a student's is their own
  // progress, a client's Playground is only the people on their project.
  "dashboard.view:self",
  "monitor.view:self",
  "playground.view:team",
];

export const ROLE_TEMPLATES: Record<RoleId, readonly string[]> = {
  /* The CEO holds everything, at `all`, and cannot be reduced. */
  ceo: [
    "dashboard.manage:all",
    "monitor.manage:all",
    "playground.manage:all",
    "requests.manage:all",
    "chat.manage:all",
    "projects.manage:all",
    "tasks.manage:all",
    "subtasks.manage:all",
    "attendance.view:all",
    "employees.manage:all",
    "students.manage:all",
    "performance.manage:all",
    "clock.view:all",
    "teams.manage:all",
    "fees.manage:all",
    "fees.pay:all",
    "salary.manage:all",
    "finance-analytics.manage:all",
    "leads.manage:all",
    "clients.manage:all",
    "branches.manage:all",
    "calendar.manage:all",
    "settings.edit:self",
    "access.manage:all",
    "design.view:all",
  ],

  manager: [
    ...BASELINE,
    "dashboard.view:branch",
    "monitor.view:branch",
    "playground.view:branch",
    "requests.manage:branch",
    "projects.manage:branch",
    "tasks.manage:branch",
    "subtasks.manage:branch",
    "attendance.view:branch",
    "employees.edit:branch",
    "students.view:branch",
    "performance.view:branch",
    "clock.edit:self",
    "teams.manage:branch",
    "salary.view:self",
    "leads.view:branch",
    "clients.view:branch",
    "branches.view:all",
    "calendar.edit:branch",
  ],

  lead: [
    ...BASELINE,
    "dashboard.view:team",
    "monitor.view:team",
    "playground.view:branch",
    "requests.manage:team",
    "projects.edit:team",
    "tasks.manage:team",
    "subtasks.manage:team",
    "attendance.view:team",
    "employees.view:team",
    "students.view:team",
    "performance.view:team",
    "clock.edit:self",
    "teams.edit:team",
    "salary.view:self",
    "branches.view:all",
    "calendar.edit:team",
  ],

  coordinator: [
    ...BASELINE,
    "dashboard.view:team",
    "monitor.view:team",
    "playground.view:branch",
    "requests.manage:team",
    "projects.manage:team",
    "tasks.manage:team",
    "subtasks.manage:team",
    "attendance.view:team",
    "employees.view:team",
    // The coordinator owns the cohort: enrol, progress, and record a gate.
    "students.manage:team",
    "students.grade:team",
    "performance.view:team",
    "clock.edit:self",
    "teams.manage:team",
    // Fee visibility is their own cohort only, and every read is audited.
    "fees.view:team",
    "salary.view:self",
    "branches.view:all",
    "calendar.edit:team",
  ],

  qc: [
    ...BASELINE,
    "dashboard.view:team",
    "monitor.view:team",
    "playground.view:branch",
    "projects.view:assigned",
    "tasks.edit:assigned",
    // The only role whose verdict moves a KRA score.
    "tasks.grade:team",
    "subtasks.edit:assigned",
    "attendance.view:self",
    "employees.view:team",
    "students.view:team",
    "performance.view:team",
    "clock.edit:self",
    "teams.view:team",
    "salary.view:self",
    "branches.view:all",
    "calendar.view:team",
  ],

  developer: [
    ...BASELINE,
    "monitor.view:team",
    "playground.view:branch",
    "projects.view:assigned",
    "tasks.edit:assigned",
    "subtasks.edit:assigned",
    "attendance.view:self",
    "employees.view:team",
    "performance.view:self",
    "clock.edit:self",
    "teams.view:team",
    "salary.view:self",
    "branches.view:all",
    "calendar.view:team",
  ],

  intern: [
    ...BASELINE,
    "monitor.view:self",
    "playground.view:team",
    "projects.view:assigned",
    "tasks.edit:assigned",
    "subtasks.edit:assigned",
    "attendance.view:self",
    "employees.view:team",
    "performance.view:self",
    "clock.edit:self",
    "teams.view:team",
    // An intern still has coursework and still pays fees.
    "fees.edit:self",
    "fees.pay:self",
    "calendar.view:team",
  ],

  student: [
    ...BASELINE,
    // Their own progress against the programme, not anybody else's.
    "monitor.view:self",
    "playground.view:team",
    "projects.view:assigned",
    "tasks.edit:assigned",
    "subtasks.edit:assigned",
    "attendance.view:self",
    // Their own record, and nobody else's.
    "students.view:self",
    "performance.view:self",
    "clock.edit:self",
    "fees.edit:self",
    "fees.pay:self",
    "calendar.view:team",
  ],

  sales: [
    ...BASELINE,
    "dashboard.view:all",
    "monitor.view:all",
    "playground.view:branch",
    "projects.view:all",
    "attendance.view:self",
    "employees.view:team",
    "performance.view:self",
    "clock.edit:self",
    "teams.view:all",
    "salary.view:self",
    "leads.manage:all",
    "clients.manage:all",
    "branches.view:all",
    "calendar.edit:all",
  ],

  /*
   * External. Their own delivery plan, invoices and requests — nothing else,
   * ever. No Playground (watching staff presence is not theirs to do) and no
   * directory beyond the people on their own projects.
   */
  client: [
    "settings.edit:self",
    "requests.edit:self",
    "chat.edit:assigned",
    "dashboard.view:assigned",
    "monitor.view:assigned",
    "playground.view:assigned",
    "projects.view:assigned",
    "tasks.view:assigned",
    "calendar.view:assigned",
  ],
};

export function templateFor(roles: readonly RoleId[]): string[] {
  const out = new Set<string>();
  for (const r of roles) for (const g of ROLE_TEMPLATES[r] ?? []) out.add(g);
  return [...out];
}

/** Where to send someone who opens the workspace root. Most senior role wins. */
export function landingFor(roles: readonly RoleId[]): string {
  const order: RoleId[] = ["ceo", "manager", "lead", "coordinator", "qc", "sales", "developer", "intern", "student", "client"];
  const primary = order.find((r) => roles.includes(r)) ?? "developer";
  return ROLES[primary].landing;
}
