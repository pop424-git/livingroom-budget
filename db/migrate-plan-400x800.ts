/**
 * Follows the revised floor plan of 26 Aug 2026.
 *
 *   npm run db:migrate-plan
 *
 * The plan now reads 400 × 800 cm with a living room of 32.0 sqm and a toilet
 * of 3.0 sqm (200 × 150), against 27.44 and 2.47 before. Two item details
 * carry those figures, so they are refreshed from seed-data.ts; the category
 * notes come across with db:sync-notes.
 *
 * Matched by name, skipping anything deleted through the site. No prices or
 * paid flags are touched. Safe to re-run.
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

/** [category, item] pairs whose detail text quotes a plan figure. */
const targets: [string, string][] = [
  ["งานพื้น", "โครงพื้นยกระดับ + แผ่นพื้น"],
  ["งานพื้น", "กระเบื้องยางปูพื้น"],
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
    // Detail only: these items carry no price, and any price typed into the
    // site for them belongs to the owner, not the seed.
    const rows = await sql`
      update items
      set detail = ${item.detail ?? ""}, updated_at = now()
      where name = ${itemName}
        and category_id = (select id from categories where name = ${categoryName})
        and detail is distinct from ${item.detail ?? ""}
      returning id`;

    if (rows.length > 0) {
      updated += 1;
      console.log(`updated: ${itemName}`);
    } else {
      skipped += 1;
      console.log(`unchanged or missing: ${itemName}`);
    }
  }

  console.log(`done — ${updated} item(s) updated, ${skipped} left as is`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
