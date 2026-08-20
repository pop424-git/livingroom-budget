"use client";

import { useState } from "react";
import {
  addItem,
  deleteCategory,
  moveCategory,
  toggleCategoryIncluded,
  updateCategory,
} from "@/app/actions";
import { ItemRow } from "@/components/ItemRow";
import { categoryTotal, formatRange, type Category } from "@/lib/types";
import {
  ConfirmButton,
  SubmitButton,
  fieldClass,
  ghostButtonClass,
  primaryButtonClass,
} from "@/components/ui";

export function CategoryCard({ category }: { category: Category }) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  const total = categoryTotal(category);
  const priced = category.items.filter((item) => item.amount_min > 0).length;
  const off = !category.is_included;

  return (
    <section
      className={`overflow-hidden rounded-xl border border-line bg-surface transition ${
        off ? "border-dashed" : ""
      }`}
    >
      <header className={`px-4 py-3 sm:px-5 ${off ? "opacity-50" : ""}`}>
        {editing ? (
          <form
            action={async (formData) => {
              await updateCategory(formData);
              setEditing(false);
            }}
            className="space-y-3"
          >
            <input type="hidden" name="id" value={category.id} />
            <input
              name="name"
              defaultValue={category.name}
              required
              className={fieldClass}
            />
            <input
              name="note"
              defaultValue={category.note}
              placeholder="หมายเหตุหมวด เช่น ปริมาณ ~62 ตร.ม."
              className={fieldClass}
            />
            <div className="flex items-center gap-2">
              <SubmitButton className={primaryButtonClass}>บันทึก</SubmitButton>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={ghostButtonClass}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="mt-1 text-xs text-muted transition hover:text-ink"
              title={open ? "ย่อ" : "ขยาย"}
            >
              {open ? "▾" : "▸"}
            </button>

            <button
              type="button"
              onClick={() => setEditing(true)}
              className="min-w-0 flex-1 text-left"
            >
              <h2 className="text-base font-medium text-ink">{category.name}</h2>
              <p className="mt-0.5 text-xs text-muted">
                {category.items.length} รายการ
                {priced < category.items.length && (
                  <> · ยังไม่ใส่ราคา {category.items.length - priced}</>
                )}
                {category.note && <> · {category.note}</>}
              </p>
            </button>

            <div className="shrink-0 text-right">
              <span className="tnum block text-base text-ink">
                {formatRange(total)}
              </span>
              <div className="mt-1 flex items-center justify-end gap-0.5">
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="direction" value="up" />
                  <SubmitButton title="เลื่อนขึ้น" className={ghostButtonClass}>
                    ↑
                  </SubmitButton>
                </form>
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="direction" value="down" />
                  <SubmitButton title="เลื่อนลง" className={ghostButtonClass}>
                    ↓
                  </SubmitButton>
                </form>
                <form action={toggleCategoryIncluded}>
                  <input type="hidden" name="id" value={category.id} />
                  <SubmitButton
                    title={
                      category.is_included
                        ? "นับรวมอยู่ — กดเพื่อตัดทั้งหมวดออกจากยอด"
                        : "ไม่ถูกนับ — กดเพื่อนับรวม"
                    }
                    className={`rounded-md px-2.5 py-1 text-xs transition ${
                      category.is_included
                        ? "text-muted hover:bg-line-soft hover:text-ink"
                        : "bg-wood-soft text-clay"
                    }`}
                  >
                    {category.is_included ? "นับรวม" : "ไม่นับ"}
                  </SubmitButton>
                </form>
              </div>
            </div>
          </div>
        )}
      </header>

      {open && (
        <>
          <ul>
            {category.items.map((item) => (
              <ItemRow key={item.id} item={item} muted={off} />
            ))}
          </ul>

          <div className="border-t border-line-soft bg-paper/40 px-4 py-3 sm:px-5">
            {adding ? (
              <form
                action={async (formData) => {
                  await addItem(formData);
                  setAdding(false);
                }}
                className="space-y-3"
              >
                <input type="hidden" name="category_id" value={category.id} />
                <input
                  name="name"
                  required
                  autoFocus
                  placeholder="ชื่อรายการ"
                  className={fieldClass}
                />
                <textarea
                  name="detail"
                  rows={2}
                  placeholder="รายละเอียด (ไม่ใส่ก็ได้)"
                  className={fieldClass}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    name="amount_min"
                    inputMode="decimal"
                    placeholder="ราคา"
                    className={`${fieldClass} tnum w-32`}
                  />
                  <span className="text-sm text-muted">ถึง</span>
                  <input
                    name="amount_max"
                    inputMode="decimal"
                    placeholder="(ว่างได้)"
                    className={`${fieldClass} tnum w-32`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <SubmitButton className={primaryButtonClass}>เพิ่ม</SubmitButton>
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className={ghostButtonClass}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="text-sm text-wood transition hover:text-ink"
                >
                  + เพิ่มรายการ
                </button>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <ConfirmButton
                    message={`ลบหมวด "${category.name}" และรายการข้างในทั้งหมด ${category.items.length} รายการ ออกถาวร?`}
                    className="rounded-md px-2.5 py-1 text-xs text-muted transition hover:bg-clay/10 hover:text-clay"
                  >
                    ลบหมวด
                  </ConfirmButton>
                </form>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
