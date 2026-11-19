/**
 * Follows the plan as redrawn at 400 × 960 cm.
 *
 *   npm run db:migrate-plan-960
 *
 * Five notes and details still quoted figures worked out for the old 8 m
 * length. Each is replaced only while it still reads exactly as before, so
 * wording edited through the site is left alone. No prices or paid flags are
 * touched. Safe to re-run.
 *
 *   floor     400 × 960 = 38.4 sqm: living room 35.4 + toilet 3.0
 *   roof      slopes 3.20 + 5.39 = 8.59 m × 9.60 m ≈ 82 sqm, as quoted
 *   walls     long 2 × 9.60 × 2.40 + short 2 × 4.00 × 2.40 + gables 6.4
 *             − openings ~16 ≈ 56 sqm
 *   air con   whole-room load kept at ~845 BTU per sqm: 35.4 sqm ≈ 30,000
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
    category: "งานพื้น",
    from: "ผังล่าสุด 400 × 800 ซม. — ห้องนั่งเล่น 32.0 + ห้องน้ำ 3.0 ตร.ม.",
    to: "ผังล่าสุด 400 × 960 ซม. — ห้องนั่งเล่น 35.4 + ห้องน้ำ 3.0 ตร.ม.",
  },
  {
    category: "งานหลังคา",
    from: "~79 ตร.ม. — จั่วไม่สมมาตร 38.7° ฝั่งเดค / 21.8° ฝั่งหลัง สัน 4.00 ม. จากพื้น",
    to: "~82 ตร.ม. — จั่วไม่สมมาตร 38.7° ฝั่งเดค / 21.8° ฝั่งหลัง สัน 4.00 ม. จากพื้น",
  },
  {
    category: "งานผนัง",
    from: "~48 ตร.ม. — ผนังเบาไฟเบอร์ซีเมนต์ · ฝ้า 2.40 ม. บวกหน้าจั่วสองด้าน หักช่องเปิด ~16 ตร.ม.",
    to: "~56 ตร.ม. — ผนังเบาไฟเบอร์ซีเมนต์ · ฝ้า 2.40 ม. บวกหน้าจั่วสองด้าน หักช่องเปิด ~16 ตร.ม.",
  },
  {
    category: "แอร์",
    from: "ห้อง 32 ตร.ม. โหลดทั้งห้อง ~27,000 BTU / แผนแบ่งโซนโซฟา 18,000–24,000",
    to: "ห้อง 35.4 ตร.ม. โหลดทั้งห้อง ~30,000 BTU / แผนแบ่งโซนโซฟา 18,000–24,000",
  },
];

const details: { category: string; item: string; from: string; to: string }[] = [
  {
    category: "งานพื้น",
    item: "กระเบื้องยางปูพื้น",
    from: "32.0 ตร.ม. ตามผัง — เลือกผิวด้าน (matte) สีอ่อน ผิวมันจะสะท้อนแสงจากผนังกระจกแยงตาตอนบ่าย",
    to: "35.4 ตร.ม. ตามผัง — เลือกผิวด้าน (matte) สีอ่อน ผิวมันจะสะท้อนแสงจากผนังกระจกแยงตาตอนบ่าย",
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

  for (const { category, item, from, to } of details) {
    const rows = await sql`
      update items set detail = ${to}, updated_at = now()
      where name = ${item} and detail = ${from}
        and category_id = (select id from categories where name = ${category})
      returning id`;
    updated += rows.length;
    console.log(`${rows.length ? "updated" : "unchanged or edited"}: ${item}`);
  }

  console.log(`done — ${updated} row(s) updated`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
