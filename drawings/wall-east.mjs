/**
 * Interior elevation of the long wall with the sliding door, seen from inside
 * the room looking east towards the engawa, in centimetres.
 *
 * Horizontal: north on the left, south on the right, so x = 960 − plan y.
 * Vertical: height above the finished room floor, drawn upwards via up().
 * The lower half of the sheet is an enlarged face of the switch stack.
 */
import { FONT, dimH, text, svgDoc } from "./lib.mjs";

const L = 960;
const CEIL = 240;
const up = (h) => -h;
const X = (planY) => L - planY;

const ink = "#3b3a36";
const soft = "#8a877f";
const faint = "#c9c6bd";
const lamp = "#d9931f";
const lampFill = "#fff1cc";
const pw = "#2f6f9f";
const pwFill = "#e4eff8";

const parts = [];
parts.push(`<rect x="-80" y="-340" width="1140" height="1010" fill="#fbfaf6"/>`);

parts.push(text(-60, -300, "ผนังยาวฝั่งประตู · มองจากในห้องออกไปทางระเบียง", { size: 24, weight: 600, anchor: "start" }));
parts.push(text(-60, -274, "ซ้าย = ทิศเหนือ (ฝั่งทีวี) · ขวา = ทิศใต้ (ฝั่งครัว) · ความสูงวัดจากพื้นในห้อง", { size: 14, fill: soft, anchor: "start" }));

// Wall face, floor and ceiling.
parts.push(`<rect x="0" y="${up(CEIL)}" width="${L}" height="${CEIL}" fill="#ffffff" stroke="${ink}" stroke-width="1.6"/>`);
parts.push(`<line x1="-30" y1="0" x2="${L + 30}" y2="0" stroke="${ink}" stroke-width="2.4"/>`);
parts.push(text(L + 8, up(CEIL) + 5, "ฝ้า 240", { size: 12, fill: soft, anchor: "start" }));

// Hidden strip along the top of the wall.
parts.push(`<line x1="4" y1="${up(CEIL - 5)}" x2="${L - 4}" y2="${up(CEIL - 5)}" stroke="${lamp}" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/>`);
parts.push(text(480, up(CEIL - 5) + 18, "ไฟซ่อนชิดฝ้า ตลอดแนวผนัง", { size: 12, fill: lamp }));

// Sliding door: opening 340–620 in plan, which mirrors to the same span here; 200 high, four panels.
const d0 = X(620);
const d1 = X(340);
parts.push(`<rect x="${d0}" y="${up(200)}" width="${d1 - d0}" height="200" fill="#eef3f4" stroke="${ink}" stroke-width="1.6"/>`);
for (let i = 1; i < 4; i++) {
  const x = d0 + ((d1 - d0) / 4) * i;
  parts.push(`<line x1="${x}" y1="${up(200)}" x2="${x}" y2="0" stroke="${faint}" stroke-width="1.2"/>`);
}
parts.push(text((d0 + d1) / 2, up(110), "ประตูบานเลื่อน 280 × 200", { size: 13, fill: soft }));

// Fridge in the south corner, seen side on, faint.
parts.push(`<rect x="${X(57)}" y="${up(97)}" width="55" height="97" fill="none" stroke="${faint}" stroke-width="1.4" stroke-dasharray="6 4"/>`);
parts.push(text(X(30), up(50), "ตู้เย็น 97", { size: 12, fill: soft }));
// A microwave may sit on top of the fridge.
parts.push(`<rect x="${X(52)}" y="${up(125)}" width="40" height="28" fill="none" stroke="${faint}" stroke-width="1.4" stroke-dasharray="3 3"/>`);
parts.push(text(X(32), up(108), "ไมโครเวฟ?", { size: 10, fill: soft }));

// TV on its bracket: plan 720–900, so 60–240 here. 65" ≈ 145 × 83, bottom at 75.
const tv = { x: 150 - 72.5, w: 145, b: 75, h: 83 };
parts.push(`<rect x="${tv.x}" y="${up(tv.b + tv.h)}" width="${tv.w}" height="${tv.h}" rx="2" fill="#2f2e2b" fill-opacity="0.12" stroke="${ink}" stroke-width="1.6"/>`);
parts.push(text(150, up(146), "ทีวีแขวน", { size: 13, fill: soft }));
// Bracket, dashed behind the screen.
parts.push(`<rect x="120" y="${up(130)}" width="60" height="30" fill="none" stroke="${soft}" stroke-width="1.2" stroke-dasharray="4 3"/>`);
parts.push(text(150, up(130) + 13, "ขาแขวน", { size: 10, fill: soft }));

