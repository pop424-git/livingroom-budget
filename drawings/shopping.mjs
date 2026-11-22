/**
 * The electrical shopping list as phone-portrait sheets, read from
 * lib/electrical.ts so the page and the pictures never disagree. Two sheets,
 * each about the shape of a phone screen. Units here are pixels at 1×.
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

const W = 720;
const pad = 28;
const colW = W - pad * 2;

const accent = (title) =>
  title.startsWith("ปลั๊ก") ? pw : title.startsWith("สวิตช์") || title.startsWith("ไฟ") ? lamp : wood;

/** Splits a long item at the last space before `max` characters. */
function wrap(item, max = 34) {
  if (item.length <= max + 2) return [item];
  const cut = item.lastIndexOf(" ", max);
  return cut > 0 ? [item.slice(0, cut), item.slice(cut + 1)] : [item];
}

function sheet(groups, page, pages, withStats) {
  const parts = [];
  parts.push(text(pad, 58, "รายการของ · ระบบไฟฟ้า", { size: 30, weight: 600, anchor: "start", fill: ink }));
  parts.push(text(W - pad, 58, `${page}/${pages}`, { size: 18, anchor: "end", fill: soft }));
  parts.push(text(pad, 88, "ห้องนั่งเล่น 4 × 9.6 ม. + ระเบียง", { size: 16, anchor: "start", fill: soft }));
  let y = 112;

  if (withStats) {
    const lamps = 4; // L1 L2 + two wooden-box deck lamps
    const stats = [
      [String(outlets.length), "ปลั๊กคู่", pw],
      [String(switches.length), "สวิตช์", lamp],
      [String(lamps), "โคม", lamp],
      [String(circuits.length), "วงจร", ink],
    ];
    const sw = (colW - 14) / 2;
    stats.forEach(([n, label, color], i) => {
      const x = pad + (i % 2) * (sw + 14);
      const sy = y + 12 + Math.floor(i / 2) * 90;
      parts.push(`<rect x="${x}" y="${sy}" width="${sw}" height="76" rx="12" fill="#fcfbf8" stroke="${line}" stroke-width="1.2"/>`);
      parts.push(text(x + 22, sy + 54, n, { size: 42, weight: 600, anchor: "start", fill: color }));
      parts.push(text(x + 22 + n.length * 26 + 12, sy + 51, label, { size: 20, anchor: "start", fill: ink }));
    });
    y += 12 + 2 * 90 + 6;
  } else {
    y += 14;
  }

  const HEAD = 54;
  for (const group of groups) {
    const rows = group.lines.map((l) => {
      const lines = wrap(l.item);
      return { ...l, lines, h: 30 + lines.length * 22 + (l.note ? 20 : 0) };
    });
    const h = HEAD + rows.reduce((a, r) => a + r.h, 0) + 6;
    const x = pad;
    parts.push(`<rect x="${x}" y="${y}" width="${colW}" height="${h}" rx="12" fill="#fcfbf8" stroke="${line}" stroke-width="1.2"/>`);
    parts.push(`<rect x="${x}" y="${y}" width="7" height="${h}" rx="3.5" fill="${accent(group.title)}"/>`);
    parts.push(text(x + 24, y + 35, group.title, { size: 19, weight: 600, anchor: "start", fill: ink }));
    let ry = y + HEAD;
    parts.push(`<line x1="${x + 16}" y1="${ry}" x2="${x + colW - 16}" y2="${ry}" stroke="${lineSoft}" stroke-width="1"/>`);
    rows.forEach((r, i) => {
      if (i) parts.push(`<line x1="${x + 24}" y1="${ry}" x2="${x + colW - 16}" y2="${ry}" stroke="${lineSoft}" stroke-width="1"/>`);
      r.lines.forEach((t, k) => parts.push(text(x + 24, ry + 32 + k * 22, t, { size: 17, anchor: "start", fill: ink })));
      if (r.note) parts.push(text(x + 24, ry + 32 + r.lines.length * 22, r.note, { size: 14, anchor: "start", fill: soft }));
      parts.push(text(x + colW - 20, ry + 34, r.qty, { size: 21, weight: 600, anchor: "end", fill: ink }));
      ry += r.h;
    });
    y += h + 20;
  }

  const H = y + 40;
  parts.push(text(pad, H - 22, "สรุป 22 พ.ย. 2026 · ความยาวเป็นตัวเลขประมาณ ให้ช่างวัดก่อนสั่ง", { size: 14, anchor: "start", fill: soft }));
  parts.unshift(`<rect x="0" y="0" width="${W}" height="${H}" fill="#f5f2ed"/>`);
  return svgDoc({ x: 0, y: 0, w: W, h: H, body: parts.join("\n"), font: FONT });
}

// Page 1: the counts, outlets, switches and boxes. Page 2: lights, the
// consumer unit and cable.
const split = shopping.findIndex((g) => g.title.startsWith("ไฟ"));
export const shoppingPages = [
  sheet(shopping.slice(0, split), 1, 2, true),
  sheet(shopping.slice(split), 2, 2, false),
];
