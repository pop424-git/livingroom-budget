/**
 * Rewrites db/seed-data.ts from whatever is in the database right now.
 *
 *   npm run db:dump-seed
 *
 * The site is the source of truth — every price, rename and deletion happens
 * there — so rather than hand-editing the seed to match, regenerate it. Run
 * this whenever the list has settled and you want a fresh database to start
 * from the same place.
 *
 * Reads only. The file it writes is the one db/setup.ts seeds from.
 */
import { neon } from "@neondatabase/serverless";
import { writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Copy .env.local.example to .env.local and paste the Neon connection string."
  );
  process.exit(1);
}

const sql = neon(url);

const HEADER = `/**
 * The starting list of categories and items.
 *
 * Generated from the live database by db/dump-seed.ts — edit the list in the
 * site, then re-run \`npm run db:dump-seed\` rather than editing this by hand.
 * Shared by db/setup.ts and any migration, so the two can never drift apart.
 * Prices are estimate ranges, not quotes; items still waiting on a quote sit
 * at 0.
 */
export type SeedItem = {
  name: string;
  detail?: string;
  min?: number;
  max?: number;
  included?: boolean;
  paid?: boolean;
};

export type SeedCategory = {
  name: string;
  note?: string;
  included?: boolean;
  items: SeedItem[];
};

export const seed: SeedCategory[] = [
`;

/** JSON.stringify escapes quotes and newlines; CRLF from older rows is
    normalised so the file does not carry stray carriage returns. */
function str(value: string): string {
  return JSON.stringify(value.replace(/\r\n?/g, "\n"));
}

function num(value: unknown): number {
  return typeof value === "number" ? value : parseFloat(String(value ?? 0)) || 0;
}

function renderItem(row: Record<string, unknown>): string {
  const fields: string[] = [`name: ${str(String(row.name))}`];

  const detail = String(row.detail ?? "");
  if (detail) fields.push(`detail: ${str(detail)}`);

  const min = num(row.amount_min);
  if (min !== 0) fields.push(`min: ${min}`);
  if (row.amount_max !== null) fields.push(`max: ${num(row.amount_max)}`);

  if (!row.is_included) fields.push("included: false");
  if (row.is_paid) fields.push("paid: true");

  // Short entries read better on one line; long ones need breaking up.
  const oneLine = `      { ${fields.join(", ")} },`;
  if (oneLine.length <= 100) return oneLine;

  return ["      {", ...fields.map((f) => `        ${f},`), "      },"].join("\n");
}

async function main() {
  const categories = (await sql`
    select id, name, note, is_included
    from categories
    order by sort_order, id`) as Record<string, unknown>[];

  const items = (await sql`
    select category_id, name, detail, amount_min, amount_max, is_paid, is_included
    from items
    order by sort_order, id`) as Record<string, unknown>[];

  const chunks: string[] = [];
  for (const category of categories) {
    const lines = ["  {", `    name: ${str(String(category.name))},`];

    const note = String(category.note ?? "");
    if (note) lines.push(`    note: ${str(note)},`);
    if (!category.is_included) lines.push("    included: false,");

    lines.push("    items: [");
    for (const item of items.filter((i) => i.category_id === category.id)) {
      lines.push(renderItem(item));
    }
    lines.push("    ],", "  },");
    chunks.push(lines.join("\n"));
  }

  const file = HEADER + chunks.join("\n") + "\n];\n";
  const target = new URL("./seed-data.ts", import.meta.url);
  writeFileSync(target, file, "utf8");

  console.log(
    `wrote db/seed-data.ts — ${categories.length} categories / ${items.length} items`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
