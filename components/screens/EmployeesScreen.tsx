"use client";

/*
 * Employees — the first screen on real data, and the proof of the model.
 *
 * It was built first because it is the hardest: it is the module where the
 * three data tiers all meet. What this screen shows changes with who is
 * signed in, and NONE of that logic is here — the data layer returns
 * different rows and different fields, and this file just renders what it
 * was given.
 */

import { useState } from "react";
import { Building2, Clock3, Lock, Target, Users } from "lucide-react";
import {
  Avatar,
  Bar,
  Card,
  CardHead,
  Chip,
  DataTable,
  EmptyState,
  Figure,
  FigureRow,
  PersonCell,
  SearchInput,
  type Column,
} from "@/components/ui";
import { PageHead } from "@/components/shell/PageHead";
import { scopeLabel } from "@/lib/access/capabilities";
import { useSession } from "@/lib/access/session";
import { useEmployeeSummary, useEmployees, type PersonView } from "@/lib/data/people";

const STATE_TINT = {
  active: "green",
  available: "blue",
  leave: "orange",
  archived: "slate",
} as const;

export function EmployeesScreen() {
  const { scopeFor, can } = useSession();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const scope = scopeFor("employees");
  const summary = useEmployeeSummary();
  const { data, meta } = useEmployees({ search, page, pageSize: 10 });

  const pages = Math.max(1, Math.ceil(meta.total / meta.pageSize));
  // Only worth a column if at least one row carries the tier.
  const anyWork = data.some((v) => v.tier !== "directory");

  const columns: Column<PersonView>[] = [
    {
      key: "name",
      head: "Name",
      cell: (v) => (
        <PersonCell
          name={v.person.name}
          sub={v.person.jobTitle}
          avatar={<Avatar name={v.person.name} size={28} presence={v.person.presence} />}
        />
      ),
    },
    { key: "branch", head: "Branch", cell: (v) => v.person.branchName },
    {
      key: "empId",
      head: "Employee id",
      width: 110,
      cell: (v) => (v.tier === "directory" ? <Redacted /> : <code>{v.person.empId}</code>),
    },
    {
      key: "kra",
      head: "KRA",
      numeric: true,
      width: 130,
      cell: (v) =>
        v.tier === "directory" ? (
          <Redacted />
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bar value={v.person.kra} tint={v.person.kra >= 95 ? "green" : v.person.kra >= 88 ? "blue" : "orange"} />
            <b>{v.person.kra}</b>
          </span>
        ),
    },
    {
      key: "state",
      head: "Status",
      width: 110,
      cell: (v) => (
        <Chip tint={STATE_TINT[v.person.state]} dot>
          {v.person.state === "leave" ? "On leave" : v.person.state[0].toUpperCase() + v.person.state.slice(1)}
        </Chip>
      ),
    },
  ];

  return (
    <>
      <PageHead
        title="Employees"
        sub={`${meta.total} ${meta.total === 1 ? "person" : "people"} you can see — ${
          scope ? scopeLabel(scope).toLowerCase() : "no access"
        }.`}
      />

      <Card>
        <FigureRow>
          <Figure icon={Users} label="Headcount" value={summary.headcount} sub="In your scope" tint="blue" />
          <Figure icon={Target} label="Average KRA" value={anyWork ? summary.averageKra : "—"} tint="green" />
          <Figure icon={Building2} label="Branches" value={summary.branches} tint="purple" />
          <Figure icon={Clock3} label="Online now" value={summary.clockedIn} tint="sky" />
        </FigureRow>
      </Card>

      <div className="ox-grid-wide" style={{ gridTemplateColumns: "1fr" }}>
        <Card flush>
          <CardHead
            title="Directory"
            icon={Users}
            action={
              <span style={{ display: "flex", gap: "var(--ox-s-2)", alignItems: "center" }}>
                <div style={{ width: 240 }}>
                  <SearchInput
                    placeholder="Find someone…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                {can("employees", "create") && <button type="button" className="ox-pill">Invite</button>}
              </span>
            }
          />

          <DataTable
            caption="Employee directory"
            rows={data}
            rowKey={(v) => v.person.id}
            columns={columns}
            empty={
              <EmptyState icon={Users} title={search ? "Nobody matches that" : "Nobody in your scope"}>
                {search
                  ? "Try a shorter search, or a branch name."
                  : "Your access to this module covers your own record only."}
              </EmptyState>
            }
          />

          {pages > 1 && (
            <div className="ox-pager">
              <span>
                Page {meta.page} of {pages} · {meta.total} people
              </span>
              <span className="ox-pager-btns">
                <button type="button" className="ox-pill" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <button type="button" className="ox-pill" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </span>
            </div>
          )}
        </Card>
      </div>

      {!anyWork && data.length > 0 && (
        <Card>
          <CardHead title="Why some columns are blank" icon={Lock} />
          <p style={{ marginTop: "var(--ox-s-3)", fontSize: "var(--ox-fs-sm)", color: "var(--ox-muted)" }}>
            You hold Employees at <b>{scope ? scopeLabel(scope).toLowerCase() : "no scope"}</b>, which is the
            directory tier: names, roles and branches. Employee ids and KRA are the work record, and salary and
            documents are the sensitive tier — neither is fetched for you, so neither can appear here.
          </p>
        </Card>
      )}
    </>
  );
}

/** A field the viewer's tier does not include. Never a blanked-out value. */
function Redacted() {
  return (
    <span className="ox-redacted" title="Not included at your access tier">
      <Lock size={11} strokeWidth={2} aria-hidden />
      <span className="ox-sr">Not available at your access tier</span>
    </span>
  );
}
