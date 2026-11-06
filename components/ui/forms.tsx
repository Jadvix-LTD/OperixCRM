"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Check, ChevronDown, Paperclip, Search, X } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "./tokens";

/* ---------------------------------------------------------------- field -- */

/**
 * The wrapper every control sits in.
 *
 * It owns the label, the hint and the error, and it wires `aria-describedby`
 * and `aria-invalid` so no caller has to remember to. An error replaces the
 * hint rather than stacking under it — two lines of helper text below one
 * input is noise.
 */
export function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (p: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  htmlFor?: string;
}) {
  const auto = useId();
  const id = htmlFor ?? auto;
  const noteId = `${id}-note`;
  const note = error ?? hint;

  return (
    <div className="ox-field" data-invalid={error ? "true" : undefined}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="ox-req" aria-hidden>
            *
          </span>
        )}
      </label>
      {children({ id, describedBy: note ? noteId : undefined, invalid: Boolean(error) })}
      {note && (
        <p className="ox-note" id={noteId} data-error={error ? "true" : undefined}>
          {note}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- input -- */

/*
 * `prefix` is omitted from the native attributes on purpose: HTML already has
 * a `prefix` attribute (RDFa, a string), and leaving it in makes the React
 * node version unassignable.
 */
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  invalid?: boolean;
  /** A unit, a currency or a short label shown inside the control. */
  suffix?: ReactNode;
  prefix?: ReactNode;
};

export function Input({ invalid, suffix, prefix, className = "", ...rest }: InputProps) {
  return (
    <span className={`ox-input-wrap ${className}`} data-invalid={invalid || undefined}>
      {prefix && <span className="ox-affix">{prefix}</span>}
      <input className="ox-input" aria-invalid={invalid || undefined} {...rest} />
      {suffix && <span className="ox-affix">{suffix}</span>}
    </span>
  );
}

export function SearchInput({ className = "", ...rest }: InputProps) {
  return (
    <Input
      type="search"
      prefix={<Search size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />}
      className={className}
      {...rest}
    />
  );
}

export function Textarea({
  invalid,
  className = "",
  rows = 4,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={`ox-input ox-textarea ${className}`}
      rows={rows}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

/* --------------------------------------------------------------- select -- */

export function Select({
  invalid,
  children,
  className = "",
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <span className={`ox-input-wrap is-select ${className}`} data-invalid={invalid || undefined}>
      <select className="ox-input" aria-invalid={invalid || undefined} {...rest}>
        {children}
      </select>
      <ChevronDown className="ox-select-caret" size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
    </span>
  );
}

/* ------------------------------------------------------------- combobox -- */

export type ComboOption = { value: string; label: string; hint?: string };

/**
 * Type-to-filter picker, used wherever the old CRM would have opened a modal
 * to choose a person, a client or a project. It expands in place — nothing is
 * ever layered over the page.
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Search…",
  id,
  describedBy,
  invalid,
  emptyLabel = "Nothing matches",
}: {
  options: ComboOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  id?: string;
  describedBy?: string;
  invalid?: boolean;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value) ?? null;
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q));
  }, [options, query]);

  const commit = (option: ComboOption) => {
    onChange(option.value);
    setQuery("");
    setOpen(false);
  };

  return (
    <div
      className="ox-combo"
      ref={wrap}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <span className="ox-input-wrap" data-invalid={invalid || undefined}>
        <input
          id={id}
          className="ox-input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          placeholder={selected ? selected.label : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => {
                const n = matches.length;
                if (!n) return 0;
                return e.key === "ArrowDown" ? (i + 1) % n : (i - 1 + n) % n;
              });
            } else if (e.key === "Enter" && open && matches[active]) {
              e.preventDefault();
              commit(matches[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {selected && (
          <button
            type="button"
            className="ox-combo-clear"
            aria-label={`Clear ${selected.label}`}
            onClick={() => {
              onChange(null);
              setQuery("");
            }}
          >
            <X size={ICON_SIZE.xs} strokeWidth={ICON_STROKE} aria-hidden />
          </button>
        )}
      </span>

      {open && (
        <ul className="ox-combo-list" id={listId} role="listbox">
          {matches.length === 0 && <li className="ox-combo-empty">{emptyLabel}</li>}
          {matches.map((o, i) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={i === active ? "is-active" : undefined}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(o)}
              >
                <span>
                  <b>{o.label}</b>
                  {o.hint && <small>{o.hint}</small>}
                </span>
                {o.value === value && <Check size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------ choice controls -- */

export function Checkbox({
  label,
  hint,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; hint?: string }) {
  return (
    <label className={`ox-choice ${className}`}>
      <input type="checkbox" {...rest} />
      <span className="ox-box" aria-hidden>
        <Check size={11} strokeWidth={3} />
      </span>
      <span className="ox-choice-copy">
        <b>{label}</b>
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

export function Radio({
  label,
  hint,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; hint?: string }) {
  return (
    <label className={`ox-choice is-radio ${className}`}>
      <input type="radio" {...rest} />
      <span className="ox-box" aria-hidden />
      <span className="ox-choice-copy">
        <b>{label}</b>
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

/** The access-grid switch. On/off state that saves immediately. */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Always required: a bare switch is unreadable to a screen reader. */
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="ox-switch"
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <i aria-hidden />
    </button>
  );
}

/* ------------------------------------------------------- date and file -- */

export function DateField(props: InputProps) {
  return <Input type="date" {...props} />;
}

export function FileField({
  label = "Choose a file",
  hint,
  accept,
  onFiles,
  id,
}: {
  label?: string;
  hint?: string;
  accept?: string;
  onFiles?: (files: FileList) => void;
  id?: string;
}) {
  const [name, setName] = useState<string | null>(null);
  const auto = useId();
  const inputId = id ?? auto;

  return (
    <div className="ox-file">
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="ox-sr"
        onChange={(e) => {
          const files = e.target.files;
          setName(files?.[0]?.name ?? null);
          if (files?.length) onFiles?.(files);
        }}
      />
      <label htmlFor={inputId} className="ox-file-btn">
        <Paperclip size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} aria-hidden />
        {name ?? label}
      </label>
      {hint && <small>{hint}</small>}
    </div>
  );
}

/* --------------------------------------------------------- form layout -- */

/** Two columns on a wide screen, one on a narrow. Nothing else to decide. */
export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="ox-form-grid">{children}</div>;
}

/** Full-width row inside a FormGrid, for a textarea or a long combobox. */
export function FormWide({ children }: { children: ReactNode }) {
  return <div className="ox-form-wide">{children}</div>;
}

/**
 * The action row at the foot of a form page.
 * Sticky, because a long form must never make you scroll to find Save.
 */
export function FormActions({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="ox-form-actions">
      {note && <span className="ox-form-note">{note}</span>}
      <span className="ox-form-buttons">{children}</span>
    </div>
  );
}
