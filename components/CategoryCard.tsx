"use client";

import { useEffect, useRef, useState } from "react";
import {
  addItem,
  deleteCategory,
  moveCategory,
  toggleCategoryIncluded,
  updateCategory,
} from "@/app/actions";
import { Icon } from "@/components/icons";
import { ItemRow } from "@/components/ItemRow";
import { categoryTotal, formatRange, type Category } from "@/lib/types";
import {
  ConfirmButton,
  SubmitButton,
  amountFieldClass,
  dangerButtonClass,
  fieldClass,
  ghostButtonClass,
  iconButtonClass,
  labelClass,
  primaryButtonClass,
} from "@/components/ui";

/** How long the title has to be held before the editor opens. */
const HOLD_MS = 3000;

export function CategoryCard({
  category,
  index,
  share,
}: {
  category: Category;
  /** Position in the list, shown as the section number. */
  index: number;
  /** This category's part of the grand total, 0–1. */
  share: number;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [holding, setHolding] = useState(false);

  // A press on the header expands; holding it for HOLD_MS opens the editor
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

  const onHeaderClick = () => {
    if (held.current) {
      held.current = false;
      return;
    }
    setOpen(!open);
  };

  const total = categoryTotal(category);
  const unpriced = category.items.filter((item) => item.amount_min === 0).length;
  const paid = category.items.filter((item) => item.is_paid).length;
  const off = !category.is_included;
  const number = String(index + 1).padStart(2, "0");

  return (
    <section
      className={`rounded-lg border bg-surface transition ${
        off ? "border-dashed border-line" : "border-line"
      } ${open ? "shadow-[0_1px_0_var(--color-line),0_8px_24px_-16px_rgb(42_38_34/0.25)]" : ""}`}
    >
      <header className="relative">
        {editing ? (
          <form
            action={async (formData) => {
              await updateCategory(formData);
              setEditing(false);
            }}
            className="space-y-3 px-4 py-4 sm:px-5"
          >
            <p className={labelClass}>แก้หมวด {number}</p>
            <input type="hidden" name="id" value={category.id} />
            <input
              name="name"
              defaultValue={category.name}
              required
              autoFocus
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
          <button
            type="button"
            onClick={onHeaderClick}
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(event) => event.preventDefault()}
            aria-expanded={open}
            title="กดเพื่อกาง/ย่อ · กดค้าง 3 วินาทีเพื่อแก้ชื่อหมวด"
            className={`group flex w-full select-none items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 ${
              off ? "opacity-55" : ""
            }`}
          >
            <span className="tnum mt-0.5 w-6 shrink-0 font-mono text-xs text-wood">
              {number}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="font-serif text-[1.05rem] leading-snug text-ink">
                  {category.name}
                </h2>
                {off && (
                  <span className="rounded-sm bg-wood-soft px-1.5 py-px text-[11px] text-clay">
                    ไม่นับรวม
                  </span>
                )}
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                {category.items.length} รายการ
                {paid > 0 && <> · จ่ายแล้ว {paid}</>}
                {unpriced > 0 && (
                  <span className="text-clay/90"> · ยังไม่มีราคา {unpriced}</span>
                )}
              </span>
              {category.note && (
                <span className="mt-1 block text-xs leading-5 text-muted/90">
                  {category.note}
                </span>
              )}
            </span>

            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className="tnum text-[0.95rem] text-ink">
                {formatRange(total)}
              </span>
              {!off && share > 0 && (
                <span className="flex items-center gap-1.5" title="สัดส่วนจากยอดรวม">
                  <span className="h-1 w-12 overflow-hidden rounded-full bg-line-soft">
                    <span
                      className="block h-full bg-wood/70"
                      style={{ width: `${Math.max(share * 100, 4)}%` }}
                    />
                  </span>
                  <span className="tnum w-7 text-right font-mono text-[10px] text-muted">
                    {Math.round(share * 100)}%
                  </span>
                </span>
              )}
            </span>

            <Icon
              name="chevron"
              className={`mt-0.5 size-5 shrink-0 text-muted transition group-hover:text-ink ${
                open ? "rotate-90" : ""
              }`}
            />
          </button>
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
          <ul className="border-t border-line">
            {category.items.map((item) => (
              <ItemRow key={item.id} item={item} muted={off} />
            ))}
            {category.items.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-muted sm:px-5">
                ยังไม่มีรายการในหมวดนี้
              </li>
            )}
          </ul>

          {adding ? (
            <form
              action={async (formData) => {
                await addItem(formData);
                setAdding(false);
              }}
              className="space-y-3 border-t border-line-soft bg-wood-soft/30 px-4 py-4 sm:px-5"
            >
              <p className={labelClass}>รายการใหม่</p>
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
                  className={amountFieldClass}
                />
                <span className="text-sm text-muted">ถึง</span>
                <input
                  name="amount_max"
                  inputMode="decimal"
                  placeholder="(ว่างได้)"
                  className={amountFieldClass}
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
            <div className="flex flex-wrap items-center gap-1 border-t border-line-soft px-2 py-1.5 sm:px-3">
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-wood transition hover:bg-wood-soft/60 hover:text-ink"
              >
                <Icon name="plus" />
                เพิ่มรายการ
              </button>

              <span className="flex-1" />

              <button
                type="button"
                onClick={() => setEditing(true)}
                title="แก้ชื่อ / หมายเหตุหมวด"
                className={iconButtonClass}
              >
                <Icon name="pencil" />
              </button>
              <form action={moveCategory}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="up" />
                <SubmitButton title="เลื่อนหมวดขึ้น" className={iconButtonClass}>
                  <Icon name="up" />
                </SubmitButton>
              </form>
              <form action={moveCategory}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="down" />
                <SubmitButton title="เลื่อนหมวดลง" className={iconButtonClass}>
                  <Icon name="down" />
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
                  className={`${ghostButtonClass} ${
                    category.is_included ? "" : "bg-wood-soft text-clay"
                  }`}
                >
                  {category.is_included ? "นับรวม" : "ไม่นับ"}
                </SubmitButton>
              </form>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <ConfirmButton
                  message={`ลบหมวด "${category.name}" และรายการข้างในทั้งหมด ${category.items.length} รายการ ออกถาวร?`}
                  title="ลบหมวด"
                  className={dangerButtonClass}
                >
                  <Icon name="trash" />
                </ConfirmButton>
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
}
