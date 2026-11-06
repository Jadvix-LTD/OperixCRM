import { MODULES, moduleForPath } from "@/lib/access/modules";
import type { Crumb } from "@/components/ui";

/** Path segments that are section headings rather than pages of their own. */
const SECTION_FOR_SEGMENT: Record<string, string> = {
  overview: "Overview",
  comms: "Communication",
  scrum: "Scrum",
  people: "People",
  finance: "Finance",
  org: "Organisation",
  system: "System",
};

/**
 * Turns `/people/employees/JDX-042/edit` into a trail of real links.
 *
 * Every crumb points at a page that genuinely exists — a section crumb
 * resolves to its first module rather than being a dead label.
 */
export function crumbsFor(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const out: Crumb[] = [];
  const [section, ...rest] = segments;

  const sectionLabel = SECTION_FOR_SEGMENT[section];
  if (sectionLabel) {
    const first = MODULES.find((m) => m.group === sectionLabel);
    out.push({ label: sectionLabel, href: first?.href });
  }

  const mod = moduleForPath(pathname);
  if (mod) out.push({ label: mod.label, href: mod.href });

  // Anything past the module is a record id or a verb: /new, /edit, /archive.
  const tail = mod ? pathname.slice(mod.href.length).split("/").filter(Boolean) : rest;
  let href = mod?.href ?? `/${section}`;
  for (const t of tail) {
    href += `/${t}`;
    out.push({ label: t.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()), href });
  }

  return out;
}
