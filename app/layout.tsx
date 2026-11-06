import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./ui-tokens.css";
import "./ui-components.css";
import "./globals.css";
import "./dashboard.css";
import "./dashboard2.css";
import "./sections.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// The dashboard mock uses Jakarta, as the product UI does.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OperixCRM — One command center for your whole company",
  description:
    "OperixCRM by Jadvix brings projects, people, payroll, sales, quality and clients into fifteen role-based portals on one live workspace.",
  openGraph: {
    title: "OperixCRM by Jadvix",
    description: "Fifteen role-based portals. Twenty-four modules. One live workspace.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
