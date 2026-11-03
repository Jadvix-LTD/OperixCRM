type LogoProps = { className?: string; size?: number };

/** Two counter-rotating half rings: the OperixCRM mark. */
export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5h-4.6A4.9 4.9 0 0 0 12 7.1Z" fill="currentColor" />
      <path d="M12 21.5A9.5 9.5 0 0 1 2.5 12h4.6a4.9 4.9 0 0 0 4.9 4.9Z" fill="currentColor" />
      <circle cx="17.2" cy="17.2" r="2.3" fill="#2f63e8" />
    </svg>
  );
}

export function Logo({ className, size = 22 }: LogoProps) {
  return (
    <span className={`logo ${className ?? ""}`}>
      <LogoMark size={size} />
      <span className="logo-word">OperixCRM</span>
    </span>
  );
}
