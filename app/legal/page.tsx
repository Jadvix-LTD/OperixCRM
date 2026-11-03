import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { Logo } from "@/components/Logo";

/*
 * First-draft legal copy for OperixCRM. It has not been reviewed: Jadvix's legal
 * advisor must sign it off before the site is public.
 */

export const metadata: Metadata = {
  title: "Legal — OperixCRM",
  description: "Privacy policy, terms of use, terms of service and disclaimer for OperixCRM by Jadvix Ltd.",
};

const UPDATED = "3 November 2026";

const SECTIONS = [
  {
    id: "privacy",
    title: "Privacy Policy",
    body: [
      "OperixCRM is operated by Jadvix Ltd, 2nd Floor, College House, 17 King Edwards Rd, Ruislip, United Kingdom, HA4 7AE. Jadvix Ltd is the controller of personal data processed through this website and, unless a customer agreement says otherwise, through the OperixCRM application.",
      "This website does not use tracking cookies or third-party analytics, and it collects no personal data unless you contact us. If you email or call us, we use your details only to reply and to arrange access or a demo.",
      "Inside OperixCRM we process the data needed to run the service: account details, role and portal assignments, work records such as tasks, reports, hours and leave, and client and billing records. Access is limited by role, and each portal sees only the modules it has been granted.",
      "We keep personal data only for as long as it is needed for these purposes or required by law. You can ask to see, correct or delete your data, or object to its use, by emailing us. You also have the right to complain to the Information Commissioner's Office (ico.org.uk).",
    ],
  },
  {
    id: "terms-of-use",
    title: "Terms of Use",
    body: [
      "These terms apply to your use of this website. By using it you agree to them.",
      "The content of this site is provided for general information about OperixCRM. You may view and share it, but you may not copy, modify or resell it, or use the OperixCRM or Jadvix names and marks, without our written permission.",
      "You must not misuse the site, including by attempting to gain unauthorised access, interfering with its operation, or introducing malicious code.",
    ],
  },
  {
    id: "terms-of-service",
    title: "Terms of Service",
    body: [
      "Access to the OperixCRM application is by invitation only. Accounts are created by an administrator of your organisation, and you are responsible for keeping your sign-in details secure.",
      "Your organisation's administrators decide which portals and modules you can use. You must use OperixCRM only for your organisation's legitimate business purposes and in line with its policies.",
      "Data you or your organisation enter into OperixCRM remains yours. We process it to provide the service and protect it with role-based access controls and encrypted connections.",
      "Where your organisation has a separate written agreement with Jadvix Ltd, that agreement takes precedence over these terms.",
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    body: [
      "Figures, names and dashboards shown on this website are illustrative and do not represent real customer data.",
      "We aim to keep this site accurate and available, but we provide it as is, without warranties, and we are not liable for any loss arising from reliance on its content, to the extent the law allows.",
      "These terms are governed by the laws of England and Wales.",
    ],
  },
];

export default function LegalPage() {
  return (
    <main className="legal">
      <div className="legal-wrap">
        <Link href="/" className="legal-back">
          <ArrowLeft size={16} aria-hidden /> Back to OperixCRM
        </Link>
        <Logo size={24} />
        <h1 className="h2">Legal</h1>
        <p className="lead">Last updated {UPDATED}.</p>
        <nav className="legal-toc" aria-label="On this page">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
            <h2 id={`${s.id}-title`}>{s.title}</h2>
            {s.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </section>
        ))}
        <section aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p>
            Questions about any of these terms: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, or call{" "}
            <a href={CONTACT.phoneUK.href}>{CONTACT.phoneUK.label}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
