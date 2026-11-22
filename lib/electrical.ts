/**
 * The agreed electrical layout: switches, outlets, what to buy, and what to
 * tell the electrician. Codes match the drawings in public/reference/.
 * Heights are centimetres above the finished room floor.
 */

export type Point = {
  code: string;
  what: string;
  where: string;
  height: string;
  use: string;
  outdoor?: boolean;
};

export const switches: Point[] = [
  {
    code: "S1",
    what: "Tuya WiFi 3 ช่อง",
    where: "ในห้อง ระหว่างทีวีกับบานเลื่อน ห่างขอบประตู 30",
    height: "120",
    use: "1 โคมโซฟา · 2 ไฟซ่อนในห้องทั้งหมด · 3 โคมโต๊ะกินข้าว",
  },
  {
    code: "S2",
    what: "สวิตช์ 2 ทางธรรมดา ปุ่มเดียว",
    where: "ใต้ S1",
    height: "120",
    use: "ไฟระเบียงทั้งหมด (strip ใต้เดค + โคมกล่องไม้ 2 ดวง)",
  },
  {
    code: "S3",
    what: "Tuya WiFi 2 ช่อง",
    where: "นอกห้องน้ำ ฝั่งลูกบิด",
    height: "120",
    use: "1 ไฟซ่อนห้องน้ำ · 2 พัดลมดูดอากาศ",
  },
  {
    code: "S4",
    what: "สวิตช์ 2 ทางธรรมดา วางนอน กล่องกันน้ำ",
    where: "นอกบ้าน หลัง S2 พอดี",
    height: "120",
    use: "คู่กับ S2 กดได้ทั้งสองจุด แม้เน็ตล่ม",
    outdoor: true,
  },
];

export const outlets: Point[] = [
  { code: "P1", what: "ปลั๊กคู่", where: "ซ่อนหลังทีวี ใต้ขาแขวน", height: "95", use: "ทีวี" },
  { code: "P2", what: "ปลั๊กคู่", where: "ใต้สวิตช์ S1 S2", height: "40", use: "ใช้ทั่วไป" },
  {
    code: "P3",
    what: "ปลั๊กคู่ ติดแนวตั้ง",
    where: "เหนือตู้เย็นชิดขอบขวา ข้างไมโครเวฟ",
    height: "ขอบล่าง 110",
    use: "ช่องบนไมโครเวฟ · ช่องล่างตู้เย็น",
  },
  { code: "P4", what: "ปลั๊กคู่", where: "กึ่งกลางปลายโต๊ะกินข้าว", height: "60", use: "หม้อสุกี้ โน้ตบุ๊ก" },
  { code: "P5", what: "ปลั๊กคู่", where: "หลังอาร์มแชร์", height: "40", use: "โคมตั้งพื้น ชาร์จมือถือ" },
  {
    code: "P6",
    what: "ปลั๊กคู่ ฝาสปริง IP44",
    where: "นอกบ้าน ใต้ S4 เหนือตู้รองเท้า",
    height: "100",
    use: "ใช้งานบนตู้รองเท้า",
    outdoor: true,
  },
  {
    code: "P7",
    what: "ปลั๊กคู่ บล็อกกันน้ำฝาพับ IP55",
    where: "นอกบ้าน ซ้ายประตู ห่างขอบ 30",
    height: "40",
    use: "ไฟประดับ ปั๊มน้ำ เครื่องมือ",
    outdoor: true,
  },
];

export type Line = { item: string; qty: string; note?: string };
export type Group = { title: string; lines: Line[] };

