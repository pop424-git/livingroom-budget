/**
 * Creates the tables and loads the starting data.
 *
 *   npm run db:setup            create tables, seed only when empty
 *   npm run db:setup -- --force wipe both tables first, then seed
 *
 * --force deletes every price entered through the site. To change one category
 * on a live database, write a migration instead (see db/migrate-solar.ts).
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
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
const force = process.argv.includes("--force");

async function main() {
  const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  for (const statement of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
    await sql.query(statement);
  }
  console.log("tables ready");

  if (force) {
    await sql`delete from items`;
    await sql`delete from categories`;
    console.log("existing rows cleared");
  } else {
    const existing = await sql`select count(*)::int as count from categories`;
    if (Number(existing[0].count) > 0) {
      console.log(
        `categories already has ${existing[0].count} rows — nothing seeded. Re-run with -- --force to replace.`
      );
      return;
    }
  }

  let categoryOrder = 0;
  for (const category of seed) {
    categoryOrder += 1;
    const inserted = await sql`
      insert into categories (name, note, is_included, sort_order)
      values (${category.name}, ${category.note ?? ""},
              ${category.included ?? true}, ${categoryOrder})
      returning id`;
    const categoryId = Number(inserted[0].id);

    let itemOrder = 0;
    for (const item of category.items) {
      itemOrder += 1;
      await sql`
        insert into items (category_id, name, detail, amount_min, amount_max,
                           is_included, sort_order)
        values (${categoryId}, ${item.name}, ${item.detail ?? ""},
                ${item.min ?? 0}, ${item.max ?? null},
                ${item.included ?? true}, ${itemOrder})`;
    }
  }

  const totals = await sql`
    select (select count(*)::int from categories) as categories,
           (select count(*)::int from items) as items`;
  console.log(
    `seeded ${totals[0].categories} categories / ${totals[0].items} items`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
