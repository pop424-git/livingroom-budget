"use client";

import { useState } from "react";
import { addCategory } from "@/app/actions";
import { Icon } from "@/components/icons";
import {
  SubmitButton,
  fieldClass,
  ghostButtonClass,
  labelClass,
  primaryButtonClass,
} from "@/components/ui";

export function AddCategoryForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line py-3.5 text-sm text-muted transition hover:border-wood hover:bg-surface hover:text-wood"
      >
        <Icon name="plus" />
        เพิ่มหมวด
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await addCategory(formData);
        setOpen(false);
      }}
      className="space-y-3 rounded-lg border border-line bg-surface p-4 sm:p-5"
    >
      <p className={labelClass}>หมวดใหม่</p>
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
