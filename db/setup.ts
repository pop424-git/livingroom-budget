/**
 * Creates the tables and loads the starting data.
 *
 *   npm run db:setup            create tables, seed only when empty
 *   npm run db:setup -- --force wipe both tables first, then seed
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

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

type SeedItem = {
  name: string;
  detail?: string;
  min?: number;
  max?: number;
  included?: boolean;
};

type SeedCategory = {
  name: string;
  note?: string;
  included?: boolean;
  items: SeedItem[];
};

const seed: SeedCategory[] = [
  {
    name: "งานเตรียมพื้นที่ + ฐานราก",
    items: [
      { name: "ปรับพื้นที่ / ถางหญ้า / วางผัง" },
      { name: "ฐานราก + เสาเข็มสั้น" },
      { name: "ตอม่อ + เหล็กเสียบเสา" },
    ],
  },
  {
    name: "งานโครงสร้างเหล็ก",
    note: "ระยะเสาต้องหาร 1.20 ม. ลงตัว — ผนังยาว 8 ม. = 6 แผ่นพอดี",
    items: [
      { name: "เสาหลัก" },
      { name: "คานพื้น (ยกพื้น +45 ซม.)" },
      { name: "คานอะเส" },
      { name: "โครงหลังคา + แป" },
      {
        name: "เสารับชายคาระเบียง 3–4 ต้น",
        detail:
          "ชายคายื่น 2 ม. ถ้าทำ cantilever ล้วนคานเหล็กต้องใหญ่ขึ้นมาก มีเสารับถูกกว่า วางห่าง 2.5–2.7 ม. เว้นช่วงกลางไว้เป็นจุดนั่ง",
      },
      {
        name: "สีกันสนิม + สีจริง",
        detail: "โชว์โครง ไม่ทำฝ้า — แนะนำเหล็กกัลวาไนซ์แล้วทาขาวทับ แพงกว่าเหล็กดำ 20–30% แต่สีลอกแล้วไม่มีสนิมย้อยเปื้อนผนัง",
      },
    ],
  },
  {
    name: "งานหลังคา",
    note: "~62 ตร.ม. (ลึก 6.6 × ยาว 9.2 ม. รวมชายคา)",
    items: [
      {
        name: "เมทัลชีทติดฉนวน PU 25 มม.",
        detail: "550–800 บาท/ตร.ม. × 62 ตร.ม. — เพิงหมาแหงน 10–15° ลาดลงฝั่งระเบียง",
        min: 34100,
        max: 49600,
      },
      {
        name: "ทางเลือกประหยัด: เมทัลชีทติด PE 5 มม.",
        detail: "300–430 บาท/ตร.ม. × 62 ตร.ม. — กันร้อน/กันเสียงฝนสู้ PU ไม่ได้",
        min: 18600,
        max: 26700,
        included: false,
      },
      { name: "รางน้ำ + ตะเข้ + ท่อลง" },
      { name: "สกรูยิงหลังคาหัวสีขาว + อุปกรณ์" },
    ],
  },
  {
    name: "งานผนัง",
    note: "~51 ตร.ม. (รอบ 24 ม. × สูง 2.8 ม. หักช่องเปิด ~16 ตร.ม.)",
    items: [
      {
        name: "แผ่น ISOWALL PU 50 มม.",
        detail: "800–1,100 บาท/ตร.ม. × 51 ตร.ม. — ไม่ต้องมีโครงคร่าว ไม่ต้องทาสี ติดตั้ง 2–3 วัน",
        min: 40800,
        max: 56100,
      },
      { name: "รางยู + เฟรมรอบช่องเปิด", detail: "100–150 บาท/ม. รอบผนัง ~40 ม.", min: 4000, max: 6000 },
      {
        name: "ทางเลือก: ผนังเบาไฟเบอร์ซีเมนต์ + ใยแก้ว",
        detail: "โครงคร่าว 9,100 + แผ่น 47,000 + สี 8,000 — กันเสียงดีกว่า ISOWALL (STC 40–45 vs 25–30) แต่ทำนานกว่าราว 2 สัปดาห์",
        min: 64100,
        included: false,
      },
    ],
  },
  {
    name: "งานพื้น",
    items: [
      { name: "โครงพื้นยกระดับ + แผ่นพื้น", detail: "~44 ตร.ม. (ห้อง 32 + ระเบียง 12)" },
      {
        name: "กระเบื้องยางปูพื้น",
        detail: "~28 ตร.ม. — เลือกผิวด้าน (matte) สีอ่อน ผิวมันจะสะท้อนแสงจากผนังกระจกแยงตาตอนบ่าย",
      },
      { name: "บัวเชิงผนัง" },
    ],
  },
  {
    name: "ระเบียงไม้เอ็นกาวะ",
    note: "1.5 × 8 ม. = 12 ตร.ม. สูงจากดิน 45 ซม. นั่งห้อยขาได้",
    items: [
      { name: "โครงเหล็กชุบกัลวาไนซ์รับพื้นระเบียง", detail: "อย่าใช้โครงไม้ — โดนฝนสาดตลอดอายุการใช้งาน" },
      {
        name: "ไม้ปูพื้นระเบียง",
        detail: "ไม้เต็ง/แดง/ตะเคียน หรือ WPC · เว้นร่อง 3–5 มม. ให้น้ำไหลลง · ลาดออกนอก 1%",
      },
      { name: "บันได 3 ขั้น (ลูกตั้ง 15 ซม.)" },
      {
        name: "ระแนงไม้ใต้ชายคา",
        detail: "ของตกแต่งตามรูป HAKO ไม่ได้กันฝน ตัดออกได้ถ้าคุมงบ",
        included: false,
      },
    ],
  },
  {
    name: "ประตู–หน้าต่าง–กระจก",
    items: [
      { name: "ประตูกระจกบานเลื่อน ช่องกว้าง 3.4 ม." },
      { name: "หน้าต่างบานยาว 2.0 ม." },
      { name: "หน้าต่างเบย์ 3.4 ม." },
      { name: "ประตูหน้า" },
      { name: "ประตูห้องน้ำ" },
      {
        name: "หน้าต่างบานสูงหน้าจั่วทิศใต้",
        detail: "แสงลงโซนครัว/โต๊ะกินข้าว ไม่ตกใส่โซฟา",
        min: 8000,
        max: 15000,
      },
      { name: "มู่ลี่ / ม่านทึบ", detail: "จำเป็น ไม่ใช่ของตกแต่ง — กระจกด้านยาวกับหน้าต่างเหนือโซฟาต้องบังได้" },
    ],
  },
  {
    name: "งานไฟฟ้า",
    items: [
      { name: "ตู้ Consumer Unit + เบรกเกอร์" },
      { name: "เดินสาย + ท่อร้อยสาย" },
      { name: "ดวงโคม 4–6 จุด + ไฟแขวนเหนือโต๊ะ", detail: "อย่าใส่ดาวน์ไลท์เยอะ ทุกดวงคือรูทะลุชั้นฉนวน" },
      { name: "ปลั๊ก + สวิตช์" },
      { name: "พัดลมเพดาน", detail: "ก้านต่อยาวให้ใบพัดสูงจากพื้น 2.4–2.7 ม." },
      {
        name: 'พัดลมระบายอากาศ 10"',
        detail: "ต้องมีบานเกล็ดปิดเองอัตโนมัติ + สวิตช์แยกที่เห็นชัดว่าเปิดค้าง",
        min: 2500,
        max: 4500,
      },
    ],
  },
  {
    name: "งานระบบน้ำ + ห้องน้ำ",
    note: "1.20 × 1.50 ม. = 1.81 ตร.ม.",
    items: [
      { name: "ท่อน้ำดี + ท่อน้ำทิ้ง" },
      { name: "บ่อเกรอะ / ถังบำบัด" },
      { name: "สุขภัณฑ์" },
      { name: "อ่างล้างหน้า + ก๊อก" },
      { name: "กระเบื้องผนัง/พื้นห้องน้ำ" },
      { name: "พัดลมดูดอากาศห้องน้ำ", detail: "เดินท่อออกนอกอาคารแยกจากตัวระบายอากาศห้องใหญ่" },
    ],
  },
  {
    name: "แอร์",
    note: "ห้อง 32 ตร.ม. โหลดทั้งห้อง ~27,000 BTU / แผนแบ่งโซนโซฟา 18,000–24,000",
    items: [
      {
        name: "แอร์ 18,000 BTU อินเวอร์เตอร์ เบอร์ 5",
        detail: "เลือกรุ่นเสียงในร่มต่ำ 20–24 dB มีโหมด sleep — ห้องนี้ใช้นอนกลางวันเป็นหลัก",
        min: 20000,
        max: 28000,
      },
      {
        name: "ค่าติดตั้ง + ท่อน้ำยา + ราง",
        detail: "ติดผนังยาวฝั่งขวา ห่างผนังครัว 6.0–7.0 ม. เป่าขวางห้อง ไม่เป่าลงหัวคนนอน",
        min: 5000,
        max: 8000,
      },
    ],
  },
  {
    name: "โซลาร์เซลล์ 2kW",
    note: "ยังไม่ทำเฟสแรก — กดปุ่มนับรวมเมื่อพร้อม",
    included: false,
    items: [
      { name: "แผง AIKO 670W × 3 (2,010W DC)", min: 10500, max: 11100 },
      { name: "Micro inverter SigenMicro 1000W × 2", detail: "1 ตัวรับ 2 แผง · DC/AC ratio 1.34 จะ clip ตอนเที่ยงแดดจัด", min: 12400 },
      {
        name: "ตัวกันย้อน (zero export controller + CT)",
        detail: "ต้องเป็นรุ่นที่สั่งหรี่กำลัง inverter ได้ ไม่ใช่ relay ตัดวงจรเฉยๆ — ไม่งั้นไฟกระพริบตอนโหลดต่ำ ควรใช้ accessory ของ Sigenergy เอง",
        min: 2500,
        max: 5000,
      },
      { name: "สายไฟ AC connector × 2", min: 1600 },
      { name: "สาย DC + หัว MC4 + เครื่องมือย้ำ", min: 1500, max: 2500 },
      { name: "ขายึด + รางอลูมิเนียม 3 แผง", min: 3000, max: 6000 },
      {
        name: "เบรกเกอร์ + เดินสายเข้าตู้ CU (ช่างไฟ)",
        detail: "ห้ามใช้แบบเสียบปลั๊ก · ขนานไฟกับ PEA ยังต้องยื่นขออนุญาต micro inverter ไม่ได้ยกเว้นข้อนี้",
        min: 3000,
        max: 6000,
      },
    ],
  },
  {
    name: "ครัว + เฟอร์นิเจอร์",
    items: [
      { name: "เคาน์เตอร์ครัว 2.6 × 0.6 ม." },
      { name: "อ่างล้างจาน + ก๊อก" },
      { name: "โซฟา (ใช้นอนกลางวันเป็นหลัก)" },
      { name: "โต๊ะกินข้าว 1.8 × 0.9 ม. + เก้าอี้" },
      { name: "ตู้ทีวี / ผนังไม้ระแนงแขวนทีวี", detail: "ต้องฝังแผ่นเหล็กในผนังตรงจุดแขวนก่อนขึ้นแผ่น ISOWALL" },
      { name: "ทีวี" },
    ],
  },
  {
    name: "ค่าแรง + เบ็ดเตล็ด",
    items: [
      { name: "ค่าแรงรวม (ถ้าแยกจากค่าของ)" },
      { name: "ค่าขนส่งวัสดุ" },
      { name: "เผื่องานเพิ่ม 10%" },
    ],
  },
];

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
