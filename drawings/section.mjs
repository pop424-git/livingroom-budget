/**
 * Cross section across the 400 cm width, in centimetres.
 *
 * Horizontal is the plan's x: 0 is the front wall under the ridge, the engawa
 * runs out to -200 on the left, the room to 400 on the right. Vertical is
 * height above the finished floor, drawn upwards through up(). The north wall
 * and its three-panel sliding window stand behind the cut. With the deck on the
 * left this is strictly the view looking south, so the north wall is shown
 * mirrored; looking north for real would put the deck on the right.
 */
import { FONT, dimH, dimV, text, svgDoc } from "./lib.mjs";

const up = (h) => -h; // height above floor → SVG y

const W = 400; // room width
const DECK = 200;
const EAVE_L = 50; // overhang past the deck post
const EAVE_R = 100; // overhang past the west wall
const RIDGE = 400;
const EAVE_H = 200; // both eaves end at the same height
const FLOOR = 45; // floor raised above the ground

const ink = "#2f2e2b";
const soft = "#8a877f";
const red = "#c0453a";
const green = "#2f8a63";
const wood = "#e8c287";
const woodDark = "#b8743f";
const lamp = "#d9931f";
const lampFill = "#fff1cc";

// Pendant under the rafter, 100 out from the front wall; bottom at +2.10.
const pendant = { x: -100, bottom: 210, h: 34, r: 16 };

const slopeL = (RIDGE - EAVE_H) / (DECK + EAVE_L);
const slopeR = (RIDGE - EAVE_H) / (W + EAVE_R);
const deg = (t) => ((Math.atan(t) * 180) / Math.PI).toFixed(1);
const roofAt = (x) => (x < 0 ? RIDGE + x * slopeL : RIDGE - x * slopeR);

// North window: three-panel slider, 180 × 110, sill at 90 so its head lines up
// with the front door head at 200.
const win = { x0: 100, x1: 280, sill: 90, h: 110 };

const parts = [];
parts.push(`<rect x="-330" y="-480" width="1040" height="790" fill="#ffffff"/>`);

// Ground and floor deck on piers.
parts.push(`<rect x="-330" y="${FLOOR}" width="1040" height="14" fill="url(#ground)"/>`);
parts.push(`<line x1="-300" y1="${FLOOR}" x2="660" y2="${FLOOR}" stroke="${ink}" stroke-width="2.5"/>`);
for (const x of [-DECK - 7, -7, 193, W - 15]) {
  parts.push(`<rect x="${x}" y="18" width="15" height="${FLOOR - 18}" fill="#d9d9d6" stroke="${ink}" stroke-width="1"/>`);
}
parts.push(`<rect x="${-DECK - 12}" y="0" width="${DECK + W + 20}" height="18" fill="#e6e6e3" stroke="${ink}" stroke-width="1.2"/>`);

// Steps at the end of the deck, beyond the cut: two risers of 15 down to the
// ground, as wide as the deck.
const step = "#e9e2d6";
parts.push(`<rect x="${-DECK}" y="15" width="${DECK}" height="15" fill="${step}" stroke="${ink}" stroke-width="1"/>`);
parts.push(`<rect x="${-DECK}" y="30" width="${DECK}" height="15" fill="${step}" stroke="${ink}" stroke-width="1"/>`);
parts.push(text(-DECK / 2, 42, "บันได 2 ขั้น กว้าง 2.00", { size: 12, fill: ink }));
// LED strip under each nosing, the full 2.00 of the step.
for (const y of [16.5, 31.5]) {
  parts.push(`<line x1="${-DECK + 3}" y1="${y}" x2="-3" y2="${y}" stroke="${lamp}" stroke-width="2.5" stroke-linecap="round"/>`);
}

// The room, cut: front wall under the ridge, west wall at 400, roof between.
parts.push(
  `<path d="M0 0 V${up(RIDGE)} L${W} ${up(roofAt(W))} V0 Z" fill="#fafaf9" stroke="${ink}" stroke-width="1.5"/>`
);

