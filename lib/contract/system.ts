/*
 * Finance, organisation and the system-wide records.
 */

import type { Day, Id, Instant, Money } from "./common";
import type { Action, Scope } from "../access/capabilities";
import type { ModuleId } from "../access/modules";

/* -------------------------------------------------------------- finance -- */

export type Payslip = {
  id: Id;
  userId: Id;
  period: string;
  gross: Money;
  deductions: Money;
  net: Money;
  state: "paid" | "scheduled";
  paidOn: Day | null;
};

export type LedgerEntry = {
  id: Id;
  kind: "revenue" | "expense";
  category: string;
  description: string;
  amount: Money;
  on: Day;
  branchId: Id;
};

/* --------------------------------------------------------- organisation -- */

export type LeadStage = "contacted" | "qualified" | "proposal" | "won" | "lost";

export type Lead = {
  id: Id;
  name: string;
  company: string;
  email: string;
  stage: LeadStage;
  value: Money;
  ownerId: Id;
  lastTouchedAt: Instant;
};

export type ClientHealth = "healthy" | "watch" | "at-risk";

export type ClientAccount = {
  id: Id;
  code: string;
  name: string;
  contact: string;
  email: string;
  industry: string | null;
  health: ClientHealth;
  lifetimeValue: Money;
  since: string;
  ownerId: Id;
  projectIds: Id[];
};

/* --------------------------------------------------------------- system -- */

export type Notification = {
  id: Id;
  toUserId: Id;
  kind: "verdict" | "defect" | "leave" | "kra" | "payroll" | "mention" | "invitation";
  title: string;
  detail: string;
  read: boolean;
  at: Instant;
  href: string | null;
};

export type EventKind = "standup" | "meeting" | "release" | "leave" | "gate";

export type CalendarEvent = {
  id: Id;
  kind: EventKind;
  label: string;
  on: Day;
  time: string | null;
  attendeeIds: Id[];
  branchId: Id | null;
};

/**
 * A chat thread.
 *
 * `policy` is loophole 1's fix made structural: staff threads are open to
 * any member of staff, a client thread is bound to one project, and a
 * student thread reaches only coordinators, mentors and their own cohort.
 */
export type ThreadPolicy = "staff" | "client" | "student" | "announcement";

export type Thread = {
  id: Id;
  name: string;
  policy: ThreadPolicy;
  memberIds: Id[];
  projectId: Id | null;
  cohortId: Id | null;
  unread: number;
  lastMessage: { authorId: Id; preview: string; at: Instant } | null;
};

export type Message = {
  id: Id;
  threadId: Id;
  authorId: Id;
  body: string;
  at: Instant;
  attachments: { id: Id; name: string; size: number }[];
};

/* --------------------------------------------------------------- access -- */

/** One row of the Access grid. */
export type Grant = {
  id: Id;
  userId: Id;
  module: ModuleId;
  action: Action;
  scope: Scope;
  /** Time-boxed delegation: "cover for me this week" must not be permanent. */
  expiresAt: Instant | null;
  grantedById: Id;
  grantedAt: Instant;
};

/**
 * The audit log. Append-only, not editable by anyone including the CEO.
 *
 * Written for: every grant and revocation, every tier-2 read, every role
 * change, every archive. It is how "how did this person see that?" has an
 * answer.
 */
export type AuditEntry = {
  id: Id;
  at: Instant;
  actorId: Id;
  actorName: string;
  action:
    | "grant.added"
    | "grant.revoked"
    | "role.changed"
    | "sensitive.read"
    | "record.archived"
    | "verdict.recorded"
    | "payment.recorded";
  subject: string;
  detail: string;
};
