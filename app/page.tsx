import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  Building2,
  Check,
  Clock3,
  KeyRound,
  MoreHorizontal,
  Radio,
  ShieldCheck,
  Target,
} from "lucide-react";
import { DEMO_MAILTO, FOOTER_COLUMNS, MODULE_COUNT } from "@/lib/content";
import { Bars, DotMatrix, Gauge, Sparkline } from "@/components/charts";
import { DashboardApp } from "@/components/dash/DashboardApp";
import { Discover } from "@/components/Discover";
import { KraProof } from "@/components/KraProof";
import { Logo } from "@/components/Logo";
import { ModuleShowcase } from "@/components/ModuleShowcase";
import { Nav } from "@/components/Nav";
import { PortalGrid } from "@/components/PortalGrid";
import { Reveal } from "@/components/Reveal";
import { Ribbon } from "@/components/Ribbon";
import { ScaleFrame } from "@/components/ScaleFrame";
import { Testimonials } from "@/components/Testimonials";
import { Vision } from "@/components/Vision";

const FEATURE_LIT = [2, 3, 2, 4, 5, 3, 4, 6, 5, 4, 7, 6, 5, 7, 6, 8];
const FEATURE_TOTAL = [4, 5, 4, 6, 7, 5, 6, 8, 7, 6, 9, 8, 7, 9, 8, 10];

