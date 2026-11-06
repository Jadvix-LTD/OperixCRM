/*
 * Jadvix Academy — cohorts, stages, gates and fees.
 *
 * The one genuinely new domain. Shapes follow the published programme in
 * jdac/src/content/academy.ts, so the CRM and the website cannot disagree
 * about how many attempts a student gets.
 */

import type { Day, Id, Instant, Money } from "./common";

export type StageId = "frontend" | "backend" | "agentic";

export const STAGES: { id: StageId; index: number; name: string; months: string; internRole: string }[] = [
  { id: "frontend", index: 1, name: "Frontend Development", months: "Months 1–4", internRole: "Frontend Development Intern" },
  { id: "backend", index: 2, name: "Backend Development", months: "Months 5–8", internRole: "Backend Development Intern" },
  { id: "agentic", index: 3, name: "Agentic AI", months: "Months 9–10", internRole: "Agentic AI Development Intern" },
];

/** Two weeks between attempts, and never more than two. Published policy. */
export const RETRY_POLICY = { coolingOffWeeks: 2, maxAttempts: 2 } as const;

export type Cohort = {
  id: Id;
  name: string;
  branchId: Id;
  startedOn: Day;
  /** Technical and English coordinators. Both are users. */
  technicalCoordinatorId: Id;
  englishCoordinatorId: Id;
  studentIds: Id[];
};

export type GateOutcome = "not-attempted" | "scheduled" | "passed" | "failed";

/**
 * One attempt at one stage's gate.
 *
 * Stage 2 has two parts — a timed practical and an assigned full-stack
 * project — and BOTH must clear, which is why `parts` is a list rather than
 * a single score.
 */
export type GateAttempt = {
  id: Id;
  stageId: StageId;
  attempt: 1 | 2;
  outcome: GateOutcome;
  takenOn: Day | null;
  /** Null until the cooling-off period has been set by a failure. */
  retryAvailableOn: Day | null;
  parts: { label: string; passed: boolean | null; score: number | null }[];
  assessorId: Id | null;
  note: string | null;
};

export type StudentState = "enrolled" | "interning" | "converted" | "withdrawn";

export type StudentDirectory = {
  id: Id;
  name: string;
  avatar: string | null;
  cohortId: Id;
  cohortName: string;
  branchId: Id;
  currentStage: StageId;
  state: StudentState;
};

export type StudentProgress = StudentDirectory & {
  joinedAt: Day;
  /** 0–100 per stage, keyed by stage. */
  coursework: Record<StageId, number>;
  attendance: number;
  /** Mentor review out of 5, null until one is filed. */
  mentorScore: number | null;
  gates: GateAttempt[];
  /** Real projects assigned for assessment. */
  assignedProjectIds: Id[];
  /** Confidentiality and IP terms. No signature, no client project. */
  termsSignedAt: Instant | null;
};

/* ----------------------------------------------------------------- fees -- */

export type FeePlanKind = "one-time" | "monthly";

export type Instalment = {
  id: Id;
  dueOn: Day;
  amount: Money;
  state: "paid" | "due" | "overdue" | "waived";
  paidOn: Day | null;
  invoiceId: Id | null;
};

export type FeePlan = {
  id: Id;
  studentId: Id;
  kind: FeePlanKind;
  /** "full" for the whole pipeline, or a single stage. */
  covers: "full" | StageId;
  total: Money;
  paid: Money;
  instalments: Instalment[];
  /**
   * Policy adjustments, applied as rules rather than manual edits:
   * 50% off the remaining stage fee while interning, waived on conversion.
   */
  adjustment: { reason: string; percent: number } | null;
};

export type Invoice = {
  id: Id;
  number: string;
  studentId: Id;
  issuedOn: Day;
  amount: Money;
  state: "paid" | "sent" | "overdue";
  /** Razorpay's ids. We never see or store a card. */
  providerOrderId: string | null;
  providerPaymentId: string | null;
};
