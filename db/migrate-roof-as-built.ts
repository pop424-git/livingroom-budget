/**
 * Follows the roof as the frame was actually built (Nov 2026).
 *
 *   npm run db:migrate-roof
 *
 * The builder brought the ridge down to keep the gable from standing too tall.
 * From site photos it sits at about 3.65 m with the deck post heads and the
 * west wall head still at 2.40, so the pitches go from 38.7° / 21.8° to about
 * 32° / 17°. These are estimates until the frame is measured.
 *
 *   roof      slopes 2.95 + 5.24 = 8.19 m × 9.60 m ≈ 79 sqm (was ≈ 82)
 *   walls     gables 2 × ½ × 4.00 × 1.25 = 5.0 (was 6.4), so
 *             46.1 + 19.2 + 5.0 − openings ~16 ≈ 54 sqm (was ≈ 56)
 *
 * Only the two category notes change, and only while they still read exactly
 * as before, so wording edited through the site is left alone. Item details
 * and prices are not touched: the metal sheet quote that mentions 82 sqm is
 * the supplier's own wording. Safe to re-run.
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Copy .env.local.example to .env.local and paste the Neon connection string."
  );
  process.exit(1);
}

const sql = neon(url);

const notes: { category: string; from: string; to: string }[] = [
  {
    category: "งานหลังคา",
    from: "~82 ตร.ม. — จั่วไม่สมมาตร 38.7° ฝั่งเดค / 21.8° ฝั่งหลัง สัน 4.00 ม. จากพื้น",
    to: "~79 ตร.ม. — จั่วไม่สมมาตร ~32° ฝั่งเดค / ~17° ฝั่งหลัง สัน ~3.65 ม. จากพื้น (ประมาณจากรูปโครงจริง รอวัด)",
  },
  {
    category: "งานผนัง",
    from: "~56 ตร.ม. — ผนังเบาไฟเบอร์ซีเมนต์ · ฝ้า 2.40 ม. บวกหน้าจั่วสองด้าน หักช่องเปิด ~16 ตร.ม.",
    to: "~54 ตร.ม. — ผนังเบาไฟเบอร์ซีเมนต์ · ฝ้า 2.40 ม. บวกหน้าจั่วสองด้าน หักช่องเปิด ~16 ตร.ม.",
  },
];

async function main() {
  let updated = 0;

  for (const { category, from, to } of notes) {
    const rows = await sql`
      update categories set note = ${to}
      where name = ${category} and note = ${from}
      returning id`;
    updated += rows.length;
    console.log(`${rows.length ? "updated" : "unchanged or edited"}: ${category} note`);
  }

  console.log(`done — ${updated} row(s) updated`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
