/*
 * The OperixCRM design system.
 *
 * Lives inside the frontend rather than in a separate package: this folder IS
 * the OperixCRM repository, and one repo with one install is simpler than a
 * workspace. The product UI and the marketing site both import from here.
 *
 * Consumers also need the two stylesheets, imported once in app/layout.tsx:
 *
 *   import "./ui-tokens.css";
 *   import "./ui-components.css";
 *
 * Every token is namespaced --ox-* so it cannot collide with the marketing
 * site's own :root variables, which use some of the same short names.
 */

export * from "./tokens";
export * from "./primitives";
export * from "./surfaces";
export * from "./forms";
export * from "./data";
export * from "./viz";
export * from "./nav";
