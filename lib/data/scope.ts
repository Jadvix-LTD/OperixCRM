/*
 * The scope filter — the client-side twin of phase 2's WHERE clause.
 *
 * This is the piece that makes the access model real rather than decorative.
 * A screen never filters rows: it asks the data layer, and the data layer
 * asks this. In phase 2 the identical question is asked on the server and
 * turned into a Mongo query; the shapes the screen receives do not change.
 *
 * Deliberately pure and deliberately small, so it can be read in one sitting
 * and tested exhaustively.
 */

import type { Scope } from "../access/capabilities";
import type { Viewer } from "../access/session";
import { directory, teams } from "../fixtures/seed";

/** Everything the filter is allowed to know about who is asking. */
export type Who = {
  userId: string;
  branchId: string | null;
  teamIds: string[];
  /** Ids of people who report to them, directly or further down. */
  reportIds: string[];
};

/**
 * Resolve the viewer into the handful of ids a filter needs.
 *
 * By `personId`, never by name — two people can share a name and a viewer
 * who matched nothing would silently see an empty workspace rather than an
 * error. A Student and a Client have no roster row at all, which is correct:
 * neither has a branch or a team, and both reach records by membership.
 */
export function whoIs(viewer: Viewer): Who {
  const row = viewer.personId ? directory.find((d) => d.id === viewer.personId) : undefined;
  const teamIds = row?.teamIds ?? [];
  const reportIds = row
    ? directory.filter((d) => d.id !== row.id && d.teamIds.some((t) => teamIds.includes(t))).map((d) => d.id)
    : [];
  return {
    userId: row?.id ?? viewer.id,
    branchId: row?.branchId ?? null,
    teamIds,
    reportIds,
  };
}

/** What a row has to expose for the filter to place it. */
export type Scopable = {
  /** The person this row is about. For a record that IS a person, their id. */
  ownerId?: string;
  branchId?: string | null;
  teamIds?: string[];
  /** Ids of everyone with membership — assignees, project members, thread members. */
  memberIds?: string[];
};

/**
 * Does this row fall inside the scope?
 *
 * The ladder widens: `all` sees everything, `branch` sees its office,
 * `team` sees its squads, `self` sees only rows it owns. `assigned` cuts
 * across — it is membership, not position — which is why a task handed
 * straight to someone is visible without the project around it.
 */
export function inScope(row: Scopable, scope: Scope, who: Who): boolean {
  switch (scope) {
    case "all":
      return true;

    case "branch":
      // No branch of their own means nothing to compare against, so fall
      // back to membership rather than silently showing the whole company.
      if (!who.branchId) return isMember(row, who);
      return row.branchId === who.branchId || isSelf(row, who) || isMember(row, who);

    case "team": {
      const shared = (row.teamIds ?? []).some((t) => who.teamIds.includes(t));
      return shared || isSelf(row, who) || isMember(row, who);
    }

    case "assigned":
      return isMember(row, who) || isSelf(row, who);

    case "self":
      return isSelf(row, who);
  }
}

function isSelf(row: Scopable, who: Who): boolean {
  return row.ownerId === who.userId;
}

function isMember(row: Scopable, who: Who): boolean {
  return (row.memberIds ?? []).includes(who.userId);
}

/** Apply a scope to a list. The only way a screen should ever narrow rows. */
export function applyScope<T extends Scopable>(rows: readonly T[], scope: Scope | null, who: Who): T[] {
  if (!scope) return [];
  return rows.filter((row) => inScope(row, scope, who));
}

/** Team name for a label, since the filter already has the lookup to hand. */
export function teamName(id: string): string {
  return teams.find((t) => t.id === id)?.name ?? id;
}
