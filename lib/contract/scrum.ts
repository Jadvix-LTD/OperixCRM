/*
 * Projects, tasks and the QC verdict that moves a KRA score.
 *
 * The rules encoded in these shapes, from the old CRM and section 7 of the
 * structure document:
 *   - a project needs only a name and a code; everything else is optional
 *   - membership has a state, because individuals accept and teams do not
 *   - a checklist line carries TWO numbers: score (progress) and points
 *     (what it costs the assignee if QC rejects it)
 */

import type { Day, Id, Instant, Money } from "./common";

export type ProjectState = "planning" | "in-scope" | "running-late" | "on-hold" | "delivered";

export type MilestoneState = "planned" | "in-progress" | "done" | "delayed";

export type Milestone = {
  id: Id;
  label: string;
  due: Day;
  state: MilestoneState;
  note: string | null;
};

export type MemberRole = "manager" | "member";
/** Individuals are invited and accept; a team is placed straight to accepted. */
export type MemberState = "invited" | "accepted" | "declined";

export type ProjectMember = {
  userId: Id;
  role: MemberRole;
  state: MemberState;
  invitedAt: Instant;
  respondedAt: Instant | null;
};

export type Project = {
  id: Id;
  /** Human-facing, used in task ids: NWC-412. */
  code: string;
  name: string;
  /** Everything below here is optional — only name and code are required. */
  description: string | null;
  problemStatement: string | null;
  solution: string | null;
  clientId: Id | null;
  clientName: string | null;
  branchId: Id;
  state: ProjectState;
  /** Mean of the task scores, computed on read. Never stored. */
  progress: number;
  budget: Money | null;
  startDate: Day | null;
  dueDate: Day | null;
  members: ProjectMember[];
  teamIds: Id[];
  plan: Milestone[];
  /** Students may not join a project with this false. See loophole 3. */
  studentsAllowed: boolean;
};

export type TaskState = "not-started" | "working" | "stuck" | "in-qc" | "done";

export type ChecklistItem = {
  id: Id;
  label: string;
  /** 0–1. Drives task and project progress. */
  score: number;
  /** What this line costs EACH assignee if QC returns an Error verdict. */
  points: number;
};

export type QcVerdict = "approved" | "corrections" | "error";

export type QcReview = {
  id: Id;
  at: Instant;
  byUserId: Id;
  verdict: QcVerdict;
  note: string | null;
  failedItemIds: Id[];
  /** Zero unless the verdict was Error. Corrections never costs anything. */
  pointsDeducted: number;
  /** The KRA move per person, frozen at review time. */
  affected: { userId: Id; from: number; to: number }[];
};

export type BugSeverity = "critical" | "major" | "minor";

export type Task = {
  id: Id;
  /** TSK-412 or NWC-412. */
  code: string;
  title: string;
  description: string | null;
  projectId: Id;
  projectName: string;
  sprintId: Id | null;
  assigneeIds: Id[];
  state: TaskState;
  /** 1–5, the product's P1–P5. */
  priority: number;
  points: number;
  checklist: ChecklistItem[];
  qcReviews: QcReview[];
  startDate: Day | null;
  dueDate: Day | null;
  /** Set when the task began life as a defect in Proposed Bugs. */
  origin: { kind: "qc-bug"; severity: BugSeverity; raisedByUserId: Id; foundIn: string } | null;
  attachmentCount: number;
};

export type SprintState = "planned" | "active" | "completed";

export type Sprint = {
  id: Id;
  projectId: Id;
  name: string;
  goal: string | null;
  state: SprintState;
  startDate: Day | null;
  endDate: Day | null;
};
