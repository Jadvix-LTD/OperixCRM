/*
 * The capability engine.
 *
 * One sentence a non-engineer can read: "Priya may view employees for her
 * branch." Three independent dimensions — module, action, scope — written as
 *
 *     module.action:scope          employees.view:branch
 *
 * This file is the client half. Phase 2 builds its server twin, which answers
 * the same questions and additionally turns a scope into a database filter.
 * The UI never decides what is visible; it only avoids drawing a door that
 * would be locked.
 *
 * See section 3 of docs/structure/OperixCRM-Structure.pdf.
 */

import { MODULE_IDS, type ModuleId } from "./modules";

/* --------------------------------------------------------------- types -- */

export const ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "manage",
  "approve",
  "assign",
  "grade",
  "pay",
] as const;

export type Action = (typeof ACTIONS)[number];

/**
 * Ordered, and each contains the ones before it. `assigned` is the exception:
 * it cuts across the ladder and means "rows where you appear in the
 * membership list", which is resolved by a record guard rather than by org
 * position.
 */
export const SCOPES = ["self", "assigned", "team", "branch", "all"] as const;
export type Scope = (typeof SCOPES)[number];

const SCOPE_RANK: Record<Scope, number> = {
  self: 0,
  assigned: 1,
  team: 2,
  branch: 3,
  all: 4,
};

/** `manage` is shorthand. Expanding it here keeps the templates readable. */
const MANAGE_EXPANDS: Action[] = ["view", "create", "edit", "delete", "approve", "assign"];

/** Doing any of these implies being able to see the thing you are doing it to. */
const IMPLIES_VIEW: Action[] = ["create", "edit", "delete", "approve", "assign", "grade", "pay"];

export type Capability = { module: ModuleId; action: Action; scope: Scope };

/** module -> action -> the widest scope held. */
export type CapabilitySet = Partial<Record<ModuleId, Partial<Record<Action, Scope>>>>;

/* -------------------------------------------------------------- parsing -- */

const MODULE_SET = new Set<string>(MODULE_IDS);
const ACTION_SET = new Set<string>(ACTIONS);
const SCOPE_SET = new Set<string>(SCOPES);

/**
 * Parse one grant string. Returns null for anything unrecognised rather than
 * throwing — a stale grant left behind by a renamed module should be ignored,
 * not take the whole menu down.
 */
export function parseGrant(raw: string): Capability | null {
  const [left, scopeRaw] = raw.trim().split(":");
  const [moduleRaw, actionRaw] = (left ?? "").split(".");
  if (!MODULE_SET.has(moduleRaw) || !ACTION_SET.has(actionRaw) || !SCOPE_SET.has(scopeRaw)) {
    return null;
  }
  return { module: moduleRaw as ModuleId, action: actionRaw as Action, scope: scopeRaw as Scope };
}

export function formatGrant(c: Capability): string {
  return `${c.module}.${c.action}:${c.scope}`;
}

/* ------------------------------------------------------------- resolving -- */

function widen(set: CapabilitySet, module: ModuleId, action: Action, scope: Scope) {
  const forModule = (set[module] ??= {});
  const held = forModule[action];
  // A later grant never narrows an earlier one; the widest wins.
  if (!held || SCOPE_RANK[scope] > SCOPE_RANK[held]) forModule[action] = scope;
}

function applyGrant(set: CapabilitySet, c: Capability) {
  const actions = c.action === "manage" ? [c.action, ...MANAGE_EXPANDS] : [c.action];
  for (const a of actions) {
    widen(set, c.module, a, c.scope);
    if (IMPLIES_VIEW.includes(a)) widen(set, c.module, "view", c.scope);
  }
}

/**
 * Resolve the capabilities a person actually holds.
 *
 *   effective = template(roles) + grants(user) − revocations(user)
 *
 * Revocations are applied last and remove the action outright, which is how a
 * CEO takes one module back off a role that would otherwise have it.
 */
export function resolveCapabilities({
  template,
  grants = [],
  revocations = [],
}: {
  template: readonly string[];
  grants?: readonly string[];
  revocations?: readonly string[];
}): CapabilitySet {
  const set: CapabilitySet = {};

  for (const raw of [...template, ...grants]) {
    const c = parseGrant(raw);
    if (c) applyGrant(set, c);
  }

  for (const raw of revocations) {
    const c = parseGrant(raw);
    if (!c) continue;
    const forModule = set[c.module];
    if (!forModule) continue;
    const actions = c.action === "manage" ? [c.action, ...MANAGE_EXPANDS] : [c.action];
    for (const a of actions) delete forModule[a];
    if (Object.keys(forModule).length === 0) delete set[c.module];
  }

  return set;
}

/* --------------------------------------------------------------- asking -- */

/** The scope held for this module and action, or null when it is not held. */
export function scopeFor(set: CapabilitySet, module: ModuleId, action: Action = "view"): Scope | null {
  return set[module]?.[action] ?? null;
}

/**
 * Can this person do it — optionally, at least this wide?
 *
 *   can(caps, "employees", "view")             may they open Employees at all
 *   can(caps, "employees", "view", "branch")   may they see the whole branch
 */
export function can(
  set: CapabilitySet,
  module: ModuleId,
  action: Action = "view",
  atLeast?: Scope,
): boolean {
  const held = scopeFor(set, module, action);
  if (!held) return false;
  if (!atLeast) return true;
  return SCOPE_RANK[held] >= SCOPE_RANK[atLeast];
}

/** Every module this person may open, in registry order. */
export function openableModules(set: CapabilitySet): ModuleId[] {
  return MODULE_IDS.filter((id) => Boolean(set[id] && Object.keys(set[id]!).length > 0));
}

/**
 * Nobody can hand out what they do not hold.
 *
 * Checked in the UI so the Access grid cannot offer an impossible option, and
 * again on the server in phase 2, where it actually matters.
 */
export function mayDelegate(granter: CapabilitySet, grant: Capability): boolean {
  const held = scopeFor(granter, grant.module, grant.action);
  return held !== null && SCOPE_RANK[held] >= SCOPE_RANK[grant.scope];
}

export function scopeLabel(scope: Scope): string {
  return {
    self: "Just their own",
    assigned: "What they are assigned",
    team: "Their team or cohort",
    branch: "Their branch",
    all: "Everything",
  }[scope];
}
