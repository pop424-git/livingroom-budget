/**
 * Brings a live database in line with the revised solar plan (Aug 2026).
 *
 *   npm run db:migrate-solar
 *
 * What changed: SigenMicro is not sold in Thailand, so the inverter becomes a
 * Deye SUN-M225G4-EU-Q0 — one unit instead of two, and on the PEA approved
 * list. Earthing, surge protection, sealant and the PEA filing fee were
 * missing from the list entirely and are now separate items. A purlin
 * reinforcement item joins the steelwork category, because the panels have to
 * be planned for while the roof is being built, not after.
 *
 * Only the solar category and that one steel item are touched. Every other
 * category, and any price typed into the site, is left alone. Safe to re-run.
 */
import { neon } from "@neondatabase/serverless";
import {
  SOLAR_CATEGORY,
  SOLAR_PURLIN_ITEM,
  STEEL_CATEGORY,
  seed,
} from "./seed-data.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Copy .env.local.example to .env.local and paste the Neon connection string."
  );
  process.exit(1);
}

const sql = neon(url);

function seedCategory(name: string) {
  const found = seed.find((category) => category.name === name);
  if (!found) throw new Error(`no seed category named ${name}`);
  return found;
}

async function replaceSolarCategory() {
  const source = seedCategory(SOLAR_CATEGORY);
  const rows = await sql`
    select id, is_included from categories where name = ${SOLAR_CATEGORY}`;
  if (rows.length === 0) {
    console.log(`! no category named "${SOLAR_CATEGORY}" — skipped`);
    return;
  }

  const categoryId = Number(rows[0].id);
  // Whether the category counts towards the total is the owner's choice, so
  // keep whatever it is set to now rather than resetting it from the seed.
  await sql`update categories set note = ${source.note ?? ""} where id = ${categoryId}`;

  const removed = await sql`
    delete from items where category_id = ${categoryId} returning id`;

  let order = 0;
  for (const item of source.items) {
    order += 1;
    await sql`
      insert into items (category_id, name, detail, amount_min, amount_max,
                         is_included, sort_order)
      values (${categoryId}, ${item.name}, ${item.detail ?? ""},
              ${item.min ?? 0}, ${item.max ?? null},
              ${item.included ?? true}, ${order})`;
  }

  console.log(
    `solar category: ${removed.length} item(s) replaced with ${source.items.length}`
  );
}

async function addPurlinItem() {
  const source = seedCategory(STEEL_CATEGORY).items.find(
    (item) => item.name === SOLAR_PURLIN_ITEM
  );
  if (!source) throw new Error(`no seed item named ${SOLAR_PURLIN_ITEM}`);

  const category = await sql`
    select id from categories where name = ${STEEL_CATEGORY}`;
  if (category.length === 0) {
    console.log(`! no category named "${STEEL_CATEGORY}" — skipped`);
    return;
  }
  const categoryId = Number(category[0].id);

  const existing = await sql`
    select id from items
    where category_id = ${categoryId} and name = ${SOLAR_PURLIN_ITEM}`;
  if (existing.length > 0) {
    console.log("purlin item: already present, left as is");
    return;
  }

  await sql`
    insert into items (category_id, name, detail, amount_min, amount_max, sort_order)
    values (
      ${categoryId}, ${source.name}, ${source.detail ?? ""},
      ${source.min ?? 0}, ${source.max ?? null},
      (select coalesce(max(sort_order), 0) + 1 from items where category_id = ${categoryId})
    )`;
  console.log("purlin item: added to steelwork");
}

async function main() {
  await replaceSolarCategory();
  await addPurlinItem();

  const totals = await sql`
    select (select count(*)::int from categories) as categories,
           (select count(*)::int from items) as items`;
  console.log(
    `done — ${totals[0].categories} categories / ${totals[0].items} items`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
