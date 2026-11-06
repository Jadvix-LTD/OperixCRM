/*
 * People, and the three tiers they are read at.
 *
 * The tier split is the whole answer to "hide employee data from employees":
 * a directory record has no salary PROPERTY, not a blanked one, so a screen
 * that tries to show it does not compile. See section 4 of the structure doc.
 */

import type { Day, Id, Instant, Money } from "./common";
import type { RoleId } from "../access/roles";

export type Branch = {
  id: Id;
  name: string;
  city: string;
  country: string;
  /** Derived from country on the server, never accepted from a client. */
  currency: "GBP" | "INR";
  isHead: boolean;
  headcount: number;
  leadId: Id | null;
};

export type Presence = "online" | "away" | "busy" | "offline";

export type EmploymentState = "active" | "available" | "leave" | "archived";

/**
 * Tier 0 — the directory.
 *
 * Every internal account can read this about anyone. You cannot assign work,
 * @mention or start a conversation without it, so withholding it would break
 * the product rather than protect anybody.
 */
export type PersonDirectory = {
  id: Id;
  name: string;
  jobTitle: string;
  roles: RoleId[];
  branchId: Id;
  branchName: string;
  teamIds: Id[];
  workEmail: string;
  avatar: string | null;
  presence: Presence;
  statusText: string | null;
  state: EmploymentState;
};

/**
 * Tier 1 — the work record.
 *
 * Self, the manager chain above them, and anyone holding the module at team,
 * branch or all.
 */
export type PersonWork = PersonDirectory & {
  empId: string;
  joinedAt: Day;
  reportsToId: Id | null;
  kra: number;
  openTasks: number;
  doneTasks: number;
  /** Percentage of days the office was open that they were present. */
  consistency: number;
  minutesThisMonth: number;
  overtimeMinutes: number;
};

/**
 * Tier 2 — sensitive.
 *
 * Self plus an explicit named grant, never implied by a role, and every read
 * is written to the audit log. Modelled as a SEPARATE type rather than
 * optional fields so the default query cannot return it by accident.
 */
export type PersonSensitive = {
  id: Id;
  salary: Money;
  bankLast4: string;
  personalPhone: string;
  address: string;
  dateOfBirth: Day;
  documents: { id: Id; label: string; uploadedAt: Instant }[];
};

export type KraEvent = {
  id: Id;
  userId: Id;
  delta: number;
  reason: string;
  balanceAfter: number;
  at: Instant;
  taskId: Id | null;
};

export type Team = {
  id: Id;
  name: string;
  description: string | null;
  leadId: Id | null;
  memberIds: Id[];
  branchId: Id;
};

/** One shift. Open means `outAt` is null — the only definition of clocked in. */
export type Shift = {
  id: Id;
  userId: Id;
  /** The author's local day, not derived from inAt. A 23:40 start is today. */
  date: Day;
  inAt: Instant;
  outAt: Instant | null;
  breakMinutes: number;
  /** Minutes behind UTC at clock-in, so the server can close the local day. */
  tzOffset: number;
};

export type DailyReport = {
  id: Id;
  userId: Id;
  date: Day;
  headline: string;
  body: string;
  /** 1–5, or null until someone has rated it. */
  stars: number | null;
  ratedById: Id | null;
  feedback: string | null;
};

export type LeaveKind = "annual" | "sick" | "unpaid" | "parental";
export type LeaveState = "pending" | "approved" | "declined";

export type LeaveRequest = {
  id: Id;
  userId: Id;
  kind: LeaveKind;
  firstDay: Day;
  lastDay: Day;
  days: number;
  state: LeaveState;
  note: string | null;
  decidedById: Id | null;
};
