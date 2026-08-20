import { sql } from "@/lib/db";
import type { Category, Item } from "@/lib/types";

/** Postgres returns numeric as a string; the UI wants numbers. */
function toNumber(value: unknown): number {
  return typeof value === "number" ? value : parseFloat(String(value ?? 0)) || 0;
}

function toItem(row: Record<string, unknown>): Item {
  return {
    id: Number(row.id),
    category_id: Number(row.category_id),
    name: String(row.name),
    detail: String(row.detail ?? ""),
    amount_min: toNumber(row.amount_min),
    amount_max: row.amount_max === null ? null : toNumber(row.amount_max),
    is_paid: Boolean(row.is_paid),
    is_included: Boolean(row.is_included),
    sort_order: Number(row.sort_order),
  };
}

export async function getCategories(): Promise<Category[]> {
  const [categoryRows, itemRows] = await Promise.all([
    sql`select id, name, note, is_included, sort_order
        from categories
        order by sort_order, id` as Promise<Record<string, unknown>[]>,
    sql`select id, category_id, name, detail, amount_min, amount_max,
               is_paid, is_included, sort_order
        from items
        order by sort_order, id` as Promise<Record<string, unknown>[]>,
  ]);

  const itemsByCategory = new Map<number, Item[]>();
  for (const row of itemRows) {
    const item = toItem(row);
    const bucket = itemsByCategory.get(item.category_id);
    if (bucket) bucket.push(item);
    else itemsByCategory.set(item.category_id, [item]);
  }

  return categoryRows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    note: String(row.note ?? ""),
    is_included: Boolean(row.is_included),
    sort_order: Number(row.sort_order),
    items: itemsByCategory.get(Number(row.id)) ?? [],
  }));
}
