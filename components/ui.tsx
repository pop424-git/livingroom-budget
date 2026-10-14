"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      disabled={pending}
      className={`disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/** Destructive submit that asks first — nothing here is undoable. */
export function ConfirmButton({
  children,
  message,
  className = "",
  title,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      disabled={pending}
      onClick={(event) => {
        if (!confirm(message)) event.preventDefault();
      }}
      className={`disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export const fieldClass =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none " +
  "placeholder:text-muted/60 focus:border-wood focus:ring-2 focus:ring-wood/20";

export const ghostButtonClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs " +
  "text-muted transition hover:bg-line-soft hover:text-ink";

/** Square icon-only button; pair with a title for the tooltip. */
export const iconButtonClass =
  "inline-flex size-9 items-center justify-center rounded-md text-muted transition " +
  "hover:bg-line-soft hover:text-ink";

export const dangerButtonClass =
  "inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted " +
  "transition hover:bg-clay/10 hover:text-clay";

export const primaryButtonClass =
  "rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/85";

/** Small field label. Thai has no use for letter-spacing, so none here. */
export const labelClass = "text-xs text-muted";

/** Latin-only annotation in the mono face, like the notes on a plan. */
export const monoLabelClass =
  "font-mono text-[0.75rem] uppercase tracking-[0.12em] text-muted";

/** Short number fields; max-w because fieldClass sets w-full. */
export const amountFieldClass = `${fieldClass} tnum max-w-36`;
