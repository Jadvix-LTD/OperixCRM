"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties, type PointerEventHandler } from "react";

/** Fades children up the first time they scroll into view. */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  style,
  children,
  onPointerMove,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onPointerMove?: PointerEventHandler<HTMLElement>;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={{ ...style, ["--delay" as string]: `${delay}ms` }}
      onPointerMove={onPointerMove}
    >
      {children}
    </Tag>
  );
}
