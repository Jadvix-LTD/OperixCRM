"use client";

/*
 * /system/design — the live reference for @operix/ui.
 *
 * Every token and every component in every state, on one page. It is the
 * first page built and the one reviewed whenever anything is added, so a
 * component that is not here does not exist as far as the product is
 * concerned.
 */

import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  Check,
  ClipboardList,
  Clock3,
  FolderKanban,
  Inbox,
  Moon,
  Plus,
  Save,
  Sun,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import "./design.css";
import {
  Avatar,
  AvatarStack,
  Badge,
  Bar,
  Breadcrumb,
  Button,
  Card,
  CardHead,
  Checkbox,
  Combobox,
  DataTable,
  DescList,
  Dial,
  DotMatrix,
  EmptyState,
  ErrorState,
  Field,
  Figure,
  FigureRow,
  FileField,
  FilterPills,
  FormActions,
  FormGrid,
  FormWide,
  Gauge,
  IconButton,
  Input,
  MonthBars,
  NavPills,
  Panel,
  PersonCell,
  Radio,
  RankBars,
  SearchInput,
  SidePanel,
  Skeleton,
  SkeletonRows,
  Sparkline,
  StatusStrip,
  Switch,
  Tabs,
  Textarea,
  Timeline,
  TINTS,
  TINT_MEANING,
  Chip,
  Select,
} from "@/components/ui";

/* ------------------------------------------------------------- fixtures -- */

const PEOPLE = [
  { id: "1", name: "Karthik Suresh", role: "Team Leader — Platform", branch: "Chennai", kra: 97, state: "Active" },
  { id: "2", name: "Neha Iyer", role: "Software Engineer", branch: "Chennai", kra: 94, state: "Active" },
  { id: "3", name: "Meera Krishnan", role: "Team Leader — Web", branch: "Ruislip", kra: 91, state: "Active" },
  { id: "4", name: "Arun Varghese", role: "UI Designer", branch: "Coimbatore", kra: 86, state: "Available" },
];

const PROJECT_OPTIONS = [
  { value: "nw", label: "Northwind Commerce", hint: "Northwind Ltd · 78%" },
  { value: "lm", label: "Lumen Patient Portal", hint: "Lumen Health · 46%" },
  { value: "ks", label: "Kestrel Fleet", hint: "Kestrel Logistics · 91%" },
  { value: "hb", label: "Harbour Intranet", hint: "Harbour Group · 23%" },
];

const LIT = [2, 3, 2, 4, 5, 3, 4, 6, 5, 4, 7, 6];
const TOTAL = [4, 5, 4, 6, 7, 5, 6, 8, 7, 6, 9, 8];
const MONTH = [72, 88, 95, 64, 100, 0, 0, 83, 91, 100, 78, 86, 0, 0, 94, 88, 100, 70, 92, 0, 0, 85];

const FOUNDATION: [string, string][] = [
  ["--ink", "Headings and figures"],
  ["--ink-2", "Body copy"],
  ["--muted", "Labels, secondary"],
  ["--faint", "Placeholder, disabled"],
  ["--surface", "Page behind the cards"],
  ["--surface-2", "Table head, wells"],
  ["--card", "Card"],
  ["--line", "Control border"],
  ["--hairline", "Row divider"],
  ["--line-strong", "Hover border"],
];

/* ----------------------------------------------------------------- page -- */

