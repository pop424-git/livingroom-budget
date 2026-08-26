/**
 * Deepens the engawa from 1.5 m to 2 m (Aug 2026).
 *
 *   npm run db:migrate-veranda
 *
 * The veranda depth drags three other numbers with it. The eave has to reach
 * past the decking to keep rain off it — depth plus 0.3–0.5 m — so it grows
 * from 2.0 to 2.4 m. That widens the roof from ~62 to ~66 sqm, which moves the
 * metal sheet price with it. And the raised floor now carries 16 sqm of deck
 * instead of 12.
 *
 * Only these items are touched, matched by name and read from seed-data.ts so
 * the two stay in step. Items already deleted through the site are skipped
 * rather than recreated. Prices and paid flags on everything else are left
 * alone. Safe to re-run.
 */
import { neon } from "@neondatabase/serverless";
import { seed } from "./seed-data.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Copy .env.local.example to .env.local and paste the Neon connection string."
  );
  process.exit(1);
}

const sql = neon(url);

/** [category, item] pairs to refresh from the seed. */
const targets: [string, string][] = [
  ["งานโครงสร้างเหล็ก", "เสารับชายคาระเบียง 3–4 ต้น"],
  ["งานหลังคา", "เมทัลชีทติดฉนวน PU 25 มม."],
  ["งานหลังคา", "ทางเลือกประหยัด: เมทัลชีทติด PE 5 มม."],
  ["งานพื้น", "โครงพื้นยกระดับ + แผ่นพื้น"],
];

function seedItem(categoryName: string, itemName: string) {
  const category = seed.find((entry) => entry.name === categoryName);
  const item = category?.items.find((entry) => entry.name === itemName);
  if (!item) throw new Error(`no seed item ${categoryName} / ${itemName}`);
  return item;
}

async function main() {
  let updated = 0;
  let skipped = 0;

  for (const [categoryName, itemName] of targets) {
    const item = seedItem(categoryName, itemName);
    const rows = await sql`
      update items
      set detail = ${item.detail ?? ""},
          amount_min = ${item.min ?? 0},
          amount_max = ${item.max ?? null},
          updated_at = now()
      where name = ${itemName}
        and category_id = (select id from categories where name = ${categoryName})
      returning id`;

    if (rows.length > 0) {
      updated += 1;
      console.log(`updated: ${itemName}`);
    } else {
      skipped += 1;
      console.log(`skipped (not in database): ${itemName}`);
    }
  }

  console.log(`done — ${updated} item(s) updated, ${skipped} skipped`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
