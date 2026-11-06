/*
 * The module registry — the single list of things a portal can open.
 *
 * Adding a module means adding a row here and a route. Nothing else in the
 * shell needs to change: the rail, the command palette and the breadcrumbs
 * are all computed from this list filtered by the viewer's capabilities.
 *
 * Mirrors section 5 of docs/structure/OperixCRM-Structure.pdf.
 */

import {
  Activity,
  BadgeCheck,
  Banknote,
  CalendarDays,
  ClipboardList,
  Clock3,
  FolderKanban,
  GitBranch,
  GraduationCap,
  Handshake,
  Inbox,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Orbit,
  Palette,
  Settings,
  Target,
  TrendingUp,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MODULE_GROUPS = [
  "Overview",
  "Communication",
  "Scrum",
  "People",
  "Finance",
  "Organisation",
  "System",
] as const;

export type ModuleGroup = (typeof MODULE_GROUPS)[number];

export const MODULE_IDS = [
  "dashboard",
  "monitor",
  "playground",
  "requests",
  "chat",
  "projects",
  "tasks",
  "subtasks",
  "attendance",
  "employees",
  "students",
  "performance",
  "clock",
  "teams",
  "fees",
  "salary",
  "finance-analytics",
  "leads",
  "clients",
  "branches",
  "calendar",
  "settings",
  "access",
  "design",
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

export type ModuleDef = {
  id: ModuleId;
  label: string;
  group: ModuleGroup;
  href: string;
  icon: LucideIcon;
  /** One line under the page title, and the command palette's subtitle. */
  blurb: string;
  /** Hidden from the rail unless NODE_ENV is development. */
  devOnly?: boolean;
};

export const MODULES: readonly ModuleDef[] = [
  /* ------------------------------------------------------------ overview */
  {
    id: "dashboard",
    label: "Dashboard",
    group: "Overview",
    href: "/overview/dashboard",
    icon: LayoutDashboard,
    blurb: "Your figures, shaped by your role.",
  },
  {
    id: "monitor",
    label: "Monitor",
    group: "Overview",
    href: "/overview/monitor",
    icon: Activity,
    blurb: "Delivery and performance across the people you are responsible for.",
  },
  {
    id: "playground",
    label: "Playground",
    group: "Overview",
    href: "/overview/playground",
    icon: Orbit,
    blurb: "Who is in, what they are on, and how the day is going.",
  },

  /* ------------------------------------------------------- communication */
  {
    id: "requests",
    label: "Requests",
    group: "Communication",
    href: "/comms/requests",
    icon: Inbox,
    blurb: "Leave and project invitations, waiting on you or raised by you.",
  },
  {
    id: "chat",
    label: "Chat",
    group: "Communication",
    href: "/comms/chat",
    icon: MessagesSquare,
    blurb: "Conversations with anyone on staff.",
  },

  /* --------------------------------------------------------------- scrum */
  {
    id: "projects",
    label: "Projects",
    group: "Scrum",
    href: "/scrum/projects",
    icon: FolderKanban,
    blurb: "Every engagement, as cards. Open one for its tasks.",
  },
  {
    id: "tasks",
    label: "Tasks",
    group: "Scrum",
    href: "/scrum/tasks",
    icon: ListChecks,
    blurb: "Work assigned to you, across every project you are on.",
  },
  {
    id: "subtasks",
    label: "Subtasks",
    group: "Scrum",
    href: "/scrum/subtasks",
    icon: BadgeCheck,
    blurb: "The checklist lines you own, broken out of their parent tasks.",
  },
  {
    id: "attendance",
    label: "Attendance",
    group: "Scrum",
    href: "/scrum/attendance",
    icon: CalendarDays,
    blurb: "Your attendance percentage, day by day.",
  },

  /* -------------------------------------------------------------- people */
  {
    id: "employees",
    label: "Employees",
    group: "People",
    href: "/people/employees",
    icon: Users,
    blurb: "The directory, and the records you are allowed to open.",
  },
  {
    id: "students",
    label: "Students",
    group: "People",
    href: "/people/students",
    icon: GraduationCap,
    blurb: "Academy intake: cohorts, stages, gates and progress.",
  },
  {
    id: "performance",
    label: "Performance",
    group: "People",
    href: "/people/performance",
    icon: TrendingUp,
    blurb: "KRA score and the events behind it.",
  },
  {
    id: "clock",
    label: "Clock",
    group: "People",
    href: "/people/clock",
    icon: Clock3,
    blurb: "Clock in, take a break, and see the hours you have worked.",
  },
  {
    id: "teams",
    label: "Teams",
    group: "People",
    href: "/people/teams",
    icon: UsersRound,
    blurb: "Named groups you can put on a project or a task in one go.",
  },

  /* ------------------------------------------------------------- finance */
  {
    id: "fees",
    label: "Fees",
    group: "Finance",
    href: "/finance/fees",
    icon: ClipboardList,
    blurb: "Academy fee plans, instalments and invoices.",
  },
  {
    id: "salary",
    label: "Salary",
    group: "Finance",
    href: "/finance/salary",
    icon: Wallet,
    blurb: "Your payslips, and payroll runs if you hold the scope.",
  },
  {
    id: "finance-analytics",
    label: "Analytics",
    group: "Finance",
    href: "/finance/analytics",
    icon: Banknote,
    blurb: "Revenue, expenses and the company's financial record.",
  },

  /* -------------------------------------------------------- organisation */
  {
    id: "leads",
    label: "Leads",
    group: "Organisation",
    href: "/org/leads",
    icon: Target,
    blurb: "Pipeline by stage, from first contact to close.",
  },
  {
    id: "clients",
    label: "Clients",
    group: "Organisation",
    href: "/org/clients",
    icon: Handshake,
    blurb: "Accounts, owners and lifetime value.",
  },
  {
    id: "branches",
    label: "Branches",
    group: "Organisation",
    href: "/org/branches",
    icon: GitBranch,
    blurb: "Ruislip, Chennai and Coimbatore — headcount and leads.",
  },

  /* -------------------------------------------------------------- system */
  {
    id: "calendar",
    label: "Calendar",
    group: "System",
    href: "/system/calendar",
    icon: CalendarDays,
    blurb: "Standups, meetings, releases and leave on one grid.",
  },
  {
    id: "settings",
    label: "Settings",
    group: "System",
    href: "/system/settings",
    icon: Settings,
    blurb: "Your profile, security and workspace preferences.",
  },
  {
    id: "access",
    label: "Access",
    group: "System",
    href: "/system/access",
    icon: KeyRound,
    blurb: "Who may open what, and at which scope.",
  },
  {
    id: "design",
    label: "Design system",
    group: "System",
    href: "/system/design",
    icon: Palette,
    blurb: "Every token and component in every state.",
    devOnly: true,
  },
];

export const MODULE_MAP = new Map(MODULES.map((m) => [m.id, m]));

export function getModule(id: ModuleId): ModuleDef | undefined {
  return MODULE_MAP.get(id);
}

/** The module a path belongs to — longest href first, so /scrum/projects wins over /scrum. */
export function moduleForPath(pathname: string): ModuleDef | undefined {
  return [...MODULES]
    .sort((a, b) => b.href.length - a.href.length)
    .find((m) => pathname === m.href || pathname.startsWith(`${m.href}/`));
}
