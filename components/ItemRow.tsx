"use client";

import { useState } from "react";
import {
  deleteItem,
  moveItem,
  toggleItemIncluded,
  toggleItemPaid,
  updateItem,
} from "@/app/actions";
import { Icon } from "@/components/icons";
import { formatRange, itemRange, type Item } from "@/lib/types";
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

export function ItemRow({ item, muted }: { item: Item; muted: boolean }) {
  const [editing, setEditing] = useState(false);
  const dimmed = muted || !item.is_included;

  if (editing) {
    return (
      <li className="border-t border-line-soft bg-wood-soft/30 px-4 py-4 first:border-t-0 sm:px-5">
        <form
          action={async (formData) => {
            await updateItem(formData);
            setEditing(false);
          }}
          className="space-y-3"
        >
          <p className={labelClass}>แก้รายการ</p>
          <input type="hidden" name="id" value={item.id} />
          <input
            name="name"
            defaultValue={item.name}
            required
            autoFocus
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
              className={amountFieldClass}
            />
            <span className="text-sm text-muted">ถึง</span>
            <input
              name="amount_max"
              defaultValue={item.amount_max ?? ""}
              inputMode="decimal"
              placeholder="(ว่างได้)"
              className={amountFieldClass}
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
          </div>
        </form>

        {/* Separate forms: these act straight away, without saving the edit. */}
        <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-line pt-2">
          <form action={moveItem}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="direction" value="up" />
            <SubmitButton title="เลื่อนขึ้น" className={iconButtonClass}>
              <Icon name="up" />
            </SubmitButton>
          </form>
          <form action={moveItem}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="direction" value="down" />
            <SubmitButton title="เลื่อนลง" className={iconButtonClass}>
              <Icon name="down" />
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
              className={`${ghostButtonClass} ${
                item.is_included ? "" : "bg-wood-soft text-clay"
              }`}
            >
              {item.is_included ? "นับรวม" : "ไม่นับ"}
            </SubmitButton>
          </form>
          <span className="flex-1" />
          <form action={deleteItem}>
            <input type="hidden" name="id" value={item.id} />
            <ConfirmButton
              message={`ลบ "${item.name}" ออกถาวร?`}
              className={dangerButtonClass}
            >
              <Icon name="trash" />
              ลบรายการ
            </ConfirmButton>
          </form>
        </div>
      </li>
    );
  }

  return (
    <li className="group flex items-start gap-3 border-t border-line-soft px-4 py-3 first:border-t-0 sm:gap-4 sm:px-5">
      <form action={toggleItemPaid} className="shrink-0">
        <input type="hidden" name="id" value={item.id} />
        <SubmitButton
          title={
            item.is_paid
              ? "จ่ายแล้ว — กดเพื่อยกเลิก"
              : "ยังไม่จ่าย — กดเมื่อจ่ายแล้ว"
          }
          className="-m-2 flex size-10 items-center justify-center"
        >
          <span
            className={`flex size-[22px] items-center justify-center rounded-full border transition ${
              item.is_paid
                ? "border-moss bg-moss text-white"
                : "border-line bg-surface text-transparent hover:border-moss hover:text-moss/50"
            }`}
          >
            <Icon name="check" className="size-3.5" strokeWidth={2.2} />
          </span>
          <span className="sr-only">
            {item.is_paid ? "จ่ายแล้ว" : "ยังไม่จ่าย"}
          </span>
        </SubmitButton>
      </form>

      <button
        type="button"
        onClick={() => setEditing(true)}
        title="กดเพื่อแก้ไข"
        className={`min-w-0 flex-1 text-left transition ${dimmed ? "opacity-50" : ""}`}
      >
        <span className="flex flex-wrap items-center gap-x-2">
          <span className="text-sm leading-6 text-ink decoration-wood/50 underline-offset-4 group-hover:underline">
            {item.name}
          </span>
          {!item.is_included && (
            <span className="rounded-sm bg-wood-soft px-1.5 text-[11px] leading-5 text-clay">
              ไม่นับ
            </span>
          )}
        </span>
        {item.detail && (
          <span className="mt-0.5 block text-xs leading-5 whitespace-pre-line text-muted">
            {item.detail}
          </span>
        )}
      </button>

      <span
        className={`tnum shrink-0 pt-0.5 text-sm ${
          dimmed
            ? "text-muted line-through decoration-muted/50"
            : item.amount_min === 0
              ? "text-muted/60"
              : item.is_paid
                ? "text-moss"
                : "text-ink"
        }`}
      >
        {formatRange(itemRange(item))}
      </span>
    </li>
  );
}
