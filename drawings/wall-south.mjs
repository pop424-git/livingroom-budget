/**
 * Interior elevation of the kitchen (south) wall, seen from inside the room
 * looking south, in centimetres.
 *
 * Horizontal is the plan's x: east (the door wall) on the left at 0, west on
 * the right at 400. Vertical is height above the finished room floor, via up().
 * The toilet's north partition stands 160 in front of the kitchen wall on the
 * west half, so it is drawn as the nearer plane.
 */
import { FONT, dimH, text, svgDoc } from "./lib.mjs";

const W = 400;
const CEIL = 240;
const up = (h) => -h;

const ink = "#3b3a36";
const soft = "#8a877f";
const faint = "#c9c6bd";
const lamp = "#d9931f";
const lampFill = "#fff1cc";
const pw = "#2f6f9f";
const pwFill = "#e4eff8";

const parts = [];
const box = { x: -70, y: -320, w: 560, h: 470 };
parts.push(`<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="#fbfaf6"/>`);

parts.push(text(-55, -292, "ผนังครัว ฝั่งที่ล้างจาน · มองจากในห้องไปทางทิศใต้", { size: 15, weight: 600, anchor: "start" }));
parts.push(text(-55, -276, "ซ้าย = ผนังฝั่งประตู · ขวา = ห้องน้ำ · ความสูงวัดจากพื้นในห้อง", { size: 9, fill: soft, anchor: "start" }));

const rect = (x, h0, w, h, attrs) => `<rect x="${x}" y="${up(h0 + h)}" width="${w}" height="${h}" ${attrs}/>`;
const label = (x, h, lines, { anchor = "start", fill = pw } = {}) =>
  lines.map((t, i) => text(x, up(h) + 3 + i * 10, t, { size: 8, weight: i ? 400 : 600, anchor, fill: i ? ink : fill })).join("");

// Kitchen wall, 0–190, the far plane.
parts.push(rect(0, 0, 200, CEIL, `fill="#ffffff" stroke="${ink}" stroke-width="1.2"`));

