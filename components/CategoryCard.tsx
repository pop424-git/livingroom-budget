"use client";

import { useEffect, useRef, useState } from "react";
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

/** How long the title has to be held before the editor opens. */
const HOLD_MS = 3000;

export function CategoryCard({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [holding, setHolding] = useState(false);

  // A press on the title expands; holding it for HOLD_MS opens the editor
  // instead. The ref tells the click that follows a completed hold to stay out
  // of the way, since pointerup fires a click either way.
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const held = useRef(false);

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setHolding(false);
  };

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  const startHold = () => {
    held.current = false;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      held.current = true;
      cancelHold();
      setEditing(true);
    }, HOLD_MS);
  };

  const onTitleClick = () => {
    if (held.current) {
      held.current = false;
      return;
    }
    setOpen(!open);
  };

  const total = categoryTotal(category);
  const priced = category.items.filter((item) => item.amount_min > 0).length;
  const off = !category.is_included;

  return (
    <section
      className={`overflow-hidden rounded-xl border border-line bg-surface transition ${
        off ? "border-dashed" : ""
      }`}
    >
      <header
        className={`relative bg-band px-4 py-3 sm:px-5 ${
          open ? "border-b border-line" : ""
        } ${off ? "opacity-50" : ""}`}
      >
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
              className="-mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg text-4xl leading-none text-muted transition hover:bg-surface hover:text-ink"
              title={open ? "ย่อ" : "ขยาย"}
              aria-expanded={open}
            >
              {open ? "▾" : "▸"}
            </button>

            <button
              type="button"
              onClick={onTitleClick}
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              onContextMenu={(event) => event.preventDefault()}
              className="min-w-0 flex-1 select-none text-left"
              aria-expanded={open}
              title="กดเพื่อกาง/ย่อ · กดค้าง 3 วินาทีเพื่อแก้ชื่อหมวด"
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

            <span className="tnum shrink-0 text-base text-ink">
              {formatRange(total)}
            </span>
          </div>
        )}

        {!editing && (
          <div className="flex items-center justify-end gap-0.5">
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
                className={`inline-flex min-h-8 items-center rounded-md px-2.5 py-1 text-xs transition ${
                  category.is_included
                    ? "text-muted hover:bg-line-soft hover:text-ink"
                    : "bg-wood-soft text-clay"
                }`}
              >
                {category.is_included ? "นับรวม" : "ไม่นับ"}
              </SubmitButton>
            </form>
          </div>
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
        >
          <span
            className="block h-full bg-wood transition-[width] ease-linear"
            style={{
              width: holding ? "100%" : 0,
              transitionDuration: holding ? `${HOLD_MS}ms` : "150ms",
            }}
          />
        </span>
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
