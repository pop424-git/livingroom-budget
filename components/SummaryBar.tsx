"use client";

import { useEffect, useRef, useState } from "react";
import {
  ZERO,
  addRange,
  categoryTotal,
  formatAmount,
  formatRange,
  grandTotal,
  itemRange,
  type Category,
  type Range,
} from "@/lib/types";
import { labelClass } from "@/components/ui";

const mid = (range: Range) => (range.min + range.max) / 2;

/**
 * The totals, drawn like the title block on a construction drawing. Once it
 * scrolls away a slim bar takes its place at the top so the total stays in
 * view while editing far down the list.
 */
export function SummaryBar({ categories }: { categories: Category[] }) {
  const total = grandTotal(categories);
  const paid = grandTotal(categories, (item) => item.is_paid);
  const unpaid = grandTotal(categories, (item) => !item.is_paid);

  // Everything switched off — shown so it is clear what the total leaves out.
  const excluded = categories
    .map((category) =>
      category.is_included
        ? category.items
            .filter((item) => !item.is_included)
            .map(itemRange)
            .reduce(addRange, ZERO)
        : categoryTotal({ ...category, is_included: true })
    )
    .reduce(addRange, ZERO);

  const allItems = categories.flatMap((category) => category.items);
  const missingPrice = allItems.filter((item) => item.amount_min === 0).length;
  const paidCount = allItems.filter((item) => item.is_paid).length;

  // Ranges have no single value, so progress is measured at their midpoints.
  const paidShare = mid(total) > 0 ? Math.min(1, mid(paid) / mid(total)) : 0;

  const blockRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;
    const observer = new IntersectionObserver(([entry]) =>
      setCompact(!entry.isIntersecting)
    );
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        aria-hidden={!compact}
        className={`fixed inset-x-0 top-0 z-20 border-b border-line bg-paper transition duration-200 ${
          compact
            ? "translate-y-0 shadow-[0_6px_16px_-12px_rgb(42_38_34/0.4)]"
            : "pointer-events-none -translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-4 px-4 py-2.5 sm:px-6">
          <span className={labelClass}>ยอดรวมที่นับ</span>
          <span className="tnum font-serif text-lg text-ink">
            {formatRange(total)}
            <span className="ml-1 font-sans text-xs text-muted">บาท</span>
          </span>
        </div>
        <ProgressLine share={paidShare} className="h-0.5" />
      </div>

      <div ref={blockRef} className="border border-ink/80 bg-surface">
        <div className="px-4 pt-4 pb-5 sm:px-6 sm:pt-5">
          <p className={labelClass}>ยอดรวมที่นับ · บาท</p>
          <p className="tnum mt-2 font-serif text-[2.3rem] leading-[1.15] text-ink sm:text-5xl">
            <RangeText range={total} />
          </p>
          {missingPrice > 0 && (
            <p className="mt-3 flex items-center gap-2 text-xs text-clay">
              <span className="size-1.5 rounded-full bg-clay" aria-hidden />
              ยังไม่ใส่ราคา {missingPrice} รายการ — ยอดจริงจะสูงกว่านี้
            </p>
          )}
        </div>

        <div className="border-t border-ink/80 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              จ่ายไปแล้ว{" "}
              <span className="tnum text-ink">
                {Math.round(paidShare * 100)}%
              </span>
            </span>
            <span className="tnum">
              {paidCount}/{allItems.length} รายการ
            </span>
          </div>
          <ProgressLine share={paidShare} className="mt-2 h-1.5" />
        </div>

        <dl className="grid grid-cols-2 border-t border-ink/80 sm:grid-cols-3">
          <Cell label="จ่ายแล้ว" value={formatRange(paid)} tone="text-moss" />
          <Cell
            label="ค้างจ่าย"
            value={formatRange(unpaid)}
            className="border-l border-line"
          />
          <Cell
            label="ไม่นับรวม"
            value={formatRange(excluded)}
            tone="text-muted"
            className="col-span-2 border-t border-line sm:col-span-1 sm:border-t-0 sm:border-l"
          />
        </dl>
      </div>
    </>
  );
}

/** A range on two lines when it has to wrap, breaking after the dash. */
function RangeText({ range }: { range: Range }) {
  if (range.min === range.max || range.min === 0) {
    return <>{formatRange(range)}</>;
  }
  return (
    <>
      <span className="whitespace-nowrap">{formatAmount(range.min)}–</span>
      <wbr />
      <span className="whitespace-nowrap">{formatAmount(range.max)}</span>
    </>
  );
}

function Cell({
  label,
  value,
  tone = "text-ink",
  className = "",
}: {
  label: string;
  value: string;
  tone?: string;
  className?: string;
}) {
  return (
    <div className={`px-4 py-3 sm:px-6 ${className}`}>
      <dt className={labelClass}>{label}</dt>
      <dd className={`tnum mt-1 text-sm ${tone}`}>{value}</dd>
    </div>
  );
}

function ProgressLine({
  share,
  className,
}: {
  share: number;
  className: string;
}) {
  return (
    <div className={`overflow-hidden bg-line-soft ${className}`}>
      <div
        className="h-full bg-moss transition-[width] duration-500"
        style={{ width: `${share * 100}%` }}
      />
    </div>
  );
}