/** What to buy. Lengths are read off the drawings; confirm on site before ordering. */
export const shopping: Group[] = [
  {
    title: "ปลั๊ก (มีกราวด์ทุกตัว) · รวม 7 ชุด",
    lines: [
      { item: "ปลั๊กคู่ฝังผนัง + หน้ากากธรรมดา", qty: "5", note: "P1 P2 P3 P4 P5 · P3 ติดแนวตั้ง" },
      { item: "ปลั๊กคู่ + ฝาสปริงกันน้ำสาด IP44", qty: "1", note: "P6" },
      { item: "ปลั๊กคู่ + บล็อกกันน้ำฝาพับ IP55 แบบปิดได้ขณะเสียบ", qty: "1", note: "P7" },
    ],
  },
  {
    title: "สวิตช์ · รวม 4 ตัว",
    lines: [
      { item: "Tuya WiFi 3 ช่อง", qty: "1", note: "S1 · ซื้อแล้ว" },
      { item: "Tuya WiFi 2 ช่อง", qty: "1", note: "S3 · ซื้อแล้ว" },
      { item: "สวิตช์ 2 ทางธรรมดา 1 ช่อง + หน้ากาก", qty: "2", note: "S2 ในห้อง · S4 นอกบ้าน" },
      { item: "ฝาครอบกันน้ำสำหรับสวิตช์", qty: "1", note: "S4" },
    ],
  },
  {
    title: "บล็อก · กล่อง",
    lines: [
      { item: "บล็อกฝังผนัง 2×4 นิ้ว", qty: "10", note: "S1–S4 · P1–P6" },
      { item: "บล็อกกันน้ำฝาพับ ติดลอย", qty: "1", note: "P7" },
      { item: "กล่องพักสายบนฝ้า เผื่อโมดูลรีเลย์", qty: "1", note: "ใกล้ S2" },
    ],
  },
  {
    title: "ไฟ",
    lines: [
      { item: "โคมเพดาน + กล่องต่อสายบนฝ้า", qty: "2", note: "L1 โซนโซฟา · L2 โต๊ะกินข้าว" },
      { item: "LED strip 24V 2700K + รางอะลูมิเนียม · ไฟซ่อนในห้อง", qty: "~17.6 ม.", note: "ฝั่งประตู 9.6 + ฝั่งห้องน้ำ 8.0" },
      { item: "Driver 24V ไฟซ่อนในห้อง", qty: "2", note: "บนฝ้า" },
      { item: "LED strip IP65 · ไฟซ่อนห้องน้ำ", qty: "2 ม.", note: "ผนังทิศใต้" },
      { item: "Driver 24V ห้องน้ำ", qty: "1", note: "วางนอกห้องน้ำ" },
      { item: "พัดลมดูดอากาศ 10 นิ้ว", qty: "1" },
      { item: "LED strip ระเบียง IP65 ใต้ขอบเดค + IP67 ใต้บันได", qty: "~9.6 + ~8 ม." },
      { item: "D1 Driver 24V ในกล่องกันน้ำใต้เดค", qty: "1" },
      { item: "โคมกล่องไม้ + LED batten 120 ซม. 2700K", qty: "2", note: "ระเบียง ใต้แป" },
    ],
  },
  {
    title: "ตู้ไฟ",
    lines: [
      { item: "ตู้ไฟ อย่างน้อย 6 ช่อง", qty: "1", note: "ผนังครัว เหนือตู้เย็น · เมน + 4 วงจร + เผื่อ 1" },
      { item: "เมนเบรกเกอร์ 32A", qty: "1" },
      { item: "RCBO 30 mA", qty: "3", note: "10A (C1) · 16A (C2) · 20A (C3)" },
      { item: "MCB 20A", qty: "1", note: "C4 แอร์ ต่อตรง" },
      { item: "หลักดิน 5/8\" × 2.4 ม.", qty: "1" },
    ],
  },
  {
    title: "สายไฟ · ให้ช่างถอดความยาวจากแบบ",
    lines: [
      { item: "THW 1.5 mm²", qty: "—", note: "ไฟในห้อง C1" },
      { item: "THW 2.5 mm²", qty: "—", note: "นอกบ้าน C2 (รวมสายโยง S2–S4) · ปลั๊กในห้อง C3" },
      { item: "THW 4 mm²", qty: "—", note: "แอร์ C4" },
      { item: "สายดินสีเขียว", qty: "—", note: "เดินคู่ทุกวงจร" },
    ],
  },
];

export const circuits: [string, string][] = [
  ["C1", "ไฟในห้อง + ห้องน้ำ · RCBO 10A"],
  ["C2", "นอกบ้าน: ไฟระเบียงทั้งหมด + ปลั๊ก P6 P7 · RCBO 16A"],
  ["C3", "ปลั๊กในห้องทั้งหมด P1–P5 รวมครัว · RCBO 20A"],
  ["C4", "แอร์ ต่อตรง ไม่มีปลั๊ก · MCB 20A"],
];

export const tellElectrician = [
  "เดินสาย L + N เข้ากล่อง S1 และ S3 (สวิตช์ Tuya) · S2 S4 ไม่ต้องมี N",
  "S2–S4 เป็นสวิตช์ 2 ทางปกติ โยงสาย 2 เส้น",
  "P3 ติดแนวตั้ง",
  "ตั้งตู้เย็นห่างผนัง ~8 ซม.",
  "แอร์ต่อตรงจากเบรกเกอร์ C4 ไม่มีปลั๊ก",
];

export const checkOnSite = [
  "แอร์สูงไม่เกิน ~33 ซม. (เหนือหน้าต่างเหลือถึงฝ้า 40)",
  "ประตูห้องน้ำ: ความหนาวงกบ และบานสูง 200 หรือ 210",
  "ความสูงท้องโคมกล่องไม้จริง (แบบประมาณ 2.78)",
  "เทียบหัวปลั๊กตู้เย็นกับไมโครเวฟจริงกับปลั๊ก P3 ก่อนติด",
  "ซิงก์ต้องเล็กพอกับช่องตู้กว้าง 40",
];
