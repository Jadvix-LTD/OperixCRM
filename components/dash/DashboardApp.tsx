"use client";

/*
 * The OperixCRM product mock.
 *
 * One component for every place the product is shown — hero, module
 * showcase, CTA — so the app on the landing page is always the same app.
 * `live` turns on the parts a visitor can drive: screen switching, the chart
 * cursor, the running clock, the QC checklist. Switched off, it renders the
 * identical markup as a still, which is what the decorative CTA shot wants.
 *
 * Everything sits on a fixed 1034 x 734 canvas that ScaleFrame scales, so a
 * value here is a design pixel. Changing the canvas means re-checking every
 * screen, so don't.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Bell,
  Bug,
  Building2,
  CalendarDays,
  CalendarOff,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Download,
  FolderKanban,
  GitBranch,
  GraduationCap,
  Inbox,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Search,
  Settings,
  SlidersHorizontal,
  Target,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LogoMark } from "../Logo";
import {
  CalendarScreen,
  ChecklistScreen,
  ClockScreen,
  KraScreen,
  OverviewScreen,
  PipelineScreen,
  TasksScreen,
  TeamScreen,
} from "./screens";
import {
  AccessScreen,
  BranchesScreen,
  BugsScreen,
  CommunicationScreen,
  CompaniesScreen,
  EmployeesScreen,
  LeaveScreen,
  MonitorScreen,
  NotificationsScreen,
  ProjectsScreen,
  ReportsScreen,
  RequestsScreen,
  SalaryScreen,
  SettingsScreen,
  StudentScreen,
  TeamsScreen,
} from "./screens2";

export type ScreenId =
  | "overview"
  | "clock"
  | "calendar"
  | "kra"
  | "team"
  | "tasks"
  | "checklist"
  | "pipeline"
  | "projects"
  | "bugs"
  | "requests"
  | "communication"
  | "monitor"
  | "employees"
  | "teams"
  | "reports"
  | "leave"
  | "salary"
  | "companies"
  | "branches"
  | "notifications"
  | "access"
  | "settings"
  | "student";

type ScreenDef = {
  id: ScreenId;
  nav: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  filters: string[];
  /*
   * Rendered as a component, never called — each screen owns hooks, and
   * calling it would fold them into this component's hook list, which
   * changes length the moment the screen does.
   */
  Screen: React.ComponentType<{ live: boolean }>;
};