// Kitchen window 100 × 100 over the counter, sill 100 so it clears the splash.
parts.push(rect(85, 100, 100, 100, `fill="#eef3f4" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<line x1="135" y1="${up(100)}" x2="135" y2="${up(200)}" stroke="${faint}" stroke-width="1"/>`);
parts.push(text(135, up(150), "หน้าต่างครัว 100 × 100", { size: 7.5, fill: soft }));

// IKEA KNOXHULT 122 × 61 × 85: body 120, top 122 × 2.9, three door sections
// of 40. The sink goes in the right-hand section, so its drawer comes out.
parts.push(rect(69, 0, 120, 82.1, `fill="#ffffff" stroke="${ink}" stroke-width="1.2"`));
parts.push(rect(68, 82.1, 122, 2.9, `fill="#d9b47e" stroke="${ink}" stroke-width="0.8"`));
for (const x of [109, 149]) parts.push(`<line x1="${x}" y1="${up(80)}" x2="${x}" y2="${up(6)}" stroke="${soft}" stroke-width="0.8"/>`);
parts.push(`<line x1="69" y1="${up(6)}" x2="189" y2="${up(6)}" stroke="${faint}" stroke-width="0.8"/>`);
// The drawer in the sink section, crossed out: the bowl takes its place.
parts.push(rect(150, 70, 38, 10, `fill="none" stroke="#b3412c" stroke-width="0.8" stroke-dasharray="2 2"`));
parts.push(`<path d="M150 ${up(80)} L188 ${up(70)} M150 ${up(70)} L188 ${up(80)}" stroke="#b3412c" stroke-width="0.6"/>`);
// Sink bowl (dashed, inside the cabinet) and tap.
parts.push(`<path d="M152 ${up(85)} v20 h34 v-20" fill="none" stroke="${soft}" stroke-width="1" stroke-dasharray="3 2"/>`);
parts.push(`<path d="M169 ${up(85)} v-16 h-7" fill="none" stroke="${soft}" stroke-width="1.4"/>`);
parts.push(text(169, up(45), "ซิงก์ 1 หลุม", { size: 7.5, fill: soft }));
parts.push(text(169, up(36), "ช่องขวา 40", { size: 7, fill: soft }));
parts.push(text(109, up(45), "KNOXHULT", { size: 7.5, fill: soft }));
parts.push(text(109, up(36), "122 × 61 × 85", { size: 7, fill: soft }));
// Dish rack on the counter, dashed.
parts.push(rect(74, 85, 50, 14, `fill="none" stroke="${faint}" stroke-width="1" stroke-dasharray="3 2"`));
parts.push(text(99, up(94), "ที่คว่ำจาน", { size: 7, fill: soft }));

// Fridge 55 × 97 in the 70 bay, microwave possibly on top.
parts.push(rect(8, 0, 55, 97, `fill="#f4f2ec" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<line x1="8" y1="${up(70)}" x2="63" y2="${up(70)}" stroke="${faint}" stroke-width="1"/>`);
parts.push(text(35.5, up(40), "ตู้เย็น", { size: 8, fill: soft }));
parts.push(text(35.5, up(30), "55 × 55 × 97", { size: 7, fill: soft }));
parts.push(rect(10, 97, 40, 27, `fill="none" stroke="${soft}" stroke-width="1" stroke-dasharray="3 2"`));
parts.push(text(30, up(112), "ไมโครเวฟ?", { size: 7, fill: soft }));

// P4 hidden behind the fridge, below its top (dashed = behind).
parts.push(rect(52, 76.5, 10, 7, `rx="1" fill="none" stroke="${pw}" stroke-width="1.2" stroke-dasharray="1.5 1.5"`));
parts.push(`<line x1="57" y1="${up(83.5)}" x2="56" y2="${up(138)}" stroke="${pw}" stroke-width="0.6"/>`);
parts.push(label(6, 156, ["P4 ปลั๊กคู่ สูง 80", "หลังตู้เย็นชิดขอบขวา"]));

// Consumer unit over the fridge.
parts.push(rect(12, 170, 36, 40, `fill="#d8d5cc" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<line x1="12" y1="${up(210)}" x2="48" y2="${up(170)}" stroke="${ink}" stroke-width="0.6"/>`);
parts.push(label(6, 218, ["ตู้ไฟ ขอบล่าง 170 · บน 210"], { fill: ink }));

// Toilet partition end, 190–200.
parts.push(rect(190, 0, 10, CEIL, `fill="url(#hatch)" stroke="${ink}" stroke-width="1"`));

// Toilet's north partition, the nearer plane, 200–400 with its door 205–275.
parts.push(rect(200, 0, 200, CEIL, `fill="#f1efe9" stroke="${ink}" stroke-width="1.4"`));
parts.push(text(330, up(222), "ผนังห้องน้ำ (ยื่นออกมาจากผนังครัว 160)", { size: 7.5, fill: soft }));
parts.push(rect(205, 0, 70, 200, `fill="#fff" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<circle cx="268" cy="${up(100)}" r="1.6" fill="${ink}"/>`);
parts.push(text(240, up(150), "ประตูห้องน้ำ 70", { size: 7.5, fill: soft }));
parts.push(text(240, up(140), "บานพับซ้าย มือจับขวา", { size: 7, fill: soft }));

// S3 on the latch side.
parts.push(rect(283, 116, 12, 7.2, `rx="0.8" fill="${lampFill}" stroke="${lamp}" stroke-width="1.2"`));
parts.push(`<line x1="${289}" y1="${up(116)}" x2="${289}" y2="${up(123.2)}" stroke="${lamp}" stroke-width="0.6"/>`);
parts.push(label(300, 124, ["S3 2 ช่อง สูง 120", "1 ไฟซ่อนห้องน้ำ", "2 พัดลมดูดอากาศ"], { fill: lamp }));

// Floor and ceiling.
parts.push(`<line x1="-15" y1="0" x2="${W + 15}" y2="0" stroke="${ink}" stroke-width="2"/>`);
parts.push(text(W + 4, up(CEIL) + 4, "ฝ้า 240", { size: 8, fill: soft, anchor: "start" }));

// Height scale.
for (const h of [80, 120, 170, 200, 240]) {
  parts.push(`<line x1="-22" y1="${up(h)}" x2="-12" y2="${up(h)}" stroke="${ink}" stroke-width="0.8"/>`);
  parts.push(text(-25, up(h) + 3, String(h), { size: 8, anchor: "end" }));
}
parts.push(`<line x1="-17" y1="0" x2="-17" y2="${up(CEIL)}" stroke="${ink}" stroke-width="0.6"/>`);

// Widths along the floor (dimension text is big in lib, so scale it down here).
const dims = [dimH(0, 68, 28, "68"), dimH(68, 190, 28, "122"), dimH(200, 275, 28, "75"), dimH(275, 400, 28, "125")]
  .join("")
  .replace(/font-size="20"/g, 'font-size="10"');
parts.push(dims);

parts.push(text(-55, 70, "· ผนังนี้ไม่มีไฟซ่อน (ไฟซ่อนในห้องอยู่แค่ผนังยาวสองด้าน) · ไฟซ่อนห้องน้ำอยู่หลังผนังห้องน้ำ ชิดผนังทิศใต้", { size: 8, anchor: "start" }));
parts.push(text(-55, 84, "· ไม่มีปลั๊กบนเคาน์เตอร์ · P4 ปลั๊กคู่ซ่อนหลังตู้เย็น ใช้ทั้งตู้เย็นกับไมโครเวฟ ตั้งตู้เย็นห่างผนัง ~8 · ซิงก์ช่องขวา ต้องถอดลิ้นชักออก ท่อน้ำเข้า-ทิ้งเจาะผ่านแผ่นหลังตู้ฝั่งห้องน้ำ", { size: 8, anchor: "start" }));
parts.push(text(-55, 98, "· หน้าต่างครัวขอบล่าง 100 พ้นเคาน์เตอร์ 85 ได้ 15 ซม. · ที่คว่ำจานสูงเกิน 15 จะบังขอบล่างหน้าต่างนิดหน่อย", { size: 8, anchor: "start" }));
parts.push(text(-55, 124, "รูปด้านภายใน ผนังครัว · 21 พ.ย. 2026", { size: 10, anchor: "start" }));

const defs = `<pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${soft}" stroke-width="0.8"/></pattern>`;

// Drawn small in centimetres, so render it at twice the size of the other sheets.
export const wallSouth = svgDoc({ ...box, defs, body: parts.join("\n"), font: FONT }).replace(
  `width="${box.w}" height="${box.h}" font-family`,
  `width="${box.w * 2}" height="${box.h * 2}" font-family`
);