export default function DesignPage() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("profile");
  const [pill, setPill] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [project, setProject] = useState<string | null>("nw");
  const [notify, setNotify] = useState(true);
  const [plan, setPlan] = useState("monthly");
  const [strip, setStrip] = useState(true);
  const [panel, setPanel] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };

  return (
    <main className="ref">
      <header className="ref-top">
        <div>
          <Breadcrumb items={[{ label: "System", href: "/system" }, { label: "Design" }]} />
          <h1>OperixCRM design system</h1>
          <p>
            Every token and every component, in every state. Nothing ships to the product that is not
            on this page first.
          </p>
        </div>
        <Button icon={dark ? Sun : Moon} onClick={toggleTheme}>
          {dark ? "Light" : "Dark"}
        </Button>
      </header>

      {/* ------------------------------------------------------- tokens -- */}
      <Section id="tints" title="Accent tints" note="Colour carries meaning, not decoration.">
        <div className="ref-tints">
          {TINTS.map((t) => (
            <div key={t} className="ref-tint" data-tint={t}>
              <span className="ref-tint-chips">
                <i className="ref-sw-bg" />
                <i className="ref-sw-solid" />
              </span>
              <b>{t}</b>
              <small>{TINT_MEANING[t]}</small>
              <Chip tint={t} dot>
                Example
              </Chip>
            </div>
          ))}
        </div>
      </Section>

      <Section id="foundation" title="Foundation" note="Ink is never pure black; shadows are tinted blue, never grey.">
        <div className="ref-found">
          {FOUNDATION.map(([v, use]) => (
            <div key={v} className="ref-found-row">
              <i style={{ background: `var(${v})` }} />
              <code>{v}</code>
              <small>{use}</small>
            </div>
          ))}
        </div>
        <div className="ref-radius">
          {[
            ["chip", "var(--r-chip)"],
            ["control", "var(--r-control)"],
            ["card", "var(--r-card)"],
            ["panel", "var(--r-panel)"],
            ["pill", "var(--r-pill)"],
          ].map(([name, v]) => (
            <div key={name}>
              <span style={{ borderRadius: v }} />
              <code>{name}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ buttons -- */}
      <Section id="buttons" title="Buttons" note="One solid action per screen region. Everything else is quieter.">
        <Row>
          <Button variant="solid" icon={Plus}>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger" icon={Trash2}>Archive</Button>
        </Row>
        <Row>
          <Button variant="solid" size="sm">Small</Button>
          <Button variant="solid" size="md">Medium</Button>
          <Button variant="solid" size="lg" icon={ArrowRight} iconAfter>Large</Button>
          <Button variant="outline" disabled>Disabled</Button>
          <Button variant="solid" busy={busy} icon={Save} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1600); }}>
            Save changes
          </Button>
        </Row>
        <Row>
          <IconButton icon={Plus} label="Add" />
          <IconButton icon={Trash2} label="Delete" variant="danger" />
          <IconButton icon={Check} label="Approve" variant="subtle" />
        </Row>
      </Section>

      {/* ------------------------------------------------- chips, people -- */}
      <Section id="chips" title="Chips, badges and people">
        <Row>
          <Chip tint="green" dot>Approved</Chip>
          <Chip tint="orange" dot>Running late</Chip>
          <Chip tint="red" dot>Error verdict</Chip>
          <Chip tint="blue" icon={Clock3}>Clocked in</Chip>
          <Chip tint="slate">Archived</Chip>
          <Badge tint="blue">12</Badge>
          <Badge tint="red">3</Badge>
        </Row>
        <Row>
          <Avatar name="Neha Iyer" presence="online" />
          <Avatar name="Karthik Suresh" size={36} presence="away" />
          <Avatar name="Meera Krishnan" size={44} presence="busy" />
          <AvatarStack names={PEOPLE.map((p) => p.name).concat("Rahul Nair", "Divya Ramesh")} />
        </Row>
        <Row>
          <div style={{ width: 220 }}><Bar value={78} tint="green" label="78 per cent" /></div>
          <div style={{ width: 220 }}><Bar value={46} tint="orange" label="46 per cent" /></div>
          <div style={{ width: 220 }}><Bar value={12} tint="red" label="12 per cent" /></div>
        </Row>
      </Section>

      {/* ----------------------------------------------------- feedback -- */}
      <Section id="feedback" title="Feedback" note="No toasts and no modals — a strip stays until it is dismissed.">
        {strip && (
          <StatusStrip kind="success" title="Changes saved" onDismiss={() => setStrip(false)}>
            Priya Raghavan now has <b>employees.view:branch</b>. The change is in the audit log.
          </StatusStrip>
        )}
        <StatusStrip kind="warning" title="Two gates expire this week" action={<Button size="sm">Review</Button>} />
        <StatusStrip kind="error" title="Couldn't reach the payment provider">
          Nothing was charged. The instalment is still marked unpaid.
        </StatusStrip>
        <StatusStrip kind="info" title="You are viewing the Coimbatore branch" />

        <div className="ref-pair">
          <Card>
            <EmptyState icon={Inbox} title="Nothing waiting on you" action={<Button icon={Plus}>New request</Button>}>
              Project invitations and leave requests arrive here.
            </EmptyState>
          </Card>
          <Card>
            <ErrorState onRetry={() => undefined} />
          </Card>
        </div>

        <div className="ref-pair">
          <Card>
            <CardHead title="Loading a list" />
            <SkeletonRows rows={4} />
          </Card>
          <Card>
            <CardHead title="Loading a figure" />
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <Skeleton w={120} h={28} />
              <Skeleton w="70%" />
              <Skeleton w="45%" />
            </div>
          </Card>
        </div>
      </Section>

      {/* -------------------------------------------------------- forms -- */}
      <Section id="forms" title="Forms" note="Only name and code are ever required on a project.">
        <Card>
          <Panel title="Project" description="Everything but the name and the code can be filled in later.">
            <FormGrid>
              <Field label="Project name" required>
                {({ id, describedBy }) => (
                  <Input id={id} aria-describedby={describedBy} defaultValue="Northwind Commerce" />
                )}
              </Field>
              <Field label="Code" required hint="Used in task ids — NWC-412.">
                {({ id, describedBy }) => <Input id={id} aria-describedby={describedBy} defaultValue="NWC" />}
              </Field>
              <Field label="Client account" hint="Optional.">
                {({ id, describedBy }) => (
                  <Combobox
                    id={id}
                    describedBy={describedBy}
                    options={PROJECT_OPTIONS}
                    value={project}
                    onChange={setProject}
                    placeholder="Search accounts…"
                  />
                )}
              </Field>
              <Field label="Branch">
                {({ id }) => (
                  <Select id={id} defaultValue="chennai">
                    <option value="ruislip">Ruislip</option>
                    <option value="chennai">Chennai</option>
                    <option value="coimbatore">Coimbatore</option>
                  </Select>
                )}
              </Field>
              <Field label="Starts">{({ id }) => <Input id={id} type="date" defaultValue="2026-11-10" />}</Field>
              <Field label="Budget">
                {({ id }) => <Input id={id} prefix="£" suffix="GBP" defaultValue="96,400" />}
              </Field>
              <FormWide>
                <Field label="Problem statement" hint="Optional. What the client is actually trying to fix.">
                  {({ id, describedBy }) => <Textarea id={id} aria-describedby={describedBy} rows={3} />}
                </Field>
              </FormWide>
              <FormWide>
                <Field label="Code of conduct" error="A signed copy is required before students can join.">
                  {({ id }) => <FileField id={id} hint="PDF, up to 10 MB." accept="application/pdf" />}
                </Field>
              </FormWide>
            </FormGrid>
          </Panel>

          <Panel title="Access" description="Who this project is visible to.">
            <div className="ref-choices">
              <Checkbox label="Students may be assigned" hint="Blocked until confidentiality terms are signed." defaultChecked />
              <Checkbox label="Client can see the delivery plan" defaultChecked />
              <Checkbox label="Archived" hint="Hidden from pickers; work is kept." />
            </div>
            <div className="ref-choices">
              <Radio name="plan" label="One-time payment" hint="Paid at enrolment." checked={plan === "once"} onChange={() => setPlan("once")} />
              <Radio name="plan" label="Monthly plan" hint="Auto-debited, ~15% premium." checked={plan === "monthly"} onChange={() => setPlan("monthly")} />
            </div>
            <div className="ref-switch">
              <Switch checked={notify} onChange={setNotify} label="Notify the team on assignment" />
              <span>
                <b>Notify the team on assignment</b>
                <small>Teams skip the acceptance step, so notice is the only signal.</small>
              </span>
            </div>
          </Panel>

          <FormActions note="Nothing is saved until you choose Save.">
            <Button variant="ghost">Cancel</Button>
            <Button variant="solid" icon={Save}>Save project</Button>
          </FormActions>
        </Card>

        <Row>
          <div style={{ width: 280 }}><SearchInput placeholder="Find someone…" /></div>
          <div style={{ width: 280 }}><Input placeholder="With an error" invalid defaultValue="JDX-" /></div>
        </Row>
      </Section>

      {/* ---------------------------------------------------------- nav -- */}
      <Section id="nav" title="Navigation">
        <Row>
          <NavPills
            label="View"
            value={pill}
            onChange={setPill}
            items={[
              { id: "overview", label: "Overview" },
              { id: "clock", label: "Clock" },
              { id: "kra", label: "KRA" },
              { id: "team", label: "Team" },
            ]}
          />
        </Row>
        <Row>
          <FilterPills
            label="Filter"
            value={filter}
            onChange={setFilter}
            items={[
              { id: "all", label: "Everyone", count: 128 },
              { id: "active", label: "Active", count: 74 },
              { id: "leave", label: "On leave", count: 3 },
              { id: "archived", label: "Archived", count: 11 },
            ]}
          />
        </Row>
        <Tabs
          label="Record sections"
          value={tab}
          onChange={setTab}
          items={[
            { id: "profile", label: "Profile" },
            { id: "work", label: "Work" },
            { id: "documents", label: "Documents", count: 4 },
            { id: "access", label: "Access" },
          ]}
        />
        <Breadcrumb
          items={[
            { label: "Scrum", href: "/scrum" },
            { label: "Projects", href: "/scrum/projects" },
            { label: "Northwind Commerce", href: "/scrum/projects/nwc" },
            { label: "Tasks", href: "/scrum/projects/nwc/tasks" },
            { label: "TSK-412" },
          ]}
        />
        <Row>
          <Button onClick={() => setPanel((p) => !p)}>{panel ? "Close" : "Open"} the side panel</Button>
        </Row>
        {panel && (
          <div className="ref-side-demo">
            <div className="ref-side-list">
              <p>The list stays visible. The panel pushes it aside instead of covering it.</p>
            </div>
            <SidePanel
              title="Neha Iyer"
              onClose={() => setPanel(false)}
              footer={<Button variant="solid" size="sm">Open full record</Button>}
            >
              <DescList
                items={[
                  { label: "Role", value: "Software Engineer" },
                  { label: "Branch", value: "Chennai" },
                  { label: "KRA", value: <Chip tint="green">94</Chip> },
                  { label: "Today", value: "6h 39m" },
                ]}
              />
            </SidePanel>
          </div>
        )}
      </Section>

      {/* --------------------------------------------------------- data -- */}
      <Section id="data" title="Data display">
        <Card flush>
          <CardHead title="Employee directory" icon={Users} action={<Chip tint="green" dot>74 clocked in</Chip>} />
          <DataTable
            caption="Employee directory"
            rows={PEOPLE}
            rowKey={(p) => p.id}
            onRowClick={() => undefined}
            columns={[
              {
                key: "name",
                head: "Name",
                cell: (p) => <PersonCell name={p.name} sub={p.role} avatar={<Avatar name={p.name} size={26} />} />,
              },
              { key: "branch", head: "Branch", cell: (p) => p.branch },
              {
                key: "kra",
                head: "KRA",
                numeric: true,
                width: 120,
                cell: (p) => (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Bar value={p.kra} tint={p.kra >= 95 ? "green" : p.kra >= 90 ? "blue" : "orange"} />
                    <b>{p.kra}</b>
                  </span>
                ),
              },
              {
                key: "state",
                head: "Status",
                width: 110,
                cell: (p) => <Chip tint={p.state === "Active" ? "green" : "slate"} dot>{p.state}</Chip>,
              },
            ]}
          />
        </Card>

        <Card>
          <FigureRow>
            <Figure icon={Users} label="Headcount" value="128" sub="All branches" tint="blue" />
            <Figure icon={Target} label="Average KRA" value="91.4" tint="green" />
            <Figure icon={Clock3} label="Hours this month" value="164h 20m" tint="purple" />
            <Figure icon={Banknote} label="Payroll" value="£84,317" sub="Runs Friday" tint="orange" />
          </FigureRow>
        </Card>

        <div className="ref-pair">
          <Card>
            <CardHead title="Delivery plan" icon={FolderKanban} />
            <div style={{ marginTop: 16 }}>
              <Timeline
                steps={[
                  { id: "1", label: "Discovery and scope", meta: "12 Aug", state: "done" },
                  { id: "2", label: "Design sign-off", meta: "26 Aug", state: "done" },
                  { id: "3", label: "Build — phase two", meta: "14 Nov", state: "current", trailing: <Chip tint="blue">In scope</Chip> },
                  { id: "4", label: "UAT and handover", meta: "5 Dec", state: "todo" },
                  { id: "5", label: "Kestrel hotfix", meta: "overdue", state: "late", trailing: <Chip tint="orange">Late</Chip> },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHead title="Record" icon={ClipboardList} />
            <div style={{ marginTop: 16 }}>
              <DescList
                items={[
                  { label: "Employee id", value: "JDX-042" },
                  { label: "Reports to", value: <PersonCell name="Priya Raghavan" avatar={<Avatar name="Priya Raghavan" size={22} />} /> },
                  { label: "Joined", value: "14 March 2024" },
                  { label: "Contract", value: <Chip tint="blue">Full time</Chip> },
                ]}
              />
            </div>
          </Card>
        </div>
      </Section>

      {/* ------------------------------------------------------- charts -- */}
      <Section id="charts" title="Charts" note="Hand-drawn SVG, no charting library. Four shapes cover the product.">
        <div className="ref-charts">
          <Card>
            <CardHead title="Consistency" icon={TrendingUp} />
            <div className="ref-centre">
              <Dial value={92} tint="green" label="Attendance 92 per cent">
                <b>92%</b>
                <small>attendance</small>
              </Dial>
            </div>
          </Card>
          <Card>
            <CardHead title="QC pass rate" icon={Check} />
            <Gauge active={21} value="8,214" label="Items signed off" animate />
          </Card>
          <Card>
            <CardHead title="Hours logged" icon={Clock3} />
            <div style={{ height: 120, marginTop: 14 }}>
              <MonthBars values={MONTH} label="Hours per day this month" />
            </div>
          </Card>
          <Card>
            <CardHead title="Delivery" icon={FolderKanban} />
            <div style={{ height: 130, marginTop: 14 }}>
              <DotMatrix lit={LIT} total={TOTAL} label="Tasks closed per month" />
            </div>
          </Card>
          <Card>
            <CardHead title="Top teams" icon={Users} />
            <div style={{ marginTop: 16 }}>
              <RankBars
                label="Tasks delivered by team"
                data={[
                  { label: "Platform", value: 146 },
                  { label: "Web", value: 109 },
                  { label: "Video", value: 75 },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHead title="Average time worked" icon={Clock3} action={<Chip tint="red">−0.4%</Chip>} />
            <p className="ref-big">6:39:32</p>
            <div style={{ height: 56 }}>
              <Sparkline points={[40, 62, 35, 70, 48, 80, 55, 72, 60]} label="Trend" />
            </div>
          </Card>
        </div>
      </Section>

      {/* ------------------------------------------------------- the nos -- */}
      <Section id="rules" title="What this system refuses to do">
        <div className="ref-nos">
          {[
            ["No modal component", "Create, edit and confirm are real routes with breadcrumbs. If the component does not exist, nobody can reach for it."],
            ["No toasts", "A status strip sits above the region that changed and stays until dismissed."],
            ["No nested cards", "Inside a card: hairlines and spacing. A card in a card in a card is how a dense tool starts to look amateur."],
            ["No second easing curve", "One curve, three durations. Anything else reads as a different product."],
            ["No raw colours", "A lint rule fails the build on a hex in a component. If a token is missing, add the token."],
            ["No decorative colour", "Green means it went well. A chart series never borrows a status colour."],
          ].map(([t, d]) => (
            <div key={t} className="ref-no">
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}

/* ------------------------------------------------------------- helpers -- */

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ref-sec" id={id}>
      <div className="ref-sec-head">
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </div>
      <div className="ref-sec-body">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="ref-row">{children}</div>;
}
