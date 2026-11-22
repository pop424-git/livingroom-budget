/**
 * Single-line wiring diagram: the consumer unit on the left, one row per
 * circuit, each running out to its switches and loads. Codes (S1, P2, L1…)
 * match the switch and outlet plan, which shows where each one is.
 */
import { FONT, text, svgDoc } from "./lib.mjs";

const ink = "#3b3a36";
const soft = "#6d6a62";
const lamp = "#d9931f";
const lampFill = "#fff1cc";
const pw = "#2f6f9f";
const pwFill = "#e4eff8";
const earth = "#3f8f4f";

const parts = [];
const W = 1560;
const H = 1260;
parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="#fbfaf6"/>`);

const line = (pts, color, width = 2.4, dash = "") =>
  `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

/** A box with a bold first line and a soft second line; returns its right and left edges. */
function chip(x, y, w, title, sub, { color = pw, fill = pwFill, h = 46 } = {}) {
  parts.push(`<rect x="${x}" y="${y - h / 2}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${color}" stroke-width="1.6"/>`);
  if (sub) {
    parts.push(text(x + w / 2, y - 3, title, { size: 14, weight: 600 }));
    parts.push(text(x + w / 2, y + 15, sub, { size: 11.5, fill: soft }));
  } else parts.push(text(x + w / 2, y + 5, title, { size: 14, weight: 600 }));
  return { l: x, r: x + w };
}
const sw = (x, y, w, title, sub) => chip(x, y, w, title, sub, { color: lamp, fill: lampFill, h: 56 });
const load = (x, y, w, title, sub) => chip(x, y, w, title, sub, { color: lamp, fill: "#fff" });
const drv = (x, y, w, title, sub) => chip(x, y, w, title, sub, { color: soft, fill: "#efede7" });

/** Gang number on a switch output. */
const gang = (x, y, n) =>
  parts.push(`<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="${lamp}" stroke-width="1.4"/>`, text(x, y + 4.5, String(n), { size: 12, weight: 700, fill: lamp }));

// Title.
parts.push(text(40, 52, "ผังสายไฟ · ห้องนั่งเล่น", { size: 26, weight: 600, anchor: "start" }));
parts.push(text(40, 80, "อ่านจากซ้ายไปขวา: ตู้ไฟ → เบรกเกอร์ → สาย → สวิตช์ → โคม/ปลั๊ก · รหัส S P L ตรงกับผังปลั๊ก-สวิตช์", { size: 14, fill: soft, anchor: "start" }));

// Consumer unit.
const cu = { x: 40, y: 130, w: 330, h: 940 };
const busX = 92;
parts.push(`<rect x="${cu.x}" y="${cu.y}" width="${cu.w}" height="${cu.h}" rx="10" fill="#f1efe9" stroke="${ink}" stroke-width="2"/>`);
parts.push(text(busX + 14, cu.y + 28, "ตู้ไฟ", { size: 17, weight: 600, anchor: "start" }));
parts.push(text(busX + 14, cu.y + 48, "ผนังทิศใต้ เหนือตู้เย็น", { size: 12, fill: soft, anchor: "start" }));
// Incoming feed and main breaker.
parts.push(line([[busX, 100], [busX, 196]], ink, 3.5));
parts.push(text(busX + 12, 112, "สายเมนจากบ้าน", { size: 12, fill: soft, anchor: "start" }));
parts.push(`<rect x="${busX - 30}" y="196" width="140" height="40" rx="5" fill="#fff" stroke="${ink}" stroke-width="1.8"/>`);
parts.push(text(busX + 40, 222, "เมน 32A", { size: 14, weight: 600 }));
parts.push(line([[busX, 236], [busX, 1010]], ink, 4));

const circuits = [];
function breaker(y, code, kind, color) {
  parts.push(line([[busX, y], [200, y]], ink, 2.4));
  parts.push(`<rect x="200" y="${y - 20}" width="150" height="40" rx="5" fill="#fff" stroke="${color}" stroke-width="2"/>`);
  parts.push(text(214, y + 5, code, { size: 15, weight: 700, fill: color, anchor: "start" }));
  parts.push(text(340, y + 5, kind, { size: 12.5, anchor: "end" }));
  circuits.push(y);
}
function cable(x0, x1, y, label, color) {
  parts.push(line([[x0, y], [x1, y]], color, 3));
  parts.push(text((x0 + x1) / 2, y - 9, label, { size: 11.5, fill: soft }));
}

