/*
 * Landing page copy and data.
 *
 * Portals and modules mirror what the first Jadvix CRM shipped
 * (CRM/jadvixCRMWebApp/lib/portals.ts and lib/modules.ts), regrouped for a
 * marketing audience, plus the Student portal for Jadvix Digital Academy
 * interns. Keep them in step when a module is added.
 */

import type { ScreenId } from "@/components/dash/DashboardApp";

export const NAV_LINKS = [
  { href: "#top", label: "Home" },
  { href: "#portals", label: "Portals" },
  { href: "#features", label: "Features" },
  { href: "#modules", label: "Modules" },
  { href: "#contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------- discover -- */

export const DISCOVER_TABS: { screen: ScreenId; title: string; body: string }[] = [
  {
    screen: "overview",
    title: "Command Center for Leadership",
    body: "CEO, Master and Super Admin portals see revenue, payroll, delivery and quality across every company and branch.",
  },
  {
    screen: "clock",
    title: "A Focused Workday for Every Maker",
    body: "Developers, designers and video editors get their hours, overtime, tasks and daily reports in one calm portal.",
  },
  {
    screen: "kra",
    title: "Performance You Can Actually Prove",
    body: "Every KRA point traces back to the event that moved it, so a review is a conversation about evidence.",
  },
  {
    screen: "student",
    title: "A Portal for Academy Students Too",
    body: "Jadvix Digital Academy interns follow their coursework, attendance and mentor reviews to a certificate.",
  },
];

export const VISION_TEXT =
  "OperixCRM brings every role to one workspace, where each portal sees exactly what it needs and nothing it should not.";

/* -------------------------------------------------------------- portals -- */

export type PortalCard = {
  id: string;
  name: string;
  who: string;
  body: string;
  modules: string[];
  seats: string;
  /** The screen this portal opens on, used by the preview on hover. */
  screen: ScreenId;
};

export const PORTALS: PortalCard[] = [
  {
    id: "command",
    name: "Master & Super Admin",
    who: "CEO, founders, administrators",
    body: "Full control across every company and branch, including who sees which module.",
    modules: ["Dashboard", "Module access", "Payroll", "Playground"],
    seats: "2 portals",
    screen: "overview",
  },
  {
    id: "management",
    name: "Managers",
    who: "Delivery and engineering managers",
    body: "Budgets, teams and progress for every engagement they own.",
    modules: ["Projects", "Teams", "Performance", "Reports"],
    seats: "2 portals",
    screen: "team",
  },
  {
    id: "leads",
    name: "Team Leaders",
    who: "Squad leads",
    body: "Plan sprints, run standups and hand work to the right people in one go.",
    modules: ["Sprints", "Tasks", "Teams", "Calendar"],
    seats: "2 portals",
    screen: "tasks",
  },
  {
    id: "makers",
    name: "Employees",
    who: "Developers, designers, video editors",
    body: "Your work, your hours and your requests, without the noise of everyone else's.",
    modules: ["Tasks", "Clock", "Daily reports", "Leave"],
    seats: "3 portals",
    screen: "clock",
  },
  {
    id: "quality",
    name: "QC & QA",
    who: "QA leads, engineers, analysts",
    body: "Score finished work against checklists, sign it off or send it back with notes.",
    modules: ["Checklist", "Proposed bugs", "Scoring", "Sign-off"],
    seats: "3 portals",
    screen: "checklist",
  },
  {
    id: "sales",
    name: "Sales",
    who: "Executives and sales managers",
    body: "Pipeline by stage, proposals and key accounts, from first contact to close.",
    modules: ["Leads", "Clients", "Payments", "Calendar"],
    seats: "2 portals",
    screen: "pipeline",
  },
  {
    id: "student",
    name: "Student Portal",
    who: "Academy interns and trainees",
    body: "Jadvix Digital Academy students follow coursework, log attendance and earn their certificate.",
    modules: ["Coursework", "Attendance", "Mentor reviews", "Certificate"],
    seats: "1 portal",
    screen: "kra",
  },
  {
    id: "client",
    name: "Client Portal",
    who: "Your customers",
    body: "Clients follow their delivery plan, approve milestones and settle invoices.",
    modules: ["Monitor", "Invoices", "Requests", "Messages"],
    seats: "1 portal",
    screen: "pipeline",
  },
];

/* ------------------------------------------------------ module showcase -- */

/** Modules that have a screen to show. The rest are listed under them. */
export type ShowcaseModule = {
  screen: ScreenId;
  name: string;
  group: string;
  body: string;
  /** What the visitor can actually do in the preview. */
  hint: string;
};

export const SHOWCASE: ShowcaseModule[] = [
  { screen: "overview", name: "Dashboard", group: "Overview", body: "Revenue, delivery, payroll and quality roll up the moment work changes.", hint: "Hover the chart to read any month" },
  { screen: "monitor", name: "Monitor", group: "Overview", body: "The delivery plan and its milestones, exactly as the client sees them.", hint: "A client's own view of the work" },
  { screen: "team", name: "Your Playground", group: "Overview", body: "Who is in, their status, the note on what they are doing and hours so far.", hint: "Pick a person to read their status" },

  { screen: "projects", name: "Projects", group: "Work", body: "Delivery status, budgets and teams for every engagement.", hint: "Progress and budget per project" },
  { screen: "tasks", name: "Tasks & Sprints", group: "Work", body: "Work in progress by column, with points, owners and the sprint burn-down.", hint: "Hover a card to lift it" },
  { screen: "checklist", name: "Checklist & Sign-off", group: "Work", body: "QC scores finished work item by item; only an Error verdict moves anyone's KRA.", hint: "Toggle a check to see the KRA cost" },
  { screen: "bugs", name: "Proposed Bugs", group: "Work", body: "Defects raised for triage, with severity, owner and where they were found.", hint: "Severity drives the triage order" },
  { screen: "requests", name: "Requests", group: "Work", body: "Projects you have been invited to. Accept one to join its team.", hint: "Accept an invitation and watch it clear" },
  { screen: "communication", name: "Communication", group: "Work", body: "Real-time conversations with your squad and with clients.", hint: "Channels, threads and presence" },

  { screen: "clock", name: "Clock & Hours", group: "People", body: "A live shift timer, total hours worked, overtime, consistency and the timesheet.", hint: "Watch the timer, then take a break" },
  { screen: "kra", name: "Performance & KRA", group: "People", body: "The KRA score, the events behind it and where everyone stands this month.", hint: "Every point has a recorded reason" },
  { screen: "employees", name: "Employees", group: "People", body: "The full roster, departments, branches and each person's KRA.", hint: "The roster with live headcount" },
  { screen: "teams", name: "Teams", group: "People", body: "Named groups you can put on a project or a task in one go.", hint: "Leads marked, members listed" },
  { screen: "reports", name: "Daily Reports", group: "People", body: "What each person did today, day by day, rated out of five by their manager.", hint: "File a day, then wait on the rating" },
  { screen: "leave", name: "Leave Requests", group: "People", body: "Time off awaiting a decision, with balances and approvals in the row.", hint: "Approve or decline without leaving" },
  { screen: "salary", name: "Salary & Payroll", group: "Finance", body: "Payroll runs, payslips and deductions for the whole roster.", hint: "One run, every payslip" },
  { screen: "pipeline", name: "Leads, Clients & Payments", group: "Finance", body: "Pipeline by stage, client health and the invoices raised against them.", hint: "Stages, health and invoices in one" },

  { screen: "companies", name: "Companies", group: "Organisation", body: "Every legal entity in the group, with its head branch and headcount.", hint: "Multi-company from one tenant" },
  { screen: "branches", name: "Branches", group: "Organisation", body: "Offices, their regional lead and how many people sit there.", hint: "Headcount follows the roster" },
  { screen: "access", name: "Module Access", group: "Organisation", body: "Switch modules on or off per portal, over a baseline no role can lose.", hint: "Toggle a grant in the matrix" },

  { screen: "calendar", name: "Calendar", group: "System", body: "Standups, meetings, releases and leave marked on one grid the squad shares.", hint: "Pick any day to read its agenda" },
  { screen: "notifications", name: "Notifications", group: "System", body: "Verdicts, defects and approvals delivered live over the same socket as presence.", hint: "Unread first, newest at the top" },
  { screen: "settings", name: "Settings", group: "System", body: "Profile, workspace preferences, sessions and security.", hint: "Accent, density and sessions" },
  { screen: "student", name: "Academy Portal", group: "Student", body: "Coursework progress, attendance, mentor reviews and the certificate.", hint: "An intern's whole programme" },
];

export const MODULE_COUNT = SHOWCASE.length;

/* ----------------------------------------------------------- KRA proof -- */

export const KRA_POINTS = [
  {
    title: "Earned, never assigned",
    body: "Points move only when something happens — a sprint closed clean, a QC error, a month of daily reports filed on time.",
  },
  {
    title: "Every point has a reason",
    body: "Each movement is written with its reason and the balance it produced, in the same transaction as the score change.",
  },
  {
    title: "Arguable at review time",
    body: "A manager opens the trail instead of relying on memory, so appraisals rest on evidence both sides can read.",
  },
];

/* --------------------------------------------------------- testimonials -- */

/*
 * Jadvix leadership, from jadvix.uk/about. The quotes are drafts written for
 * this page: each person must approve their own before the site goes live.
 */
export const TESTIMONIALS = [
  {
    quote:
      "We built OperixCRM because no off-the-shelf CRM fitted how Jadvix works. Now every portal, from mine to our clients', runs on the same live numbers.",
    name: "Jachin Raja",
    role: "CEO & Founder at Jadvix",
  },
  {
    quote:
      "Developers, QC and managers finally share one source of truth. Tasks, checklists and sign-off happen in the portal, not scattered across chats.",
    name: "Elavarasi Manoharan",
    role: "Chief Technical Officer at Jadvix",
  },
  {
    quote:
      "Sales can see a lead through to a paid invoice, and clients follow their own delivery plan. That alone saves our team hours every week.",
    name: "Negha Sharma",
    role: "Chief Marketing Officer at Jadvix",
  },
];

export const CONTACT = {
  email: "contact@jadvix.uk",
  phoneUK: { label: "+44 7355 803386", href: "tel:+447355803386" },
  phoneIN: { label: "+91 94896 44108", href: "tel:+919489644108" },
  site: "https://jadvix.uk",
} as const;

export const DEMO_MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent("OperixCRM demo request")}`;

export const FOOTER_COLUMNS = [
  {
    title: "Menu",
    links: [
      { label: "Portals", href: "#portals" },
      { label: "Features", href: "#features" },
      { label: "Modules", href: "#modules" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Jadvix", href: `${CONTACT.site}/about` },
      { label: "Vision", href: "#vision" },
      { label: "Our Team", href: "#customers" },
    ],
  },
  {
    // Jadvix has no public social profiles yet, so this column carries the
    // real contact channels. Swap in profiles once they exist.
    title: "Get in Touch",
    links: [
      { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { label: `UK ${CONTACT.phoneUK.label}`, href: CONTACT.phoneUK.href },
      { label: `India ${CONTACT.phoneIN.label}`, href: CONTACT.phoneIN.href },
      { label: "jadvix.uk", href: CONTACT.site },
    ],
  },
  {
    title: "T&C",
    links: [
      { label: "Privacy Policy", href: "/legal#privacy" },
      { label: "Terms of Use", href: "/legal#terms-of-use" },
      { label: "Terms of Service", href: "/legal#terms-of-service" },
      { label: "Disclaimer", href: "/legal#disclaimer" },
    ],
  },
];
