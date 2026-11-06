"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, RotateCw, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ICON_SIZE, ICON_STROKE, type Tint } from "./tokens";
import { Button } from "./primitives";

/* ----------------------------------------------------------------- card -- */

export function Card({
  children,
  className = "",
  /** Turn padding off when the card holds a table that must reach its edges. */
  flush = false,
  /** Entrance animation index. Staggers a grid without hard-coded delays. */
  index,
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
  index?: number;
}) {
  return (
    <section
      className={`ox-card ${flush ? "is-flush" : ""} ${className}`}
      style={index ? { animationDelay: `${Math.min(index, 8) * 60}ms` } : undefined}
    >
      {children}
    </section>
  );
}

export function CardHead({
  title,
  icon: Icon,
  action,
  sub,
}: {
  title: ReactNode;
  icon?: LucideIcon;
  /** Right-hand slot: a chip, a pill, an icon button. Keep it to one thing. */
  action?: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <header className="ox-card-head">
      <div>
        <h3>
          {Icon && <Icon size={ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />}
          {title}
        </h3>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </header>
  );
}

/**
 * A form container. Cards do not nest, so a long form is a stack of panels
 * separated by hairlines rather than cards inside a card.
 */
export function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="ox-panel">
      <div className="ox-panel-head">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="ox-panel-body">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ feedback -- */

const STRIP_ICON: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const STRIP_TINT: Record<string, Tint> = {
  info: "blue",
  success: "green",
  warning: "orange",
  error: "red",
};

/**
 * The replacement for a toast.
 *
 * It sits at the top of the region that changed and stays until dismissed,
 * so nothing important disappears after four seconds — and nothing covers the
 * page, which is the whole point of the no-popup rule.
 */
export function StatusStrip({
  kind = "info",
  title,
  children,
  onDismiss,
  action,
}: {
  kind?: "info" | "success" | "warning" | "error";
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  action?: ReactNode;
}) {
  const Icon = STRIP_ICON[kind];
  return (
    <div
      className="ox-strip"
      data-tint={STRIP_TINT[kind]}
      role={kind === "error" ? "alert" : "status"}
    >
      <Icon size={ICON_SIZE.md} strokeWidth={ICON_STROKE} aria-hidden />
      <div className="ox-strip-body">
        <b>{title}</b>
        {children && <p>{children}</p>}
      </div>
      {action}
      {onDismiss && (
        <button type="button" className="ox-strip-x" onClick={onDismiss} aria-label="Dismiss">
          <XCircle size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
        </button>
      )}
    </div>
  );
}

/**
 * Nothing here yet — and what to do about it.
 *
 * An empty state without a next action is a dead end, so `action` is part of
 * the contract rather than an afterthought.
 */
export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="ox-empty">
      <span className="ox-empty-ic">
        <Icon size={22} strokeWidth={ICON_STROKE} aria-hidden />
      </span>
      <b>{title}</b>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

/** Something failed. Always offers the retry; never blames the person. */
export function ErrorState({
  title = "That didn't load",
  children,
  onRetry,
}: {
  title?: string;
  children?: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div className="ox-empty is-error" role="alert">
      <span className="ox-empty-ic" data-tint="red">
        <AlertTriangle size={22} strokeWidth={ICON_STROKE} aria-hidden />
      </span>
      <b>{title}</b>
      <p>{children ?? "The server didn't answer. Nothing has been changed."}</p>
      {onRetry && (
        <Button icon={RotateCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- page header -- */

export function PageHeader({
  title,
  sub,
  actions,
  children,
}: {
  title: string;
  sub?: string;
  /** Primary action right, secondary beside it. Never more than three. */
  actions?: ReactNode;
  /** Filter pills or tabs, directly under the title. */
  children?: ReactNode;
}) {
  return (
    <header className="ox-page-head">
      <div className="ox-page-head-row">
        <div>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
        {actions && <div className="ox-page-actions">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