function outlet(cx, h, { hidden = false } = {}) {
  const y = up(h);
  return `<rect x="${cx - 6}" y="${y - 4}" width="12" height="8" rx="1.5" fill="${hidden ? "none" : pwFill}" stroke="${pw}" stroke-width="1.4"${hidden ? ` stroke-dasharray="2 2"` : ""}/>`;
}
function label(x, h, lines, { anchor = "start", fill = pw } = {}) {
  return lines.map((t, i) => text(x, up(h) + 4 + i * 15, t, { size: 12.5, weight: i ? 400 : 600, anchor, fill: i ? ink : fill })).join("");
}

// P1: one double, hidden behind the TV under the bracket.
parts.push(outlet(150, 95, { hidden: true }));
parts.push(label(150, 64, ["P1 ปลั๊กคู่ 1 ตัว (เส้นประ = ซ่อนหลังทีวี)", "ใต้ขาแขวน · สูง 95"], { anchor: "middle" }));

// Switch stack between the TV and the door: plan y ≈ 650 → x 310.
const sx = X(650);
const plate = (cy, gangs, color) => {
  const w = 12;
  const h = 7.2;
  let s = `<rect x="${sx - w / 2}" y="${up(cy) - h / 2}" width="${w}" height="${h}" rx="0.8" fill="${lampFill}" stroke="${color}" stroke-width="1.2"/>`;
  for (let i = 1; i < gangs; i++) {
    const x = sx - w / 2 + (w / gangs) * i;
    s += `<line x1="${x}" y1="${up(cy) - h / 2}" x2="${x}" y2="${up(cy) + h / 2}" stroke="${color}" stroke-width="0.6"/>`;
  }
  return s;
};
parts.push(plate(124.5, 3, lamp));
// S2: a plain plate, white, one small rocker in the middle.
parts.push(`<rect x="${sx - 6}" y="${up(115.5) - 3.6}" width="12" height="7.2" rx="0.8" fill="#fff" stroke="${lamp}" stroke-width="1.2"/>`);
parts.push(`<rect x="${sx - 1.2}" y="${up(115.5) - 2}" width="2.4" height="4" rx="0.4" fill="${lampFill}" stroke="${lamp}" stroke-width="0.7"/>`);
parts.push(`<line x1="${sx}" y1="${up(129)}" x2="${sx - 4}" y2="${up(178)}" stroke="${lamp}" stroke-width="0.8"/>`);
parts.push(label(sx - 8, 206, ["S1 Tuya 3 ช่อง (บน)", "S2 สวิตช์ 2 ทาง (ล่าง)", "กึ่งกลางชุด 120"], { anchor: "end", fill: lamp }));

// P2 straight under the switches.
parts.push(outlet(sx, 40));
parts.push(`<line x1="${sx}" y1="${up(46)}" x2="${sx}" y2="${up(110)}" stroke="${faint}" stroke-width="0.8" stroke-dasharray="3 3"/>`);
parts.push(label(sx - 12, 40, ["P2 ปลั๊กคู่", "ใต้สวิตช์ · สูง 40"], { anchor: "end" }));



// Heights, on a scale at the left.
for (const h of [40, 95, 120, 200, 240]) {
  parts.push(`<line x1="-26" y1="${up(h)}" x2="-14" y2="${up(h)}" stroke="${ink}" stroke-width="1"/>`);
  parts.push(text(-30, up(h) + 4, String(h), { size: 12, anchor: "end" }));
}
parts.push(`<line x1="-20" y1="0" x2="-20" y2="${up(CEIL)}" stroke="${ink}" stroke-width="0.8"/>`);

// Horizontal positions.
parts.push(dimH(0, 60, 40, "60"));
parts.push(dimH(60, 240, 40, "ทีวี 180"));
parts.push(dimH(240, sx, 40, "70"));
parts.push(dimH(sx, d0, 40, "30"));
parts.push(dimH(d0, d1, 40, "280"));
parts.push(dimH(d1, L, 40, "340"));

