/**
 * Copies category notes from db/seed-data.ts onto a live database.
 *
 *   npm run db:sync-notes
 *
 * Notes are descriptive only — quantities, dimensions, reminders — so they can
 * be refreshed without touching items or prices. Matches categories by name
 * and skips any it cannot find. Safe to re-run.
 *
 * It does overwrite notes edited through the site, so put the wording in
 * seed-data.ts first if you want to keep it. Item names, prices and statuses
 * are never touched.
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

async function main() {
  let changed = 0;
  let missing = 0;

  for (const category of seed) {
    const note = category.note ?? "";
    const rows = await sql`
      update categories set note = ${note}
      where name = ${category.name} and note is distinct from ${note}
      returning id`;

    if (rows.length > 0) {
      changed += 1;
      console.log(`updated: ${category.name}`);
      continue;
    }

    const exists = await sql`
      select 1 from categories where name = ${category.name}`;
    if (exists.length === 0) {
      missing += 1;
      console.log(`! not found: ${category.name}`);
    }
  }

  console.log(
    `done — ${changed} note(s) updated, ${missing} categor(ies) not in the database`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
