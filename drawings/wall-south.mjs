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

// Kitchen window 100 × 100 centred on the counter, sill 100, with room each
// side and above for a bamboo roll blind.
parts.push(rect(79, 100, 100, 100, `fill="#eef3f4" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<line x1="129" y1="${up(100)}" x2="129" y2="${up(200)}" stroke="${faint}" stroke-width="1"/>`);
parts.push(text(129, up(150), "หน้าต่างครัว 100 × 100", { size: 7.5, fill: soft }));

// IKEA KNOXHULT 122 × 61 × 85: body 120, top 122 × 2.9, three door sections
// of 40. The drawer moves to the left-hand section, leaving the right-hand
// section clear under the sink.
parts.push(rect(69, 0, 120, 82.1, `fill="#ffffff" stroke="${ink}" stroke-width="1.2"`));
parts.push(rect(68, 82.1, 122, 2.9, `fill="#d9b47e" stroke="${ink}" stroke-width="0.8"`));
for (const x of [109, 149]) parts.push(`<line x1="${x}" y1="${up(80)}" x2="${x}" y2="${up(6)}" stroke="${soft}" stroke-width="0.8"/>`);
parts.push(`<line x1="69" y1="${up(6)}" x2="189" y2="${up(6)}" stroke="${faint}" stroke-width="0.8"/>`);
// The small drawer, in the left-hand section by the fridge.
parts.push(rect(70, 70, 38, 10, `fill="none" stroke="${soft}" stroke-width="0.9"`));
parts.push(`<line x1="84" y1="${up(75)}" x2="94" y2="${up(75)}" stroke="${soft}" stroke-width="1"/>`);
parts.push(text(89, up(64), "ลิ้นชัก", { size: 6.5, fill: soft }));
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

// Symbols are drawn larger than life so they read at a glance.
const big = (cx, cyUp, k, body) => `<g transform="translate(${cx} ${cyUp}) scale(${k}) translate(${-cx} ${-cyUp})">${body}</g>`;
// P3, the kitchen's only outlet: a double upright in the gap between the
// fridge and the counter, beside the microwave. Lower socket: the fridge,
// always in. Upper socket: the microwave or kettle, plugged in when used.
parts.push(big(66, up(115.5), 1.6, rect(62.5, 110, 7, 11, `rx="1" fill="${pwFill}" stroke="${pw}" stroke-width="1"`) + [113, 118].map((h) => `<circle cx="66" cy="${up(h)}" r="1.4" fill="none" stroke="${pw}" stroke-width="0.6"/>`).join("")));
parts.push(`<line x1="64" y1="${up(121)}" x2="56" y2="${up(138)}" stroke="${pw}" stroke-width="0.6"/>`);
parts.push(label(6, 166, ["P3 ปลั๊กคู่ แนวตั้ง", "ขอบล่าง 110", "บน ไมโครเวฟ", "ล่าง ตู้เย็น"]));

// Consumer unit over the fridge.
parts.push(rect(12, 170, 36, 40, `fill="#d8d5cc" stroke="${ink}" stroke-width="1.2"`));
parts.push(`<line x1="12" y1="${up(210)}" x2="48" y2="${up(170)}" stroke="${ink}" stroke-width="0.6"/>`);
parts.push(label(6, 228, ["ตู้ไฟ ขอบล่าง 170 · บน 210"], { fill: ink }));

// Toilet partition end, 190–200.
parts.push(rect(190, 0, 10, CEIL, `fill="url(#hatch)" stroke="${ink}" stroke-width="1"`));

// Bamboo roll blind over the window head, 5 past each side.
parts.push(rect(74, 202, 110, 8, `rx="4" fill="#efe3c6" stroke="#b89a5e" stroke-width="1" stroke-dasharray="3 2"`));
parts.push(text(129, up(214), "มู่ลี่ไม้ไผ่ เลยกรอบข้างละ 5", { size: 7, fill: "#8a6d35" }));

// Toilet's north partition, the nearer plane, 200–400 with its door 205–285.
parts.push(rect(200, 0, 200, CEIL, `fill="#f1efe9" stroke="${ink}" stroke-width="1.4"`));
parts.push(text(330, up(222), "ผนังห้องน้ำ (ยื่นออกมาจากผนังครัว 160)", { size: 7.5, fill: soft }));
// Frame ~5 each side around an 80 uPVC leaf: light oak grain, two
// aluminium grooves on the latch side, round knob.
parts.push(rect(200, 0, 90, 205, `fill="#f6f4ef" stroke="${ink}" stroke-width="1.2"`));
parts.push(rect(205, 0, 80, 200, `fill="#e9d8b8" stroke="${ink}" stroke-width="1.2"`));
for (const x of [261, 268]) parts.push(`<line x1="${x}" y1="${up(196)}" x2="${x}" y2="${up(4)}" stroke="#a9a59c" stroke-width="0.9"/>`);
parts.push(`<circle cx="277" cy="${up(100)}" r="2.6" fill="#fff" stroke="${ink}" stroke-width="0.9"/>`);
parts.push(text(232, up(150), "ประตู uPVC 80", { size: 7.5, fill: soft }));
parts.push(text(232, up(140), "บานพับซ้าย", { size: 7, fill: soft }));

// S3 on the latch side.
parts.push(big(308, up(119.6), 1.8, rect(302, 116, 12, 7.2, `rx="0.8" fill="${lampFill}" stroke="${lamp}" stroke-width="1"`) + `<line x1="${308}" y1="${up(116)}" x2="${308}" y2="${up(123.2)}" stroke="${lamp}" stroke-width="0.6"/>`));
parts.push(label(322, 124, ["S3 Tuya 2 ช่อง สูง 120", "1 ไฟซ่อนห้องน้ำ", "2 พัดลมดูดอากาศ"], { fill: lamp }));

// Floor and ceiling.
parts.push(`<line x1="-15" y1="0" x2="${W + 15}" y2="0" stroke="${ink}" stroke-width="2"/>`);
parts.push(text(W + 4, up(CEIL) + 4, "ฝ้า 240", { size: 8, fill: soft, anchor: "start" }));

// Height scale.
for (const h of [97, 110, 170, 200, 240]) {
  parts.push(`<line x1="-22" y1="${up(h)}" x2="-12" y2="${up(h)}" stroke="${ink}" stroke-width="0.8"/>`);
  parts.push(text(-25, up(h) + 3, String(h), { size: 8, anchor: "end" }));
}
parts.push(`<line x1="-17" y1="0" x2="-17" y2="${up(CEIL)}" stroke="${ink}" stroke-width="0.6"/>`);

// Widths along the floor (dimension text is big in lib, so scale it down here).
const dims = [dimH(0, 68, 28, "68"), dimH(68, 190, 28, "122"), dimH(200, 290, 28, "วงกบ 90"), dimH(290, 400, 28, "110")]
  .join("")
  .replace(/font-size="20"/g, 'font-size="10"');
parts.push(dims);

parts.push(text(-55, 70, "· ผนังนี้ไม่มีไฟซ่อน (ไฟซ่อนในห้องอยู่แค่ผนังยาวสองด้าน) · ไฟซ่อนห้องน้ำอยู่หลังผนังห้องน้ำ ชิดผนังทิศใต้", { size: 8, anchor: "start" }));
parts.push(text(-55, 84, "· ไม่มีปลั๊กบนเคาน์เตอร์ · P3 ปลั๊กคู่จุดเดียวของครัว: ช่องล่างตู้เย็นเสียบค้าง ช่องบนไมโครเวฟ/กาต้มน้ำ · ลิ้นชักย้ายไปช่องซ้าย ซิงก์ช่องขวาโล่ง ท่อน้ำเข้า-ทิ้งเจาะผ่านแผ่นหลังตู้ฝั่งห้องน้ำ", { size: 8, anchor: "start" }));
parts.push(text(-55, 98, "· หน้าต่างครัวขอบล่าง 100 พ้นเคาน์เตอร์ 85 ได้ 15 ซม. · ที่คว่ำจานสูงเกิน 15 จะบังขอบล่างหน้าต่างนิดหน่อย", { size: 8, anchor: "start" }));
parts.push(text(-55, 124, "รูปด้านภายใน ผนังครัว · 22 พ.ย. 2026", { size: 10, anchor: "start" }));

const defs = `<pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${soft}" stroke-width="0.8"/></pattern>`;

// Drawn small in centimetres, so render it at twice the size of the other sheets.
export const wallSouth = svgDoc({ ...box, defs, body: parts.join("\n"), font: FONT }).replace(
  `width="${box.w}" height="${box.h}" font-family`,
  `width="${box.w * 2}" height="${box.h * 2}" font-family`
);
