/**
 * The electrical shopping list as one sheet, read from lib/electrical.ts so
 * the page and the picture never disagree. Units here are pixels at 1×.
 */
import { FONT, text, svgDoc } from "./lib.mjs";
import { shopping, outlets, switches, circuits } from "../lib/electrical.ts";

const ink = "#2b2825";
const soft = "#68625c";
const line = "#ddd8d0";
const lineSoft = "#eae6e0";
const lamp = "#d9931f";
const pw = "#2f6f9f";
const wood = "#846340";

const W = 1240;
const pad = 40;
const colW = (W - pad * 2 - 24) / 2;
const parts = [];

// Header.
parts.push(text(pad, 62, "รายการของ · ระบบไฟฟ้า", { size: 30, weight: 600, anchor: "start", fill: ink }));
parts.push(text(pad, 92, "ห้องนั่งเล่น 4 × 9.6 ม. + ระเบียง · ความยาวเป็นตัวเลขประมาณจากแบบ ให้ช่างวัดยืนยันก่อนสั่ง", { size: 14, anchor: "start", fill: soft }));

// Headline counts.
const lamps = 4; // L1 L2 + two wooden-box deck lamps
const stats = [
  [String(outlets.length), "ปลั๊กคู่", pw],
  [String(switches.length), "สวิตช์", lamp],
  [String(lamps), "โคม", lamp],
  [String(circuits.length), "วงจร", ink],
];
const sw = (W - pad * 2 - 3 * 16) / 4;
stats.forEach(([n, label, color], i) => {
  const x = pad + i * (sw + 16);
  parts.push(`<rect x="${x}" y="116" width="${sw}" height="78" rx="10" fill="#fcfbf8" stroke="${line}" stroke-width="1.2"/>`);
  parts.push(text(x + 22, 170, n, { size: 40, weight: 600, anchor: "start", fill: color }));
  parts.push(text(x + 22 + n.length * 24 + 10, 168, label, { size: 17, anchor: "start", fill: ink }));
});

// Groups in two columns, filled top to bottom, each column taking the next
// group where it is shorter.
const HEAD = 44;
const ROW = 48;
const GAP = 18;
const cols = [214, 214];
const accent = (title) => (title.startsWith("ปลั๊ก") ? pw : title.startsWith("สวิตช์") || title.startsWith("ไฟ") ? lamp : wood);
for (const group of shopping) {
  const c = cols[0] <= cols[1] ? 0 : 1;
  const x = pad + c * (colW + 24);
  const y = cols[c];
  const h = HEAD + group.lines.length * ROW + 6;
  parts.push(`<rect x="${x}" y="${y}" width="${colW}" height="${h}" rx="10" fill="#fcfbf8" stroke="${line}" stroke-width="1.2"/>`);
  parts.push(`<rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${accent(group.title)}"/>`);
  parts.push(text(x + 22, y + 29, group.title, { size: 16, weight: 600, anchor: "start", fill: ink }));
  parts.push(`<line x1="${x + 14}" y1="${y + HEAD}" x2="${x + colW - 14}" y2="${y + HEAD}" stroke="${lineSoft}" stroke-width="1"/>`);
  group.lines.forEach((l, i) => {
    const ry = y + HEAD + i * ROW;
    if (i) parts.push(`<line x1="${x + 22}" y1="${ry}" x2="${x + colW - 14}" y2="${ry}" stroke="${lineSoft}" stroke-width="1"/>`);
    parts.push(text(x + 22, ry + (l.note ? 21 : 29), l.item, { size: 14.5, anchor: "start", fill: ink }));
    if (l.note) parts.push(text(x + 22, ry + 39, l.note, { size: 12, anchor: "start", fill: soft }));
    parts.push(text(x + colW - 20, ry + 30, l.qty, { size: 17, weight: 600, anchor: "end", fill: ink }));
  });
  cols[c] += h + GAP;
}

const H = Math.max(...cols) + 60;
parts.push(text(pad, H - 28, "สรุป 22 พ.ย. 2026 · รหัส S P L ตรงกับผังปลั๊ก-สวิตช์", { size: 13, anchor: "start", fill: soft }));
parts.unshift(`<rect x="0" y="0" width="${W}" height="${H}" fill="#f5f2ed"/>`);

export const shoppingSheet = svgDoc({ x: 0, y: 0, w: W, h: H, body: parts.join("\n"), font: FONT });
