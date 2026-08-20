export type Item = {
  id: number;
  category_id: number;
  name: string;
  detail: string;
  amount_min: number;
  amount_max: number | null;
  is_paid: boolean;
  is_included: boolean;
  sort_order: number;
};

export type Category = {
  id: number;
  name: string;
  note: string;
  is_included: boolean;
  sort_order: number;
  items: Item[];
};

/** A money range. When max is null the item has a single price. */
export type Range = { min: number; max: number };

export function itemRange(item: Item): Range {
  return { min: item.amount_min, max: item.amount_max ?? item.amount_min };
}

export function addRange(a: Range, b: Range): Range {
  return { min: a.min + b.min, max: a.max + b.max };
}

export const ZERO: Range = { min: 0, max: 0 };

/** Only items that are both counted and inside a counted category add up. */
export function categoryTotal(
  category: Category,
  filter: (item: Item) => boolean = () => true
): Range {
  return category.items
    .filter((item) => item.is_included && filter(item))
    .map(itemRange)
    .reduce(addRange, ZERO);
}

export function grandTotal(
  categories: Category[],
  filter: (item: Item) => boolean = () => true
): Range {
  return categories
    .filter((category) => category.is_included)
    .map((category) => categoryTotal(category, filter))
    .reduce(addRange, ZERO);
}

const baht = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 });

export function formatRange(range: Range): string {
  if (range.min === 0 && range.max === 0) return "—";
  if (range.min === range.max) return baht.format(range.min);
  return `${baht.format(range.min)}–${baht.format(range.max)}`;
}

export function formatAmount(value: number): string {
  return baht.format(value);
}