// ---- C1 room lights + toilet -------------------------------------------
{
  const y = 300; // S1
  const y3 = 520; // S3
  breaker(y, "C1", "RCBO 10A", lamp);
  cable(350, 470, y, "THW 1.5 mm²", lamp);
  parts.push(line([[440, y], [440, y3], [470, y3]], lamp, 3));
  sw(470, y, 140, "S1 · Tuya 3 ช่อง", "ระหว่างประตูกับทีวี");
  // gangs
  const leaves = [y - 70, y, y + 70];
  leaves.forEach((ly, i) => {
    parts.push(line([[610, y], [650, y], [650, ly], [720, ly]], lamp, 2));
    gang(680, ly, i + 1);
  });
  load(720, y - 70, 210, "L1 โคมเพดาน", "โซนโซฟา ระหว่างโซฟากับทีวี");
  drv(720, y, 190, "Driver 24V ×2", "บนฝ้า มีช่องเซอร์วิส");
  parts.push(line([[910, y], [950, y]], lamp, 2));
  load(950, y, 330, "ไฟซ่อน ผนังยาวสองด้าน", "ฝั่งประตู 9.6 ม. + ฝั่งห้องน้ำ 8.0 ม. · ป้อนกลางเส้น");
  load(720, y + 70, 210, "L2 โคมเพดาน", "เหนือโต๊ะกินข้าว");

  sw(470, y3, 140, "S3 · Tuya 2 ช่อง", "นอกห้องน้ำ");
  [[y3 - 35, 1], [y3 + 35, 2]].forEach(([ly, n]) => {
    parts.push(line([[610, y3], [650, y3], [650, ly], [720, ly]], lamp, 2));
    gang(680, ly, n);
  });
  drv(720, y3 - 35, 190, "Driver 24V", "นอกห้องน้ำ บนฝ้า");
  parts.push(line([[910, y3 - 35], [950, y3 - 35]], lamp, 2));
  load(950, y3 - 35, 330, "ไฟซ่อนห้องน้ำ", "ผนังทิศใต้ 2 ม. · IP65 · ดวงเดียวในห้องน้ำ");
  load(720, y3 + 35, 210, "พัดลมดูดอากาศ", "ผนังห้องน้ำ เหนือโถ");
}

// ---- C2 deck lights ---------------------------------------------------
// A plain two-way pair, S2 inside and S4 outside, so either works with the
// internet down. Not on the app.
{
  const y = 700;
  breaker(y, "C2", "RCBO 10A", lamp);
  cable(350, 470, y, "THW 1.5 mm²", lamp);
  sw(470, y, 140, "S2 · 2 ทาง", "ธรรมดา · ในห้อง ใต้ S1");
  // Two travellers to S4 on the deck side of the same wall.
  parts.push(line([[610, y - 8], [650, y - 8]], lamp, 2), line([[610, y + 8], [650, y + 8]], lamp, 2));
  sw(650, y, 150, "S4 · 2 ทาง", "ธรรมดา · นอกบ้าน กันน้ำ");
  parts.push(text(630, y - 34, "สายโยง 2 เส้น", { size: 10.5, fill: soft }));
  parts.push(line([[800, y], [840, y], [840, y - 35], [880, y - 35]], lamp, 2));
  parts.push(line([[840, y], [840, y + 35], [880, y + 35]], lamp, 2));
  drv(880, y - 35, 170, "D1 Driver 24V", "กล่องกันน้ำใต้เดค");
  parts.push(line([[1050, y - 35], [1080, y - 35]], lamp, 2));
  load(1080, y - 35, 300, "LED strip ใต้ขอบเดค + บันได", "IP65 / บันได IP67");
  load(880, y + 35, 300, "โคมกล่องไม้ ×2 ใต้แป", "LED batten 220V ไม่ต้องมี driver");
}

