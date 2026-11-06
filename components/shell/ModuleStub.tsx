"use client";

/*
 * A module that has its chrome but not its screens yet.
 *
 * Deliberately not a blank page: it states which phase builds it and what
 * the viewer's own scope on it is, so walking the ten roles is a real test
 * of the access matrix rather than a tour of empty boxes.
 */

import { Card, CardHead, Chip, EmptyState } from "@/components/ui";
import { getModule, type ModuleId } from "@/lib/access/modules";
import { scopeLabel } from "@/lib/access/capabilities";
import { useSession } from "@/lib/access/session";
import { PageHead } from "./PageHead";

export function ModuleStub({ id, phase }: { id: ModuleId; phase: number }) {
  const mod = getModule(id)!;
  const { scopeFor, viewer, roleLabel } = useSession();
  const Icon = mod.icon;
  const scope = scopeFor(id);

  return (
    <>
      <PageHead title={mod.label} sub={mod.blurb} />

      <div className="ox-grid-wide">
        <Card>
          <EmptyState icon={Icon} title={`${mod.label} arrives in phase ${phase}`}>
            The chrome, the routes and the permission model are in place. The screens for this
            module are built in phase {phase}, against the same capability checks you can see
            beside this.
          </EmptyState>
        </Card>

        <Card>
          <CardHead title="Your access" icon={Icon} action={<Chip tint="slate">Phase {phase}</Chip>} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ox-s-2)", marginTop: "var(--ox-s-4)" }}>
            <Chip tint="blue">{roleLabel}</Chip>
            <Chip tint={scope === "all" ? "green" : scope === "self" ? "slate" : "purple"}>
              {scope ? scopeLabel(scope) : "No access"}
            </Chip>
            <Chip tint="slate">{viewer.branch}</Chip>
          </div>
          <p style={{ marginTop: "var(--ox-s-4)", fontSize: "var(--ox-fs-xs)", color: "var(--ox-muted)" }}>
            Scope decides whose rows you will see here once the screens exist. It is resolved on
            the server in phase 2 — this is only the viewer&rsquo;s side of the same answer.
          </p>
        </Card>
      </div>
    </>
  );
}
