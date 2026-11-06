/*
 * The rule that keeps the design system honest.
 *
 * A colour, a radius or an easing curve written straight into a component is
 * how two products that started identical end up looking like cousins. This
 * fails the build instead.
 *
 * Exempt: the token files themselves, and the chart modules, which compute
 * colour ramps numerically (a gradient across 31 gauge ticks cannot be
 * expressed as seven tokens).
 */

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const RADIUS = /border-radius:\s*\d/;
const EASING = /cubic-bezier\(/;

/*
 * Exempt: the token files themselves; the design system's viz module and the
 * marketing site's charts, both of which compute colour ramps numerically (a
 * gradient across 31 gauge ticks cannot be expressed as seven tokens); and
 * the marketing pages, which predate the token set and are migrated
 * separately.
 */
const EXEMPT = [
  /tokens\.(css|ts)$/,
  /components\/ui\/viz\.tsx$/,
  /components\/charts\.tsx$/,
  /\.test\.tsx?$/,
];

/** @type {import("eslint").Rule.RuleModule} */
const noRawValues = {
  meta: {
    type: "problem",
    docs: { description: "Use design tokens rather than raw colours, radii or easing curves." },
    schema: [],
    messages: {
      hex: "Raw colour '{{ value }}'. Use a token from @operix/ui — var(--t-blue) and friends.",
      radius: "Raw border-radius. Use var(--r-chip|control|card|panel|pill).",
      easing: "Raw easing curve. There is one: var(--ease).",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (EXEMPT.some((re) => re.test(filename.replace(/\\/g, "/")))) return {};

    const check = (node, raw) => {
      if (typeof raw !== "string") return;
      const hex = raw.match(HEX);
      if (hex) context.report({ node, messageId: "hex", data: { value: hex[0] } });
      if (RADIUS.test(raw)) context.report({ node, messageId: "radius" });
      if (EASING.test(raw)) context.report({ node, messageId: "easing" });
    };

    return {
      Literal(node) {
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};

const plugin = {
  rules: { "no-raw-values": noRawValues },
};

export default plugin;
