import {
  ZERO,
  addRange,
  categoryTotal,
  formatRange,
  grandTotal,
  itemRange,
  type Category,
} from "@/lib/types";

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

  return (
    <div className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="text-xs tracking-wide text-muted">ยอดรวมที่นับ</p>
            <p className="tnum mt-0.5 text-2xl leading-tight font-medium text-ink sm:text-3xl">
              {formatRange(total)}
              <span className="ml-1.5 text-sm font-normal text-muted">บาท</span>
            </p>
          </div>

          <dl className="flex gap-5 text-right">
            <div>
              <dt className="text-xs text-muted">จ่ายแล้ว</dt>
              <dd className="tnum text-sm text-moss">{formatRange(paid)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">ค้างจ่าย</dt>
              <dd className="tnum text-sm text-ink">{formatRange(unpaid)}</dd>
            </div>
            {(excluded.min > 0 || excluded.max > 0) && (
              <div>
                <dt className="text-xs text-muted">ไม่นับรวม</dt>
                <dd className="tnum text-sm text-muted">
                  {formatRange(excluded)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {missingPrice > 0 && (
          <p className="mt-2 text-xs text-clay">
            ยังไม่ใส่ราคา {missingPrice} รายการ — ยอดจริงจะสูงกว่านี้
          </p>
        )}
      </div>
    </div>
  );
}