// Deck post carrying the eave.
parts.push(`<rect x="${-DECK - 6}" y="${up(roofAt(-DECK))}" width="12" height="${roofAt(-DECK)}" fill="#f1f1ef" stroke="${ink}" stroke-width="1.2"/>`);

// Window in the north wall beyond the cut: outer frame, three sashes, handles.
{
  const { x0, x1, sill, h } = win;
  const f = 6;
  const pw = (x1 - x0 - 2 * f) / 3;
  parts.push(`<rect x="${x0}" y="${up(sill + h)}" width="${x1 - x0}" height="${h}" fill="${wood}" stroke="${woodDark}" stroke-width="1"/>`);
  for (let i = 0; i < 3; i++) {
    const x = x0 + f + i * pw;
    parts.push(`<rect x="${x + 2}" y="${up(sill + h - f - 2)}" width="${pw - 4}" height="${h - 2 * f - 4}" fill="#dde8ea" stroke="${woodDark}" stroke-width="0.8"/>`);
    parts.push(`<rect x="${x}" y="${up(sill + h - f)}" width="${pw}" height="${h - 2 * f}" fill="none" stroke="${wood}" stroke-width="4"/>`);
  }
  parts.push(`<rect x="${x0 + f + 6}" y="${up(sill + 62)}" width="3" height="14" fill="${woodDark}"/>`);
  parts.push(`<rect x="${x1 - f - 9}" y="${up(sill + 62)}" width="3" height="14" fill="${woodDark}"/>`);
}
parts.push(text((win.x0 + win.x1) / 2, up(win.sill) + 22, "หน้าต่างบานเลื่อน 3 ช่อง 180 × 110", { size: 14, fill: ink }));
parts.push(text(190, up(28), "ห้องนั่งเล่น", { size: 22, weight: 600, fill: ink }));

// Window dimensions.
parts.push(dimH(win.x0, win.x1, up(232), "180"));
parts.push(dimV(up(win.sill + win.h), up(win.sill), 310, "110"));
parts.push(dimV(up(win.sill), 0, 310, "90"));

// Eave line: both eaves at 2.00.
parts.push(`<line x1="${-DECK - EAVE_L - 30}" y1="${up(EAVE_H)}" x2="${W + EAVE_R + 20}" y2="${up(EAVE_H)}" stroke="${green}" stroke-width="1.6" stroke-dasharray="10 7"/>`);
parts.push(text(-DECK + 12, up(EAVE_H) + 20, "แนวชายคาระดับเดียวกัน 2.00", { size: 14, weight: 600, anchor: "start", fill: green }));
parts.push(text(-DECK + 12, up(EAVE_H) + 42, "โล่ง 2.40 ที่ขอบเดค", { size: 15, weight: 600, anchor: "start", fill: green }));

// Roof.
parts.push(
  `<path d="M${-DECK - EAVE_L} ${up(EAVE_H)} L0 ${up(RIDGE)} L${W + EAVE_R} ${up(EAVE_H)}" fill="none" stroke="#1d1d1b" stroke-width="12" stroke-linejoin="round"/>`
);

