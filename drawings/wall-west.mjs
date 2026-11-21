/**
 * Interior elevation of the long wall on the sofa and toilet side, seen from
 * inside the room looking west, in centimetres.
 *
 * Horizontal is the plan's y: south (the toilet and kitchen) on the left at 0,
 * north (the sofa) on the right at 960. Vertical is height above the finished
 * room floor, via up().
 */
import { FONT, dimH, text, svgDoc } from "./lib.mjs";

const L = 960;
const CEIL = 240;
const up = (h) => -h;

const ink = "#3b3a36";
const soft = "#8a877f";
const faint = "#c9c6bd";
const lamp = "#d9931f";
const pw = "#2f6f9f";
const pwFill = "#e4eff8";
const furn = `fill="#f4f2ec" stroke="${faint}" stroke-width="1.4"`;

const parts = [];
parts.push(`<rect x="-80" y="-340" width="1140" height="560" fill="#fbfaf6"/>`);

parts.push(text(-60, -300, "ผนังยาวฝั่งโซฟา-ห้องน้ำ · มองจากในห้องไปทางทิศตะวันตก", { size: 24, weight: 600, anchor: "start" }));
parts.push(text(-60, -274, "ซ้าย = ทิศใต้ (ครัว ห้องน้ำ) · ขวา = ทิศเหนือ (โซฟา) · ความสูงวัดจากพื้นในห้อง", { size: 14, fill: soft, anchor: "start" }));

const rect = (x, h0, w, h, attrs) => `<rect x="${x}" y="${up(h0 + h)}" width="${w}" height="${h}" ${attrs}/>`;
const label = (x, h, lines, { anchor = "start", fill = pw } = {}) =>
  lines.map((t, i) => text(x, up(h) + 4 + i * 15, t, { size: 12.5, weight: i ? 400 : 600, anchor, fill: i ? ink : fill })).join("");

// Wall face.
parts.push(rect(0, 0, L, CEIL, `fill="#ffffff" stroke="${ink}" stroke-width="1.6"`));
parts.push(`<line x1="-30" y1="0" x2="${L + 30}" y2="0" stroke="${ink}" stroke-width="2.4"/>`);
parts.push(text(L + 8, up(CEIL) + 5, "ฝ้า 240", { size: 12, fill: soft, anchor: "start" }));

// The toilet box stands in front of this wall at its south end: 0–160.
parts.push(rect(0, 0, 160, CEIL, `fill="#efede7" stroke="${ink}" stroke-width="1.4"`));
parts.push(rect(0, 0, 61, 85, furn));
parts.push(text(80, up(150), "ผนังห้องน้ำ", { size: 13, fill: soft }));
parts.push(text(80, up(132), "(ไม่มีปลั๊ก)", { size: 11, fill: soft }));
parts.push(text(30, up(45), "เคาน์เตอร์", { size: 10, fill: soft }));

// Hidden strip along the top, from the toilet partition to the north corner.
parts.push(`<line x1="166" y1="${up(CEIL - 5)}" x2="${L - 4}" y2="${up(CEIL - 5)}" stroke="${lamp}" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/>`);
parts.push(text(560, up(CEIL - 5) + 18, "ไฟซ่อนชิดฝ้า", { size: 12, fill: lamp }));

// Dining: chairs on the toilet side (back to the south), table end on the wall, bench.
for (const [y0, y1] of [[273, 315]]) {
  parts.push(rect(y0, 0, y1 - y0, 45, furn));
  parts.push(rect(y0, 45, 6, 40, furn));
}
parts.push(rect(323, 67, 100, 3, `fill="#e3d7bf" stroke="${faint}" stroke-width="1.4"`));
parts.push(`<path d="M330 ${up(67)} V0 M416 ${up(67)} V0" stroke="${faint}" stroke-width="3"/>`);
parts.push(rect(428, 0, 40, 45, furn));
parts.push(text(373, up(30), "โต๊ะกินข้าว", { size: 11, fill: soft }));

// P6 centred on the table end, just under its top so it never shows above it.
parts.push(rect(367, 56, 12, 8, `rx="1.5" fill="${pwFill}" stroke="${pw}" stroke-width="1.4"`));
parts.push(label(373, 130, ["P6 ปลั๊กคู่", "กึ่งกลางโต๊ะ · สูง 60 ใต้ท็อป"], { anchor: "middle" }));

// Armchair, back to the wall; P8 behind its middle, low.
parts.push(rect(580, 0, 75, 42, furn));
parts.push(rect(580, 42, 75, 38, furn));
parts.push(text(617, up(55), "อาร์มแชร์", { size: 11, fill: soft }));
parts.push(rect(611, 26, 12, 8, `rx="1.5" fill="none" stroke="${pw}" stroke-width="1.4" stroke-dasharray="2 2"`));
parts.push(label(617, 120, ["P8 ปลั๊กคู่", "หลังอาร์มแชร์ · สูง 30"], { anchor: "middle" }));
parts.push(`<line x1="617" y1="${up(36)}" x2="617" y2="${up(103)}" stroke="${pw}" stroke-width="0.8"/>`);

// Sofa, back to the wall, chaise at the north end.
parts.push(rect(660, 0, 280, 42, furn));
parts.push(rect(660, 42, 280, 38, furn));
parts.push(text(800, up(55), "โซฟา 280", { size: 11, fill: soft }));
parts.push(text(800, up(140), "ไม่มีปลั๊กหลังโซฟา", { size: 11, fill: soft }));

// Height scale.
for (const h of [30, 60, 70, 240]) {
  parts.push(`<line x1="-26" y1="${up(h)}" x2="-14" y2="${up(h)}" stroke="${ink}" stroke-width="1"/>`);
  parts.push(text(-30, up(h) + 4, String(h), { size: 12, anchor: "end" }));
}
parts.push(`<line x1="-20" y1="0" x2="-20" y2="${up(CEIL)}" stroke="${ink}" stroke-width="0.8"/>`);

// Positions along the wall.
parts.push(dimH(0, 160, 40, "ห้องน้ำ 160"));
parts.push(dimH(160, 373, 40, "213"));
parts.push(dimH(373, 617, 40, "244"));
parts.push(dimH(617, L, 40, "343"));

parts.push(text(-60, 120, "· ปลั๊กผนังนี้มี 2 จุด: P6 กึ่งกลางปลายโต๊ะกินข้าว · P8 กึ่งกลางหลังอาร์มแชร์", { size: 13.5, anchor: "start" }));
parts.push(text(-60, 144, "· P6 สูง 60 = ต่ำกว่าท็อปโต๊ะ (70) 10 ซม. มองไม่เห็นเหนือโต๊ะ แต่ล้วงมือใต้ขอบโต๊ะเสียบได้ไม่ต้องก้มมุด", { size: 13.5, anchor: "start" }));
parts.push(text(-60, 186, "รูปด้านภายใน ผนังฝั่งโซฟา-ห้องน้ำ · 21 พ.ย. 2026", { size: 16, anchor: "start" }));

export const wallWest = svgDoc({ x: -80, y: -340, w: 1140, h: 560, body: parts.join("\n"), font: FONT });