/** The product mock. `live` is off for the decorative CTA shot. */
function Tablet({ live = false }: { live?: boolean }) {
  return (
    <div className="tablet">
      <ScaleFrame width={1034} height={734}>
        <DashboardApp screen="overview" live={live} />
      </ScaleFrame>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />

      <main id="main">
        {/* ------------------------------------------------------- hero -- */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-top-line" aria-hidden />
          <Ribbon className="ribbon left" />
          <Ribbon className="ribbon right" flip />
          <div className="wrap">
            <div className="rise">
              <h1 className="h1" id="hero-title">
                Operate Your Whole Company
                <br />
                From One Clear Command Center
              </h1>
            </div>
            <div className="rise" style={{ ["--delay" as string]: "80ms" }}>
              <p className="lead">
                Projects, people, payroll, sales, quality and clients. Sixteen role-based portals working from
                one live workspace.
              </p>
            </div>
            <div className="rise hero-cta" style={{ ["--delay" as string]: "160ms" }}>
              <a className="btn btn-blue" href="#contact">
                Request access <ArrowRight size={16} aria-hidden />
              </a>
              <a className="btn btn-gray" href="#portals">
                Explore portals
              </a>
            </div>
            <div className="rise hero-trust" style={{ ["--delay" as string]: "220ms" }}>
              <span><Check size={14} aria-hidden /> {MODULE_COUNT} modules</span>
              <span><Check size={14} aria-hidden /> 16 portals</span>
              <span><Check size={14} aria-hidden /> Live in real time</span>
            </div>
          </div>
          <div className="rise hero-shot" style={{ ["--delay" as string]: "260ms" }}>
            <Tablet live />
          </div>
        </section>

        {/* --------------------------------------------------- discover -- */}
        <section className="section" aria-labelledby="discover-title">
          <div className="wrap">
            <Reveal className="section-head">
              <h2 className="h2" id="discover-title">
                Discover how OperixCRM keeps every role
                <br />
                moving in the same direction
              </h2>
              <p className="lead">
                Leadership, makers, academy students and clients each get a portal shaped around their work,
                all fed by the same live data. Pick a view to see it change.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <Discover />
            </Reveal>
          </div>
        </section>

        <Vision />

        {/* ---------------------------------------------------- portals -- */}
        <section className="section" id="portals" aria-labelledby="portals-title">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="eyebrow">16 portals, 8 roles</span>
              <h2 className="h2" id="portals-title">
                One login, and everyone lands
                <br />
                in the portal built for them
              </h2>
              <p className="lead">
                From the CEO&apos;s command center to an academy student&apos;s coursework, each portal opens only
                the modules that role needs. Super admins decide the rest.
              </p>
            </Reveal>
            <PortalGrid />
          </div>
        </section>

        {/* --------------------------------------------------- features -- */}
        <section className="section" id="features" aria-labelledby="features-title" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal className="section-head">
              <h2 className="h2 sm" id="features-title">
                Explore the features that transform
                <br />
                how your company runs every day
              </h2>
            </Reveal>
            <div className="bento">
              <Reveal className="card card-wide">
                <div className="copy">
                  <h3>See the Whole Company in One Live Summary</h3>
                  <p>
                    Delivery, payroll and pipeline roll up into dashboards that update the moment work changes.
                    Spot a slipping project before the client does.
                  </p>
                </div>
                <div className="feature-dots">
                  <div className="float-tip" aria-hidden>
                    <span>Closed</span>
                    <b>70,901</b>
                    <span>Planned</span>
                    <b>92,921</b>
                  </div>
                  <DotMatrix lit={FEATURE_LIT} total={FEATURE_TOTAL} size={16} pitch={19} label="Tasks closed per month" />
                  <div className="months" aria-hidden>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </Reveal>
              <Reveal className="card" delay={80}>
                <div className="card-viz">
                  <Gauge active={15} value="8,214" label="Items signed off" animate />
                </div>
                <div className="gauge-legend" aria-hidden>
                  <span><i style={{ background: "#4a80e8" }} />Approved</span>
                  <span><i style={{ background: "#e6eafa" }} />Sent back</span>
                  <span><i style={{ background: "#e3e3e8" }} />Pending</span>
                </div>
                <h3>Quality Checks That Score Every Delivery</h3>
                <p>
                  QC and QA teams review finished work against checklists, score it, and sign it off or send it
                  back with notes the developer sees instantly.
                </p>
              </Reveal>
              <Reveal className="card" delay={160}>
                <div className="card-viz">
                  <Bars
                    label="Top three teams by tasks delivered"
                    data={[
                      { value: 146, label: "Platform" },
                      { value: 109, label: "Web" },
                      { value: 75, label: "Video" },
                    ]}
                  />
                </div>
                <h3>Lead the Way with Leaderboards That Reward Real Work</h3>
                <p>
                  KRA events, daily reports rated out of five and delivery throughput feed team and personal
                  leaderboards that keep performance visible and fair.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- KRA -- */}
        <section className="section kra-section" aria-labelledby="kra-title">
          <div className="wrap">
            <KraProof />
          </div>
        </section>

        {/* -------------------------------------------- module showcase -- */}
        <section className="section modules" id="modules" aria-labelledby="modules-title">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="eyebrow">{MODULE_COUNT} modules included</span>
              <h2 className="h2" id="modules-title">
                Different portal entries
                <br />
                according to your roles
              </h2>
              <p className="lead">
                Every module from the first Jadvix CRM, rebuilt on a faster foundation and switched on per
                portal. Pick one to open its real screen.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <ModuleShowcase />
            </Reveal>

            <div className="platform-strip">
              <Reveal>
                <b><KeyRound size={16} aria-hidden /> Module access</b>
                Super admins grant or withhold modules per portal, with a safe baseline every role keeps.
              </Reveal>
              <Reveal delay={60}>
                <b><Radio size={16} aria-hidden /> Real-time presence</b>
                Live updates and presence over websockets, so nobody works from a stale screen.
              </Reveal>
              <Reveal delay={120}>
                <b><Building2 size={16} aria-hidden /> Multi-company</b>
                Run several companies and branches from one tenant, each with its own roster.
              </Reveal>
              <Reveal delay={180}>
                <b><ShieldCheck size={16} aria-hidden /> Secure by design</b>
                Role-checked APIs, rotating refresh tokens and invite-only onboarding.
              </Reveal>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- unlock -- */}
        <section className="section unlock" aria-labelledby="unlock-title">
          <div className="wrap">
            <div className="cloud">
              <div className="cloud-aura" aria-hidden />
              <div className="wg" style={{ left: "37%", top: 0, width: 240, ["--d" as string]: "0s" }}>
                <h4>Recent Activity <ArrowUpRight size={14} aria-hidden /></h4>
                <div className="wg-row">
                  <i style={{ background: "linear-gradient(#7b5cf0,#a99bf5)" }}><ArrowUp size={13} aria-hidden /></i>
                  <div><b>Task approved by QC</b><br />Northwind portal, 4.6 / 5</div>
                  <span className="amt">2m ago</span>
                </div>
                <div className="wg-row">
                  <i style={{ background: "linear-gradient(#35d0b0,#2fa6e2)" }}><ArrowDown size={13} aria-hidden /></i>
                  <div><b>Invoice settled</b><br />Lumen Health</div>
                  <span className="amt">£12,400</span>
                </div>
              </div>
              <div className="wg" style={{ left: "1%", top: 70, width: 250, ["--ry" as string]: "20deg", ["--rz" as string]: "-5deg", ["--d" as string]: "-1.5s" }}>
                <h4>Payroll This Month <MoreHorizontal size={14} aria-hidden /></h4>
                <div className="n">£84,317</div>
                <div className="wg-meter" />
                <div className="wg-legend">
                  <span><i style={{ background: "#4a80e8" }} />Paid</span>
                  <span><i style={{ background: "#a79bf6" }} />Scheduled</span>
                  <span><i style={{ background: "#e3ebfc" }} />Budget</span>
                </div>
              </div>
              <div className="wg" style={{ right: "1%", top: 70, width: 250, ["--ry" as string]: "-20deg", ["--rz" as string]: "5deg", ["--d" as string]: "-3s" }}>
                <h4>KRA This Month <Target size={14} aria-hidden /></h4>
                <Gauge active={18} value="94" label="Team average" />
                <span className="pos up">+6 pts</span> earned since October
              </div>
              <div className="wg" style={{ left: 0, top: 360, width: 250, ["--ry" as string]: "20deg", ["--rz" as string]: "-5deg", ["--d" as string]: "-4.5s" }}>
                <h4>Hours Logged <Clock3 size={14} aria-hidden /></h4>
                <div style={{ height: 110, marginTop: 10, display: "flex", alignItems: "flex-end" }}>
                  <DotMatrix lit={[1, 2, 3, 2, 4, 3, 5, 4, 3, 5, 4, 6]} total={[3, 4, 5, 4, 6, 5, 7, 6, 5, 7, 6, 7]} size={10} pitch={12} label="Hours logged per week" />
                </div>
              </div>
              <div className="wg" style={{ left: "37%", top: 440, width: 250, ["--d" as string]: "-2s" }}>
                <h4>Top 3 Teams <MoreHorizontal size={14} aria-hidden /></h4>
                <div style={{ height: 140, marginTop: 12 }}>
                  <Bars
                    label="Top three teams"
                    data={[
                      { value: 146, label: "Platform" },
                      { value: 109, label: "Web" },
                      { value: 75, label: "Video" },
                    ]}
                  />
                </div>
              </div>
              <div className="wg" style={{ right: "1%", top: 380, width: 250, ["--ry" as string]: "-20deg", ["--rz" as string]: "4deg", ["--d" as string]: "-5.5s" }}>
                <h4>Average Time Worked <MoreHorizontal size={14} aria-hidden /></h4>
                <div className="n">6:39:32</div>
                <Sparkline className="spark" />
                <span className="pos">+0.4%</span> Than yesterday
              </div>
              <Reveal className="cloud-center">
                <h2 className="h2" id="unlock-title">
                  Unlock the Full Potential of Your Company with OperixCRM
                </h2>
                <p className="lead">
                  Join the teams at Jadvix who moved their projects, people and clients off scattered
                  spreadsheets and onto one workspace.
                </p>
                <a className="btn btn-blue" href="#contact">
                  Request access <ArrowRight size={16} aria-hidden />
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------- testimonials -- */}
        <section className="section" id="customers" aria-labelledby="quotes-title">
          <div className="wrap">
            <Reveal className="section-head">
              <h2 className="h2 sm" id="quotes-title">
                What our teams are saying
                <br />
                about working in OperixCRM
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <Testimonials />
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------- cta -- */}
        <section className="cta" id="contact" aria-labelledby="cta-title">
          <Ribbon shape="cta" className="ribbon left" />
          <Ribbon shape="cta" className="ribbon right" flip />
          <div className="wrap">
            <Reveal>
              <h2 className="h2 sm" id="cta-title">
                Don&apos;t miss the chance to move
                <br />
                your whole company onto one workspace.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <a className="btn btn-blue" href={DEMO_MAILTO}>
                Request a demo <ArrowRight size={16} aria-hidden />
              </a>
            </Reveal>
          </div>
          <div className="cta-shot" aria-hidden>
            <Tablet />
          </div>
          <div className="cta-fade" aria-hidden />
        </section>
      </main>

      <footer className="wrap footer">
        <div className="footer-brand">
          <Logo size={24} />
          <p>Run your projects, people and clients effortlessly, and see the results in real time.</p>
          <div className="footer-by">
            A product of
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG wordmark */}
            <img src="/jadvix-logo.svg" alt="Jadvix" />
          </div>
          <small>Copyright © 2026 Jadvix LTD. All rights reserved.</small>
        </div>
        <div className="footer-spacer" />
        {FOOTER_COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2>{c.title}</h2>
            <ul>
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </footer>
    </>
  );
}