// Deck lighting.
{
  const { x, bottom, h, r } = pendant;
  const hook = roofAt(x) - 8; // underside of the rafter
  const cy = up(bottom + h / 2);
  // Wire inside the rafter, up the slope to the front wall, down to the switch.
  parts.push(
    `<path d="M${x} ${up(hook)} L-6 ${up(roofAt(-6) - 8)} L6 ${up(roofAt(-6) - 8)} V${up(126)}" fill="none" stroke="${lamp}" stroke-width="1.4" stroke-dasharray="6 4"/>`
  );
  parts.push(`<rect x="2" y="${up(127)}" width="10" height="14" fill="${lampFill}" stroke="${lamp}" stroke-width="1.4"/>`);
  parts.push(text(16, up(116), "สวิตช์ 2 ช่อง", { size: 13, anchor: "start", fill: lamp }));
  parts.push(text(16, up(98), "+1.20", { size: 13, anchor: "start", fill: lamp }));
  // Welded hook, cord and a round lantern.
  parts.push(`<rect x="${x - 4}" y="${up(hook)}" width="8" height="5" fill="${ink}"/>`);
  parts.push(`<line x1="${x}" y1="${up(hook) + 5}" x2="${x}" y2="${up(bottom + h)}" stroke="${ink}" stroke-width="1.2"/>`);
  parts.push(`<circle cx="${x}" cy="${cy}" r="62" fill="url(#glow)"/>`);
  parts.push(`<ellipse cx="${x}" cy="${cy}" rx="${r}" ry="${h / 2}" fill="${lampFill}" stroke="${lamp}" stroke-width="1.6"/>`);
  for (const k of [-0.5, 0, 0.5]) {
    parts.push(`<line x1="${x - r * Math.sqrt(1 - k * k)}" y1="${cy + (k * h) / 2}" x2="${x + r * Math.sqrt(1 - k * k)}" y2="${cy + (k * h) / 2}" stroke="${lamp}" stroke-width="0.7"/>`);
  }
  parts.push(text(x + 22, up(bottom + 22), "โคมห้อย", { size: 13, weight: 600, anchor: "start", fill: lamp }));
  parts.push(text(x + 22, up(bottom + 5), `ก้นโคม +${(bottom / 100).toFixed(2)}`, { size: 12, anchor: "start", fill: lamp }));
  parts.push(text(x + 8, up(hook) + 22, `ใต้จันทัน ${(hook / 100).toFixed(2)}`, { size: 12, anchor: "start", fill: soft }));

  // LED strip under the outer board edge, washing the ground below the deck.
  parts.push(`<path d="M${-DECK - 9} 4 L${-DECK - 40} ${FLOOR} L${-DECK + 22} ${FLOOR} Z" fill="url(#wash)"/>`);
  parts.push(`<rect x="${-DECK - 11}" y="2" width="7" height="5" fill="${lamp}"/>`);
  parts.push(text(-DECK - 18, 14, "strip ใต้ขอบเดค", { size: 12, anchor: "end", fill: lamp }));
  parts.push(text(-DECK - 18, 30, "ไม้ยื่น 3–4 ซม.", { size: 12, anchor: "end", fill: soft }));
}

// Ridge line, which is also the line of the front door.
parts.push(`<line x1="0" y1="${up(RIDGE + 60)}" x2="0" y2="40" stroke="${red}" stroke-width="1.3" stroke-dasharray="14 5 3 5"/>`);
parts.push(text(10, up(RIDGE + 48), "แนวจั่ว = แนวประตูใหญ่", { size: 16, weight: 600, anchor: "start", fill: red }));

// Pitch angles at the ridge.
{
  const y = up(RIDGE);
  const rr = 75;
  parts.push(`<line x1="-160" y1="${y}" x2="190" y2="${y}" stroke="#e7a39b" stroke-width="1" stroke-dasharray="6 4"/>`);
  const aL = Math.atan(slopeL);
  const aR = Math.atan(slopeR);
  parts.push(`<path d="M${-rr} ${y} A${rr} ${rr} 0 0 0 ${-rr * Math.cos(aL)} ${y + rr * Math.sin(aL)}" fill="none" stroke="${red}" stroke-width="1.5"/>`);
  parts.push(`<path d="M${rr} ${y} A${rr} ${rr} 0 0 1 ${rr * Math.cos(aR)} ${y + rr * Math.sin(aR)}" fill="none" stroke="${red}" stroke-width="1.5"/>`);
  parts.push(text(-100, y + 50, `${deg(slopeL)}°`, { size: 18, weight: 600, fill: red }));
  parts.push(text(110, y + 32, `${deg(slopeR)}°`, { size: 18, weight: 600, fill: red }));
}

