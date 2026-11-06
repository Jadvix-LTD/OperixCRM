"use client";

/*
 * The people queries.
 *
 * Every hook here returns the SAME shape the API will return in phase 2, and
 * applies the same two gates the server will: the scope filter decides which
 * rows, and the tier decides which fields. A screen receives a redacted
 * record in which the fields it may not show do not exist — so forgetting to
 * hide one is a compile error, not a leak.
 */

import { useMemo } from "react";
import type { PersonDirectory, PersonSensitive, PersonWork } from "../contract/people";
import type { Page, Query } from "../contract/common";
import { directory, sensitiveRecords, workRecords } from "../fixtures/seed";
import { useSession } from "../access/session";
import { applyScope, whoIs, type Scopable } from "./scope";

/** A person as the viewer is allowed to see them. */
export type PersonView =
  | { tier: "directory"; person: PersonDirectory }
  | { tier: "work"; person: PersonWork }
  | { tier: "sensitive"; person: PersonWork & { sensitive: PersonSensitive } };

const scopable = (p: PersonDirectory): Scopable & PersonDirectory => ({
  ...p,
  ownerId: p.id,
  memberIds: [p.id],
});

function matches(p: PersonDirectory, search?: string): boolean {
  if (!search) return true;
  const q = search.trim().toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    p.jobTitle.toLowerCase().includes(q) ||
    p.branchName.toLowerCase().includes(q)
  );
}

/**
 * The directory, scoped.
 *
 * Returns tier 0 for everyone in range, and upgrades to tier 1 for the rows
 * the viewer may read as a work record: themselves, their reports, or anyone
 * at all once they hold the module at team or wider.
 */
export function useEmployees(query: Query = {}): Page<PersonView> {
  const { viewer, scopeFor } = useSession();
  const scope = scopeFor("employees");

  return useMemo(() => {
    const who = whoIs(viewer);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const rows = applyScope(directory.map(scopable), scope, who).filter((p) => matches(p, query.search));

    // Tier 1 needs more than being able to see the row at all: self always,
    // and anyone in range once the scope reaches past `self`.
    const canReadWork = (p: PersonDirectory) => p.id === who.userId || scope !== "self";

    const views: PersonView[] = rows.map((p) => {
      if (!canReadWork(p)) return { tier: "directory", person: stripToDirectory(p) };
      const work = workRecords.find((w) => w.id === p.id)!;
      return { tier: "work", person: work };
    });

    const start = (page - 1) * pageSize;
    return {
      data: views.slice(start, start + pageSize),
      meta: { total: views.length, page, pageSize },
    };
  }, [viewer, scope, query.page, query.pageSize, query.search]);
}

/**
 * One person's sensitive record.
 *
 * Returns null unless the viewer is that person or holds an explicit grant.
 * A role NEVER implies this — see section 4 — and in phase 2 every call that
 * returns a record also writes an audit entry.
 */
export function useSensitive(personId: string): PersonSensitive | null {
  const { viewer, can } = useSession();

  return useMemo(() => {
    const who = whoIs(viewer);
    const isSelf = personId === who.userId;
    // `salary.view` is the named grant that unlocks the sensitive tier.
    const granted = can("salary", "view", "branch");
    if (!isSelf && !granted) return null;
    return sensitiveRecords.find((s) => s.id === personId) ?? null;
  }, [viewer, personId, can]);
}

/** Headline counts for the figure row, computed from the same scoped set. */
export function useEmployeeSummary() {
  const { viewer, scopeFor } = useSession();
  const scope = scopeFor("employees");

  return useMemo(() => {
    const who = whoIs(viewer);
    const rows = applyScope(directory.map(scopable), scope, who);
    const ids = new Set(rows.map((r) => r.id));
    const work = workRecords.filter((w) => ids.has(w.id));

    const avgKra = work.length ? work.reduce((n, w) => n + w.kra, 0) / work.length : 0;
    return {
      headcount: rows.length,
      averageKra: Number(avgKra.toFixed(1)),
      branches: new Set(rows.map((r) => r.branchId)).size,
      onLeave: rows.filter((r) => r.state === "leave").length,
      clockedIn: rows.filter((r) => r.presence === "online").length,
    };
  }, [viewer, scope]);
}

/**
 * Drop the tier-1 fields.
 *
 * A work record is a superset of a directory record, so narrowing the type
 * is not enough — the extra properties would still be on the object and a
 * `JSON.stringify` in a dev tool would show them. This rebuilds the object
 * with only the directory fields on it.
 */
function stripToDirectory(p: PersonDirectory): PersonDirectory {
  return {
    id: p.id,
    name: p.name,
    jobTitle: p.jobTitle,
    roles: p.roles,
    branchId: p.branchId,
    branchName: p.branchName,
    teamIds: p.teamIds,
    workEmail: p.workEmail,
    avatar: p.avatar,
    presence: p.presence,
    statusText: p.statusText,
    state: p.state,
  };
}