// ---- enlarged switch face ---------------------------------------------
const S = 16; // px per cm in the detail
const ox = 40;
const oy = 150;
parts.push(text(-60, oy - 26, "หน้าสวิตช์ขยาย · Tuya WiFi 3 ช่อง (บน) · สวิตช์ 2 ทางธรรมดา (ล่าง)", { size: 18, weight: 600, anchor: "start" }));
function bigPlate(y, buttons) {
  const w = 12 * S;
  const h = 7.2 * S;
  parts.push(`<rect x="${ox}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${ink}" stroke-width="2"/>`);
  const bw = w / buttons.length;
  buttons.forEach(([n, t1, t2, color], i) => {
    const x = ox + bw * i;
    if (i) parts.push(`<line x1="${x}" y1="${y + 8}" x2="${x}" y2="${y + h - 8}" stroke="${faint}" stroke-width="1.4"/>`);
    parts.push(`<circle cx="${x + bw / 2}" cy="${y + 20}" r="2.5" fill="${faint}"/>`);
    parts.push(text(x + bw / 2, y + h / 2 + 12, n, { size: 28, weight: 700, fill: color }));
    // Callout on the right.
  });
  return h;
}
const h1 = bigPlate(oy, [["1", "", "", lamp], ["2", "", "", lamp], ["3", "", "", lamp]]);
{
  // S2 enlarged: plain plate with one rocker in the centre.
  const y = oy + h1 + 14;
  const w = 12 * S;
  const h = 7.2 * S;
  parts.push(`<rect x="${ox}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${ink}" stroke-width="2"/>`);
  const rw = 2.4 * S;
  const rh = 4 * S;
  const rx = ox + w / 2 - rw / 2;
  const ry = y + h / 2 - rh / 2;
  parts.push(`<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="4" fill="#f6f4ef" stroke="${ink}" stroke-width="1.6"/>`);
  parts.push(`<line x1="${rx + 4}" y1="${ry + rh / 2}" x2="${rx + rw - 4}" y2="${ry + rh / 2}" stroke="${faint}" stroke-width="1.2"/>`);
  parts.push(text(ox + w / 2 + rw / 2 + 14, y + h / 2 + 5, "2 ทาง", { size: 13, fill: soft, anchor: "start" }));
}

const lx = ox + 12 * S + 40;
const rows = [
  [oy + 18, "S1 · 3 ช่อง", lamp, true],
  [oy + 44, "1 ซ้าย   โคม L1 โซนโซฟา", ink],
  [oy + 66, "2 กลาง   ไฟซ่อนในห้องทั้งหมด (ผนังยาวสองด้าน)", ink],
  [oy + 88, "3 ขวา    โคม L2 เหนือโต๊ะกินข้าว", ink],
  [oy + h1 + 32, "S2 · สวิตช์ 2 ทางธรรมดา 1 ช่อง", lamp, true],
  [oy + h1 + 58, "ไฟระเบียงทั้งหมด: LED strip ใต้เดค + โคมกล่องไม้ 2 ดวง", ink],
  [oy + h1 + 80, "คู่กับ S4 นอกบ้าน โยงสาย 2 เส้น · กดได้ทั้งสองจุดแม้เน็ตล่ม", ink],
  [oy + h1 + 102, "ไม่ได้ต่อกับแอป · ปุ่มฉากเปิด/ปิด S1 ทั้งหมด ย้ายไปตั้งในแอปแทน", soft],
];
for (const [y, t, c, bold] of rows) parts.push(text(lx, y, t, { size: 15, weight: bold ? 600 : 400, anchor: "start", fill: c }));

// Notes.
const ny = oy + 2 * h1 + 70;
const notes = [
  "S1 Tuya ต้องมีสาย N (Require Neutral) · สั่งช่างเดินสาย L + N เข้ากล่อง S1 และ S3 หน้าห้องน้ำ (ปกติช่างเดินแค่ L) · S2 S4 ธรรมดาไม่ต้องมี N",
  "กล่องฝังผนังขนาด 2×4 นิ้ว 2 กล่องซ้อนกันแนวตั้ง · ระยะกึ่งกลางกล่องห่างกัน ~9 ซม. ให้หน้ากากไม่ชนกัน · เช็กขนาดหน้ากากจริงก่อนฝังกล่อง",
  "ด้านนอกผนังนี้ บนระเบียง: S4 สวิตช์ 2 ทางธรรมดา สูง 120 หลัง S2 · P10 ปลั๊กกันน้ำ สูง 40 แนวเดียวกับ P2",
];
notes.forEach((t, i) => parts.push(text(-60, ny + i * 22, "· " + t, { size: 13.5, anchor: "start", fill: i ? ink : "#b3412c" })));
parts.push(text(-60, ny + notes.length * 22 + 30, "รูปด้านภายใน ผนังฝั่งประตู · 21 พ.ย. 2026", { size: 16, anchor: "start" }));

export const wallEast = svgDoc({ x: -80, y: -340, w: 1140, h: 1010, body: parts.join("\n"), font: FONT });