// Labels on the deck side.
parts.push(text(-DECK - 14, up(140), "เสารับ", { size: 15, anchor: "end", fill: soft }));
parts.push(text(-DECK - 14, up(140) + 19, "ชายคา", { size: 15, anchor: "end", fill: soft }));
parts.push(text(-100, up(130), "เดค", { size: 17, fill: soft }));
parts.push(text(-DECK + 8, -6, "พื้นยก +0.45", { size: 14, anchor: "start", fill: soft }));

// Heights on the west side.
parts.push(`<line x1="${W}" y1="${up(roofAt(W))}" x2="${W + 150}" y2="${up(roofAt(W))}" stroke="${soft}" stroke-width="0.8" stroke-dasharray="4 4"/>`);
parts.push(`<line x1="20" y1="${up(RIDGE)}" x2="${W + 210}" y2="${up(RIDGE)}" stroke="${soft}" stroke-width="0.8" stroke-dasharray="4 4"/>`);
parts.push(dimV(up(roofAt(W)), 0, W + 140, "2.40"));
parts.push(dimV(up(RIDGE), 0, W + 200, "4.00"));
parts.push(text(W + 200, up(RIDGE) - 14, "สัน 4.00 จากพื้น", { size: 16, weight: 600, fill: ink }));

// Widths under the ground line.
const dy = FLOOR + 50;
parts.push(dimH(-DECK - EAVE_L, -DECK, dy + 40, "0.50"));
parts.push(dimH(-DECK, 0, dy, "2.00 (เดค)"));
parts.push(dimH(0, W, dy, "4.00 (ตัวห้อง)"));
parts.push(dimH(W, W + EAVE_R, dy, "1.00"));

const notes = [
  ["ไฟระเบียง 2700K CRI 90 · สวิตช์ 2 ช่องข้างบานเลื่อน: วงจร 1 LED strip 24V ใต้ขอบเดค + จมูกขั้นบันได · วงจร 2 โคมห้อย 3 ดวง", ink],
  ["ก่อนมุงหลังคา: ① เชื่อมหูแขวนใต้จันทัน 3 จุด (แนวเสา ห่างผนัง 1.00)  ② เจาะรูจุดโคม + จุดลงผนัง ใส่ยางกันบาด ร้อยลวดนำสายทิ้งไว้", red],
  ["③ ทาสี zinc กันสนิมทุกจุดที่เจาะหรือเชื่อม · ปูเดค: ไม้ยื่นเลยคานขอบนอก 3–4 ซม. ซ่อน strip IP65 · บันได IP67", red],
  ["โคม damp-rated ทรงกลมหรือหัวมน (กระดาษ / หวายสาน) ให้แสงลอดขึ้นท้องลายไม้ และไม่เป็นที่เกาะของนก", ink],
];
notes.forEach(([line, fill], i) => parts.push(text(-310, 200 + i * 24, line, { size: 14, anchor: "start", fill })));

parts.push(text(-310, 158, "รูปตัด · มองไปทางทิศเหนือ · หน้าต่างบานเลื่อน 3 ช่อง 180 × 110 ขอบล่าง 90 · ปรับ 19 พ.ย. 2026", { size: 15, anchor: "start", fill: "#6d6a62" }));

const defs = `
  <radialGradient id="glow">
    <stop offset="0" stop-color="#ffd77a" stop-opacity="0.75"/>
    <stop offset="1" stop-color="#ffd77a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffc85a" stop-opacity="0.8"/>
    <stop offset="1" stop-color="#ffc85a" stop-opacity="0.1"/>
  </linearGradient>
  <pattern id="ground" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#d4d4d0" stroke-width="3"/>
  </pattern>`;

export const section = svgDoc({ x: -330, y: -480, w: 1040, h: 790, defs, body: parts.join("\n"), font: FONT });
