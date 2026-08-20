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
  "rounded-md px-2.5 py-1 text-xs text-muted transition hover:bg-line-soft hover:text-ink";

export const primaryButtonClass =
  "rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/85";
