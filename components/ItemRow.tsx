"use client";

import { useState } from "react";
import {
  deleteItem,
  moveItem,
  toggleItemIncluded,
  toggleItemPaid,
  updateItem,
} from "@/app/actions";
import { formatRange, itemRange, type Item } from "@/lib/types";
import {
  ConfirmButton,
  SubmitButton,
  fieldClass,
  ghostButtonClass,
  primaryButtonClass,
} from "@/components/ui";

export function ItemRow({ item, muted }: { item: Item; muted: boolean }) {
  const [editing, setEditing] = useState(false);
  const dimmed = muted || !item.is_included;

  if (editing) {
    return (
      <li className="border-t border-line-soft bg-wood-soft/25 px-4 py-4 sm:px-5">
        <form
          action={async (formData) => {
            await updateItem(formData);
            setEditing(false);
          }}
          className="space-y-3"
        >
          <input type="hidden" name="id" value={item.id} />
          <input
            name="name"
            defaultValue={item.name}
            required
            placeholder="ชื่อรายการ"
            className={fieldClass}
          />
          <textarea
            name="detail"
            defaultValue={item.detail}
            rows={2}
            placeholder="รายละเอียด เช่น สเปค ปริมาณ ร้านที่เสนอราคา"
            className={fieldClass}
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              name="amount_min"
              defaultValue={item.amount_min || ""}
              inputMode="decimal"
              placeholder="ราคา"
              className={`${fieldClass} tnum w-32`}
            />
            <span className="text-sm text-muted">ถึง</span>
            <input
              name="amount_max"
              defaultValue={item.amount_max ?? ""}
              inputMode="decimal"
              placeholder="(ว่างได้)"
              className={`${fieldClass} tnum w-32`}
            />
            <span className="text-xs text-muted">
              เว้นช่องหลังไว้ถ้าเป็นราคาเดียว
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <SubmitButton className={primaryButtonClass}>บันทึก</SubmitButton>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className={ghostButtonClass}
            >
              ยกเลิก
            </button>
            <span className="flex-1" />
          </div>
        </form>

        <form action={deleteItem} className="mt-2 border-t border-line pt-3">
          <input type="hidden" name="id" value={item.id} />
          <ConfirmButton
            message={`ลบ "${item.name}" ออกถาวร?`}
            className="rounded-md px-2.5 py-1 text-xs text-clay transition hover:bg-clay/10"
          >
            ลบรายการนี้
          </ConfirmButton>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`group border-t border-line-soft px-4 py-3 transition sm:px-5 ${
        dimmed ? "opacity-45" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <form action={toggleItemPaid} className="pt-0.5">
          <input type="hidden" name="id" value={item.id} />
          <SubmitButton
            title={item.is_paid ? "จ่ายแล้ว — กดเพื่อยกเลิก" : "ยังไม่จ่าย — กดเมื่อจ่ายแล้ว"}
            className={`flex size-5 items-center justify-center rounded-full border text-[10px] transition ${
              item.is_paid
                ? "border-moss bg-moss text-white"
                : "border-line bg-surface text-transparent hover:border-moss/60"
            }`}
          >
            ✓
          </SubmitButton>
        </form>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="text-sm leading-6 text-ink group-hover:text-wood">
            {item.name}
          </span>
          {item.detail && (
            <span className="mt-0.5 block text-xs leading-5 whitespace-pre-line text-muted">
              {item.detail}
            </span>
          )}
        </button>

        <div className="shrink-0 text-right">
          <span className="tnum block text-sm text-ink">
            {formatRange(itemRange(item))}
          </span>
          <div className="mt-1 flex items-center justify-end gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <form action={moveItem}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="direction" value="up" />
              <SubmitButton title="เลื่อนขึ้น" className={ghostButtonClass}>
                ↑
              </SubmitButton>
            </form>
            <form action={moveItem}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="direction" value="down" />
              <SubmitButton title="เลื่อนลง" className={ghostButtonClass}>
                ↓
              </SubmitButton>
            </form>
            <form action={toggleItemIncluded}>
              <input type="hidden" name="id" value={item.id} />
              <SubmitButton
                title={
                  item.is_included
                    ? "นับรวมอยู่ — กดเพื่อไม่นับ"
                    : "ไม่ถูกนับ — กดเพื่อนับรวม"
                }
                className={ghostButtonClass}
              >
                {item.is_included ? "นับรวม" : "ไม่นับ"}
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </li>
  );
}
