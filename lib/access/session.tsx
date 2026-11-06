"use client";

/*
 * Who is signed in, and what they may open.
 *
 * Phase 1 has no authentication: the viewer is held in React state and can be
 * switched from the dev-only role switcher in the shell. Phase 2 replaces the
 * provider's internals with a real session and changes nothing else — every
 * screen already asks the same questions through `useSession()`.
 *
 * The session is deliberately NOT persisted to localStorage. A role switch is
 * a development convenience, and one that survived a reload would eventually
 * be mistaken for a real sign-in.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  can as canDo,
  openableModules,
  resolveCapabilities,
  scopeFor,
  type Action,
  type CapabilitySet,
  type Scope,
} from "./capabilities";
import type { ModuleId } from "./modules";
import { ROLES, landingFor, templateFor, type RoleId } from "./roles";
import { VIEWER_IDS } from "../fixtures/seed";

export type Viewer = {
  id: string;
  /**
   * The roster row this account is. Null for a Student, who is not an
   * employee, and a Client, who is external — both reach records by
   * membership rather than by position in the org.
   */
  personId: string | null;
  name: string;
  roles: RoleId[];
  jobTitle: string;
  branch: string;
  avatar?: string;
  /** Extra capabilities the CEO has granted this person, beyond their roles. */
  grants?: string[];
  /** Capabilities taken back off their roles. */
  revocations?: string[];
};

/*
 * The people the dev role switcher offers — one per role, so all ten are
 * reachable. The first eight ARE roster rows (see VIEWER_IDS in the
 * fixtures), which is what lets the scope filter find their branch and
 * teams. Signing in as someone who does not exist would see nothing.
 */
export const DEMO_VIEWERS: Viewer[] = [
  { id: "v-ceo", personId: VIEWER_IDS.ceo, name: "Jachin Raja", roles: ["ceo"], jobTitle: "CEO & Founder", branch: "Ruislip" },
  { id: "v-mgr", personId: VIEWER_IDS.manager, name: "Priya Raghavan", roles: ["manager"], jobTitle: "Delivery Manager", branch: "Chennai" },
  { id: "v-lead", personId: VIEWER_IDS.lead, name: "Karthik Suresh", roles: ["lead"], jobTitle: "Team Leader — Platform", branch: "Chennai" },
  { id: "v-coord", personId: VIEWER_IDS.coordinator, name: "Elavarasi Manoharan", roles: ["coordinator"], jobTitle: "Technical Coordinator", branch: "Coimbatore" },
  { id: "v-qc", personId: VIEWER_IDS.qc, name: "Rahul Nair", roles: ["qc"], jobTitle: "QA Lead", branch: "Ruislip" },
  { id: "v-dev", personId: VIEWER_IDS.developer, name: "Neha Iyer", roles: ["developer"], jobTitle: "Software Engineer", branch: "Chennai" },
  { id: "v-int", personId: VIEWER_IDS.intern, name: "Vishnu Prasad", roles: ["intern"], jobTitle: "Frontend Development Intern", branch: "Chennai" },
  { id: "v-sales", personId: VIEWER_IDS.sales, name: "Negha Sharma", roles: ["sales"], jobTitle: "Sales Manager", branch: "Ruislip" },
  // Not employees: a student and an external client.
  { id: "s-000", personId: null, name: "Divya Ramesh", roles: ["student"], jobTitle: "Student — Cohort 2026-A", branch: "Coimbatore" },
  { id: "v-client", personId: null, name: "Daniel Fernandes", roles: ["client"], jobTitle: "Client — Northwind Ltd", branch: "—" },
];

type SessionValue = {
  viewer: Viewer;
  capabilities: CapabilitySet;
  /** Modules this viewer may open, in registry order. */
  modules: ModuleId[];
  landing: string;
  can: (module: ModuleId, action?: Action, atLeast?: Scope) => boolean;
  scopeFor: (module: ModuleId, action?: Action) => Scope | null;
  roleLabel: string;
  /** Development only. Undefined in production. */
  setViewer?: (v: Viewer) => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({
  children,
  initial = DEMO_VIEWERS[0],
}: {
  children: ReactNode;
  initial?: Viewer;
}) {
  const [viewer, setViewer] = useState<Viewer>(initial);

  const capabilities = useMemo(
    () =>
      resolveCapabilities({
        template: templateFor(viewer.roles),
        grants: viewer.grants,
        revocations: viewer.revocations,
      }),
    [viewer],
  );

  const can = useCallback(
    (module: ModuleId, action: Action = "view", atLeast?: Scope) =>
      canDo(capabilities, module, action, atLeast),
    [capabilities],
  );

  const scope = useCallback(
    (module: ModuleId, action: Action = "view") => scopeFor(capabilities, module, action),
    [capabilities],
  );

  const value = useMemo<SessionValue>(
    () => ({
      viewer,
      capabilities,
      modules: openableModules(capabilities),
      landing: landingFor(viewer.roles),
      can,
      scopeFor: scope,
      roleLabel: viewer.roles.map((r) => ROLES[r].label).join(" · "),
      setViewer: process.env.NODE_ENV === "development" ? setViewer : undefined,
    }),
    [viewer, capabilities, can, scope],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

/**
 * Hide a fragment unless the viewer holds the capability.
 *
 * A convenience for small pieces — a button, a column. A whole PAGE is
 * guarded by its route, not by this, so that an unauthorised URL answers
 * properly instead of rendering an empty shell.
 */
export function Gate({
  module,
  action = "view",
  atLeast,
  children,
  fallback = null,
}: {
  module: ModuleId;
  action?: Action;
  atLeast?: Scope;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = useSession();
  return <>{can(module, action, atLeast) ? children : fallback}</>;
}
