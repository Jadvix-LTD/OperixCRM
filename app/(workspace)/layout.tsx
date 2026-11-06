import type { Metadata } from "next";
import "../shell.css";
import { Shell } from "@/components/shell/Shell";

/*
 * Everything under this route group gets the workspace shell. The marketing
 * pages sit outside it and keep the plain root layout, which is why this is a
 * route group — it adds a layout without adding a path segment.
 */

export const metadata: Metadata = {
  title: "OperixCRM",
  description: "One workspace for Jadvix LTD and Jadvix Academy.",
};

export default function WorkspaceLayout({ children }: LayoutProps<"/">) {
  return <Shell>{children}</Shell>;
}