// ---- outlet circuits: a daisy chain of outlets ----------------------
function chain(y, code, kind, wire, items, w = 128) {
  breaker(y, code, kind, pw);
  let x = 470;
  cable(350, x, y, wire, pw);
  items.forEach(([t, s], i) => {
    if (i) parts.push(line([[x - 22, y], [x, y]], pw, 3));
    chip(x, y, w, t, s);
    x += w + 22;
  });
}
chain(850, "C3", "RCBO 16A", "THW 2.5 mm²", [
  ["P2", "ใต้สวิตช์หลัก"],
  ["P1", "หลังทีวี"],
  ["P8", "หลังอาร์มแชร์"],
  ["P6", "ปลายโต๊ะกินข้าว"],
]);
chain(925, "C4", "RCBO 20A", "THW 2.5 mm²", [
  ["P4 เดี่ยว", "หลังตู้เย็น"],
  ["P5 ปลั๊กคู่", "ไมโครเวฟ กาต้มน้ำ"],
]);
chain(1000, "C5", "MCB 20A", "THW 4 mm²", [
  ["แอร์ 18,000 BTU", "ต่อตรง ไม่มีปลั๊ก"],
], 170);
// C6 hangs off the bus below the others.
parts.push(line([[busX, 1010], [busX, 1055]], ink, 4));
chain(1055, "C6", "RCBO 16A", "THW 2.5 mm²", [["P10", "ระเบียง IP55"]]);
// Extend the unit to wrap C6.
parts[parts.findIndex((p) => p.includes(`height="${cu.h}"`))] =
  `<rect x="${cu.x}" y="${cu.y}" width="${cu.w}" height="${cu.h + 30}" rx="10" fill="#f1efe9" stroke="${ink}" stroke-width="2"/>`;

// Earth.
parts.push(line([[cu.x + 20, 1085], [cu.x + 20, 1130], [470, 1130]], earth, 2.4, "8 5"));
parts.push(text(480, 1135, "สายดินสีเขียว เดินคู่ทุกวงจร → บาร์กราวด์ในตู้ → หลักดิน 5/8\" × 2.4 ม. · ปลั๊กทุกจุดเป็นแบบมีกราวด์", { size: 13, anchor: "start", fill: earth }));

// Key.
const ky = 1185;
parts.push(`<rect x="40" y="${ky - 14}" width="30" height="18" rx="4" fill="${lampFill}" stroke="${lamp}" stroke-width="1.4"/>`);
parts.push(text(80, ky, "สวิตช์ · สูง 120", { size: 13, anchor: "start" }));
parts.push(`<rect x="230" y="${ky - 14}" width="30" height="18" rx="4" fill="#fff" stroke="${lamp}" stroke-width="1.4"/>`);
parts.push(text(270, ky, "ไฟ", { size: 13, anchor: "start" }));
parts.push(`<rect x="330" y="${ky - 14}" width="30" height="18" rx="4" fill="#efede7" stroke="${soft}" stroke-width="1.4"/>`);
parts.push(text(370, ky, "driver แปลงไฟ 24V", { size: 13, anchor: "start" }));
parts.push(`<rect x="540" y="${ky - 14}" width="30" height="18" rx="4" fill="${pwFill}" stroke="${pw}" stroke-width="1.4"/>`);
parts.push(text(580, ky, "ปลั๊ก (ต่อพ่วงกันเป็นสาย ตามลำดับที่เดินรอบห้อง)", { size: 13, anchor: "start" }));
parts.push(text(40, ky + 40, "สายทั้งหมดเดินในท่อ ร้อยในผนังเบา/บนฝ้า · ขนาดสายและเบรกเกอร์เป็นค่าแนะนำ ให้ช่างไฟยืนยันตามระยะสายเมนจากบ้าน · 21 พ.ย. 2026", { size: 13, anchor: "start", fill: soft }));

export const wiring = svgDoc({ x: 0, y: 0, w: W, h: H, body: parts.join("\n"), font: FONT });
