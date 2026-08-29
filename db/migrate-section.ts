/**
 * Follows the dimensioned cross-section of 29 Aug 2026.
 *
 *   npm run db:migrate-section
 *
 * The section settles two things the estimates had been guessing at.
 *
 * The roof is an asymmetric gable, not a lean-to: 38.7° over the deck and
 * 21.8° over the room, ridge 4.00 m above the floor with both eave soffits
 * level at 2.00 m. Measured along the slope that is 3.20 + 5.39 m, so the
 * sheet area goes from ~66 to ~79 sqm.
 *
 * The ceiling is 2.40 m, not 2.8. Lower walls but two gable triangles to add
 * back, which nets out at ~48 sqm instead of ~51.
 *
 * Matched by name, skipping anything deleted through the site. Nothing outside
 * these items is touched. Safe to re-run.
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

/** [category, item] pairs the section changes. */
const targets: [string, string][] = [
  ["งานโครงสร้างเหล็ก", "เสารับชายคาระเบียง 3–4 ต้น"],
  ["งานหลังคา", "เมทัลชีทติดฉนวน PU 25 มม."],
  ["งานหลังคา", "ทางเลือกประหยัด: เมทัลชีทติด PE 5 มม."],
  ["งานผนัง", "แผ่น ISOWALL PU 50 มม."],
  ["งานผนัง", "ทางเลือก: ผนังเบาไฟเบอร์ซีเมนต์ + ใยแก้ว"],
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
