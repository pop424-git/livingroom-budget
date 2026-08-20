"use client";

import { useState } from "react";
import { addCategory } from "@/app/actions";
import {
  SubmitButton,
  fieldClass,
  ghostButtonClass,
  primaryButtonClass,
} from "@/components/ui";

export function AddCategoryForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-line py-3 text-sm text-muted transition hover:border-wood hover:text-wood"
      >
        + เพิ่มหมวด
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await addCategory(formData);
        setOpen(false);
      }}
      className="space-y-3 rounded-xl border border-line bg-surface p-4"
    >
      <input
        name="name"
        required
        autoFocus
        placeholder="ชื่อหมวด เช่น งานรั้ว"
        className={fieldClass}
      />
      <div className="flex items-center gap-2">
        <SubmitButton className={primaryButtonClass}>เพิ่มหมวด</SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={ghostButtonClass}
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
