/**
 * Copies category notes from db/seed-data.ts onto a live database.
 *
 *   npm run db:sync-notes
 *
 * Notes are descriptive only — quantities, dimensions, reminders — so they can
 * be refreshed without touching items or prices. Matches categories by name
 * and skips any it cannot find. Safe to re-run.
 *
 * It overwrites notes edited through the site, so put the wording in
 * seed-data.ts first if you want to keep it. Categories the seed leaves
 * without a note are skipped entirely rather than blanked — a note typed into
 * the site is the only copy there is. Item names, prices and statuses are
 * never touched.
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

  let blank = 0;

  for (const category of seed) {
    // No note in the seed is not the same as "clear the note".
    if (!category.note) {
      blank += 1;
      continue;
    }
    const note = category.note;
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
    `done — ${changed} note(s) updated, ${blank} left alone (no note in seed), ` +
      `${missing} categor(ies) not in the database`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