export const SCREENS: ScreenDef[] = [
  {
    id: "overview",
    nav: "Overview",
    icon: LayoutDashboard,
    title: "Company Overview",
    subtitle: "Every company, branch and portal in one view.",
    filters: ["Summary", "Delivery", "Payroll", "Pipeline", "Clients"],
    Screen: OverviewScreen,
  },
  {
    id: "clock",
    nav: "Clock",
    icon: Clock3,
    title: "Clock & Hours",
    subtitle: "Clock in, track overtime and keep the month honest.",
    filters: ["Today", "This week", "This month", "Timesheet"],
    Screen: ClockScreen,
  },
  {
    id: "calendar",
    nav: "Calendar",
    icon: CalendarDays,
    title: "Calendar",
    subtitle: "Standups, meetings, releases and leave on one grid.",
    filters: ["Month", "Week", "Agenda", "Team"],
    Screen: CalendarScreen,
  },
  {
    id: "kra",
    nav: "KRA",
    icon: Target,
    title: "Performance & KRA",
    subtitle: "Every point traced to the event that moved it.",
    filters: ["My score", "Trail", "Leaderboard", "Reports"],
    Screen: KraScreen,
  },
  {
    id: "team",
    nav: "Team",
    icon: Users,
    title: "Your Playground",
    subtitle: "Who is in, what they are on, and how the day is going.",
    filters: ["Floor", "Roster", "Statuses", "Teams"],
    Screen: TeamScreen,
  },
  {
    id: "tasks",
    nav: "Tasks",
    icon: ListChecks,
    title: "Tasks & Sprints",
    subtitle: "Work in progress across every squad.",
    filters: ["Board", "Sprint 24", "Backlog", "Mine"],
    Screen: TasksScreen,
  },
  {
    id: "checklist",
    nav: "QC",
    icon: ClipboardCheck,
    title: "Checklist & Sign-off",
    subtitle: "Score finished work, then approve it or send it back.",
    filters: ["Queue", "In review", "Signed off", "Errors"],
    Screen: ChecklistScreen,
  },
  {
    id: "pipeline",
    nav: "Sales",
    icon: Target,
    title: "Pipeline Overview",
    subtitle: "Leads, clients and invoices from first call to paid.",
    filters: ["Pipeline", "Clients", "Invoices", "Targets"],
    Screen: PipelineScreen,
  },
  {
    id: "projects",
    nav: "Projects",
    icon: FolderKanban,
    title: "Projects",
    subtitle: "Delivery status, budgets and teams for every engagement.",
    filters: ["Active", "In scope", "Running late", "Archived"],
    Screen: ProjectsScreen,
  },
  {
    id: "bugs",
    nav: "Bugs",
    icon: Bug,
    title: "Proposed Bugs",
    subtitle: "Defects raised for triage, with severity and owner.",
    filters: ["Open", "Critical", "Fixed", "Closed and scored"],
    Screen: BugsScreen,
  },
  {
    id: "requests",
    nav: "Requests",
    icon: Inbox,
    title: "Project Requests",
    subtitle: "Projects you have been invited to. Accept one to join its team.",
    filters: ["Waiting on you", "To join", "To lead", "Answered"],
    Screen: RequestsScreen,
  },
  {
    id: "communication",
    nav: "Chat",
    icon: MessagesSquare,
    title: "Communication",
    subtitle: "Conversations with your team and your clients.",
    filters: ["All", "Squads", "Clients", "Unread"],
    Screen: CommunicationScreen,
  },
  {
    id: "monitor",
    nav: "Monitor",
    icon: Activity,
    title: "Monitor",
    subtitle: "Delivery plan and progress, exactly as the client sees it.",
    filters: ["Plan", "Milestones", "Invoices", "Requests"],
    Screen: MonitorScreen,
  },
  {
    id: "employees",
    nav: "People",
    icon: Users,
    title: "Employee Directory",
    subtitle: "Everyone on the roster, their department and status.",
    filters: ["Everyone", "Active", "Available", "By branch"],
    Screen: EmployeesScreen,
  },
  {
    id: "teams",
    nav: "Teams",
    icon: UsersRound,
    title: "Teams",
    subtitle: "Named groups you can put on a project or a task in one go.",
    filters: ["All teams", "Mine", "Leads", "Unassigned"],
    Screen: TeamsScreen,
  },
  {
    id: "reports",
    nav: "Reports",
    icon: ClipboardList,
    title: "Daily Reports",
    subtitle: "What each person did today, day by day, rated out of five.",
    filters: ["Mine", "Everyone", "Awaiting a rating", "Missing"],
    Screen: ReportsScreen,
  },
  {
    id: "leave",
    nav: "Leave",
    icon: CalendarOff,
    title: "Leave Requests",
    subtitle: "Time-off requests and remaining balances.",
    filters: ["Awaiting You", "Approved", "Declined", "All time"],
    Screen: LeaveScreen,
  },
  {
    id: "salary",
    nav: "Payroll",
    icon: Wallet,
    title: "Salary & Payroll",
    subtitle: "Payroll runs, payslips and deductions.",
    filters: ["This run", "Payslips", "Deductions", "History"],
    Screen: SalaryScreen,
  },
  {
    id: "companies",
    nav: "Companies",
    icon: Building2,
    title: "Companies",
    subtitle: "Every legal entity operating under the group.",
    filters: ["Enabled", "All", "Head branches", "Owners"],
    Screen: CompaniesScreen,
  },
  {
    id: "branches",
    nav: "Branches",
    icon: GitBranch,
    title: "Branches",
    subtitle: "Offices, headcount and regional leads.",
    filters: ["Open", "All", "By company", "Leads"],
    Screen: BranchesScreen,
  },
  {
    id: "notifications",
    nav: "Alerts",
    icon: Bell,
    title: "Notifications",
    subtitle: "Everything that needed your attention recently.",
    filters: ["Unread", "All", "Mentions", "Verdicts"],
    Screen: NotificationsScreen,
  },
  {
    id: "access",
    nav: "Access",
    icon: KeyRound,
    title: "Module Access",
    subtitle: "Switch modules on or off for each portal.",
    filters: ["By portal", "By module", "Mandatory", "Changed"],
    Screen: AccessScreen,
  },
  {
    id: "settings",
    nav: "Settings",
    icon: Settings,
    title: "Settings",
    subtitle: "Profile, workspace and security preferences.",
    filters: ["Profile", "Security", "Workspace", "Sessions"],
    Screen: SettingsScreen,
  },
  {
    id: "student",
    nav: "Academy",
    icon: GraduationCap,
    title: "Academy Portal",
    subtitle: "Coursework, attendance, mentor reviews and your certificate.",
    filters: ["Coursework", "Attendance", "Reviews", "Certificate"],
    Screen: StudentScreen,
  },
];

