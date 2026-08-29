/**
 * Settles the wall on fibre cement over ISOWALL (29 Aug 2026).
 *
 *   npm run db:migrate-lightwall
 *
 * The choice was already made in the site — the ISOWALL and U-track rows were
 * deleted and the remaining row renamed — so this only fills in the price and
 * the breakdown behind it: 48 sqm at 8,400 studwork + 43,400 board and glass
 * wool + 7,400 paint, scaled from the original figures that assumed 52 sqm.
 *
 * Fibre cement wins here on sound: STC 40–45 against 25–30 for foam-cored
 * panel, and this room is for sleeping through the afternoon. The cost is a
 * fortnight more on site and joints that need a good plasterer.
 *
 * Only the wall row is touched, matched by name. Safe to re-run.
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

const CATEGORY = "งานผนัง";
const ITEM = "ผนังเบาไฟเบอร์ซีเมนต์ + ใยแก้ว";

async function main() {
  const category = seed.find((entry) => entry.name === CATEGORY);
  const item = category?.items.find((entry) => entry.name === ITEM);
  if (!item) throw new Error(`no seed item ${CATEGORY} / ${ITEM}`);

  const rows = await sql`
    update items
    set detail = ${item.detail ?? ""},
        amount_min = ${item.min ?? 0},
        amount_max = ${item.max ?? null},
        updated_at = now()
    where name = ${ITEM}
      and category_id = (select id from categories where name = ${CATEGORY})
    returning id`;

  if (rows.length === 0) {
    console.log(`! "${ITEM}" is not in the database — nothing changed`);
    return;
  }
  console.log(`updated: ${ITEM} → ${(item.min ?? 0).toLocaleString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
