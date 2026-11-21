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

// Counter 120 at 85, sink at its west end.
parts.push(rect(70, 0, 120, 85, `fill="#f4f2ec" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<line x1="70" y1="${up(80)}" x2="190" y2="${up(80)}" stroke="${faint}" stroke-width="1"/>`);
parts.push(`<path d="M134 ${up(85)} v6 h48 v-6" fill="none" stroke="${soft}" stroke-width="1"/>`);
parts.push(`<path d="M158 ${up(85)} v-14 h8" fill="none" stroke="${soft}" stroke-width="1.4"/>`);
parts.push(text(158, up(50), "ซิงก์ล้างจาน", { size: 8, fill: soft }));
parts.push(text(105, up(50), "เคาน์เตอร์ 85", { size: 8, fill: soft }));
// Dish rack on the counter, dashed.
parts.push(rect(76, 85, 50, 14, `fill="none" stroke="${faint}" stroke-width="1" stroke-dasharray="3 2"`));
parts.push(text(101, up(94), "ที่คว่ำจาน", { size: 7, fill: soft }));

// Fridge 55 × 97 in the 70 bay, microwave possibly on top.
parts.push(rect(8, 0, 55, 97, `fill="#f4f2ec" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<line x1="8" y1="${up(70)}" x2="63" y2="${up(70)}" stroke="${faint}" stroke-width="1"/>`);
parts.push(text(35.5, up(40), "ตู้เย็น", { size: 8, fill: soft }));
parts.push(text(35.5, up(30), "55 × 55 × 97", { size: 7, fill: soft }));
parts.push(rect(10, 97, 40, 27, `fill="none" stroke="${soft}" stroke-width="1" stroke-dasharray="3 2"`));
parts.push(text(30, up(112), "ไมโครเวฟ?", { size: 7, fill: soft }));

// P4 beside the microwave, over the fridge.
parts.push(rect(51, 106, 10, 7, `rx="1" fill="${pwFill}" stroke="${pw}" stroke-width="1.2"`));
parts.push(`<line x1="56" y1="${up(113)}" x2="50" y2="${up(138)}" stroke="${pw}" stroke-width="0.6"/>`);
parts.push(label(6, 156, ["P4 ปลั๊กคู่ สูง 110", "ตู้เย็น + ไมโครเวฟ"]));

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
for (const h of [85, 110, 120, 170, 200, 240]) {
  parts.push(`<line x1="-22" y1="${up(h)}" x2="-12" y2="${up(h)}" stroke="${ink}" stroke-width="0.8"/>`);
  parts.push(text(-25, up(h) + 3, String(h), { size: 8, anchor: "end" }));
}
parts.push(`<line x1="-17" y1="0" x2="-17" y2="${up(CEIL)}" stroke="${ink}" stroke-width="0.6"/>`);

// Widths along the floor (dimension text is big in lib, so scale it down here).
const dims = [dimH(0, 70, 28, "70"), dimH(70, 190, 28, "120"), dimH(200, 275, 28, "75"), dimH(275, 400, 28, "125")]
  .join("")
  .replace(/font-size="20"/g, 'font-size="10"');
parts.push(dims);

parts.push(text(-55, 70, "· ผนังนี้ไม่มีไฟซ่อน (ไฟซ่อนในห้องอยู่แค่ผนังยาวสองด้าน) · ไฟซ่อนห้องน้ำอยู่หลังผนังห้องน้ำ ชิดผนังทิศใต้", { size: 8, anchor: "start" }));
parts.push(text(-55, 84, "· ไม่มีปลั๊กบนเคาน์เตอร์ ใช้ P4 ปลั๊กคู่เดียวสำหรับตู้เย็นกับไมโครเวฟ", { size: 8, anchor: "start" }));
parts.push(text(-55, 98, "· หน้าต่างครัวขอบล่าง 100 พ้นเคาน์เตอร์ 85 ได้ 15 ซม. · ที่คว่ำจานสูงเกิน 15 จะบังขอบล่างหน้าต่างนิดหน่อย", { size: 8, anchor: "start" }));
parts.push(text(-55, 124, "รูปด้านภายใน ผนังครัว · 21 พ.ย. 2026", { size: 10, anchor: "start" }));

const defs = `<pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${soft}" stroke-width="0.8"/></pattern>`;

// Drawn small in centimetres, so render it at twice the size of the other sheets.
export const wallSouth = svgDoc({ ...box, defs, body: parts.join("\n"), font: FONT }).replace(
  `width="${box.w}" height="${box.h}" font-family`,
  `width="${box.w * 2}" height="${box.h * 2}" font-family`
);