export const SCREEN_MAP = new Map(SCREENS.map((s) => [s.id, s]));

/** Nav shown in the mock's header. A subset, so the chrome stays readable. */
const HEADER_NAV: ScreenId[] = ["overview", "clock", "calendar", "kra", "team"];

export function DashboardApp({
  screen: wanted,
  live = false,
  onScreenChange,
}: {
  /** The screen to show. The mock may move past it on its own from here. */
  screen: ScreenId;
  live?: boolean;
  /** Lets a parent (the showcase list) stay in step when the mock is driven. */
  onScreenChange?: (id: ScreenId) => void;
}) {
  /*
   * The screen lives here as well as in the prop, so the mock works on its
   * own wherever it is dropped — the hero has nothing to drive it — while a
   * parent that cares (the showcase list) can still steer it and be told.
   */
  const [screen, setScreen] = useState(wanted);
  const [filter, setFilter] = useState(0);
  const prev = useRef(wanted);

  // Follow the prop when the parent moves it, and reset the sub-nav on any
  // change, so a stale filter never carries over to the next screen.
  useEffect(() => {
    if (prev.current !== wanted) {
      prev.current = wanted;
      setScreen(wanted);
      setFilter(0);
    }
  }, [wanted]);

  const def = SCREEN_MAP.get(screen) ?? SCREENS[0];
  const Screen = def.Screen;

  const go = (id: ScreenId) => {
    if (!live || id === screen) return;
    prev.current = id;
    setScreen(id);
    setFilter(0);
    onScreenChange?.(id);
  };

  return (
    <div className="dk" data-live={live || undefined}>
      {/* ------------------------------------------------------ header -- */}
      <header className="dk-top">
        <span className="dk-brand">
          <LogoMark size={22} />
          OperixCRM
        </span>
        <nav className="dk-nav" aria-label="Workspace">
          {HEADER_NAV.map((id) => {
            const s = SCREEN_MAP.get(id)!;
            return (
              <button
                key={id}
                type="button"
                className={id === screen ? "on" : ""}
                onClick={() => go(id)}
                tabIndex={live ? 0 : -1}
                aria-current={id === screen ? "page" : undefined}
              >
                {s.nav}
              </button>
            );
          })}
        </nav>
        <span className="dk-top-right">
          <span className="dk-ico"><Search size={15} /></span>
          <span className="dk-ico dk-bell">
            <Bell size={15} />
            <i />
          </span>
          <span className="dk-me">
            <Image src="/team/jachin.jpg" alt="" width={74} height={74} sizes="74px" />
          </span>
        </span>
      </header>

      {/* ------------------------------------------------------- title -- */}
      <div className="dk-title-row">
        <span>
          <h2 key={def.title}>{def.title}</h2>
          <p key={def.subtitle}>{def.subtitle}</p>
        </span>
        <span className="dk-title-tools">
          <span className="dk-mini-pill"><Download size={12} /> Export Data</span>
          <span className="dk-ico"><Settings size={14} /></span>
        </span>
      </div>

      {/* ----------------------------------------------------- filters -- */}
      <div className="dk-filters">
        <span className="dk-filter-pills">
          {def.filters.map((f, i) => (
            <button
              key={f}
              type="button"
              className={i === filter ? "on" : ""}
              onClick={() => live && setFilter(i)}
              tabIndex={live ? 0 : -1}
            >
              {f}
            </button>
          ))}
        </span>
        <span className="dk-filter-right">
          <span className="dk-mini-pill">1 Jun 2026</span>
          <span className="dk-mini-pill">3 Nov 2026</span>
          <span className="dk-ico"><SlidersHorizontal size={14} /></span>
        </span>
      </div>

      {/* ------------------------------------------------------ screen -- */}
      <div className="dk-screen" key={screen}>
        <Screen live={live} />
      </div>
    </div>
  );
}
