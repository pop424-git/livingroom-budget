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
import { FONT, STAIR, dimH, dimV, text, svgDoc } from "./lib.mjs";

const up = (h) => -h; // height above floor → SVG y

const W = 400; // room width
const DECK = 200;
const EAVE_L = 50; // overhang past the deck post
const EAVE_R = 100; // overhang past the west wall
// As built, estimated from site photos (Nov 2026): the ridge came down from
// 4.00 to about 3.65, the deck post heads and the west wall head stay at 2.40.
// Replace with measured figures when they come in.
const RIDGE = 365;
const WALL_H = 240; // deck post head and west wall head
const FLOOR = 45; // floor raised above the ground

const ink = "#2f2e2b";
const soft = "#8a877f";
const red = "#c0453a";
const green = "#2f8a63";
const wood = "#e8c287";
const woodDark = "#b8743f";
const lamp = "#d9931f";
const lampFill = "#fff1cc";

// Wooden-box lamps hang under the purlin 100 out from the front wall.
const LINEAR_X = -100;

const slopeL = (RIDGE - WALL_H) / DECK;
const slopeR = (RIDGE - WALL_H) / W;
// 50 past a 200 deck and 100 past a 400 room drop by the same amount, so both
// eaves still end level.
const EAVE_H = WALL_H - EAVE_L * slopeL;
const m = (cm) => (cm / 100).toFixed(2);
const deg = (t) => ((Math.atan(t) * 180) / Math.PI).toFixed(1);
const roofAt = (x) => (x < 0 ? RIDGE + x * slopeL : RIDGE - x * slopeR);

// North window: three-panel slider, 180 × 110, sill at 90 so its head lines up
// with the front door head at 200.
const win = { x0: 100, x1: 280, sill: 90, h: 110 };

const parts = [];
parts.push(`<rect x="-330" y="-480" width="1040" height="1100" fill="#ffffff"/>`);

// Ground and floor deck on piers.
parts.push(`<rect x="-330" y="${FLOOR}" width="1040" height="14" fill="url(#ground)"/>`);
parts.push(`<line x1="-300" y1="${FLOOR}" x2="660" y2="${FLOOR}" stroke="${ink}" stroke-width="2.5"/>`);
for (const x of [-DECK - 7, -7, 193, W - 15]) {
  parts.push(`<rect x="${x}" y="18" width="15" height="${FLOOR - 18}" fill="#d9d9d6" stroke="${ink}" stroke-width="1"/>`);
}
parts.push(`<rect x="${-DECK - 12}" y="0" width="${DECK + W + 20}" height="18" fill="#e6e6e3" stroke="${ink}" stroke-width="1.2"/>`);

// Steps at the end of the deck, beyond the cut, seen face on: three open
// treads 120 wide, centred on the deck (40 clear of the gable wall line), on
// two steel stringers, open between the slabs, the LED strip under each nosing.
const step = "#e9e2d6";
const stairX0 = -STAIR.inset - STAIR.width;
const stairX1 = -STAIR.inset;
for (const x of [stairX0 + STAIR.stringer.inset, stairX1 - STAIR.stringer.inset - STAIR.stringer.w]) {
  const top = STAIR.at(1).drop + STAIR.slab;
  parts.push(`<rect x="${x}" y="${top}" width="${STAIR.stringer.w}" height="${FLOOR - top}" fill="#6f6a63"/>`);
}
for (let k = 1; k <= STAIR.count; k++) {
  const top = STAIR.at(k).drop;
  parts.push(`<rect x="${stairX0}" y="${top}" width="${STAIR.width}" height="${STAIR.slab}" fill="${step}" stroke="${ink}" stroke-width="1"/>`);
  parts.push(`<line x1="${stairX0 + 3}" y1="${top + STAIR.slab + 1.2}" x2="${stairX1 - 3}" y2="${top + STAIR.slab + 1.2}" stroke="${lamp}" stroke-width="2.2" stroke-linecap="round"/>`);
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
parts.push(text(-DECK + 12, up(EAVE_H) + 20, `แนวชายคาระดับเดียวกัน ${m(EAVE_H)}`, { size: 14, weight: 600, anchor: "start", fill: green }));
parts.push(text(-DECK + 12, up(EAVE_H) + 42, "โล่ง 2.40 ที่ขอบเดค", { size: 15, weight: 600, anchor: "start", fill: green }));

// Roof.
parts.push(
  `<path d="M${-DECK - EAVE_L} ${up(EAVE_H)} L0 ${up(RIDGE)} L${W + EAVE_R} ${up(EAVE_H)}" fill="none" stroke="#1d1d1b" stroke-width="12" stroke-linejoin="round"/>`
);

// Deck lighting.
{
  // Purlin in section (a box tube running into the page) tight under the sheet,
  // the aluminium profile on its underside. Both sit square to the slope.
  const t = Math.atan(slopeL);
  const rot = (-t * 180) / Math.PI;
  const ox = LINEAR_X;
  const oy = up(roofAt(LINEAR_X));
  parts.push(
    `<g transform="rotate(${rot.toFixed(2)} ${ox} ${oy})"><rect x="${ox - 3}" y="${oy + 6}" width="6" height="6" fill="#f1f1ef" stroke="${ink}" stroke-width="1"/></g>` +
      // The wooden box hangs plumb under the purlin, seen end on: a U channel
      // 12 wide and 16 deep, the LED tube tucked up inside it.
      `<line x1="${ox}" y1="${oy + 12}" x2="${ox}" y2="${oy + 16}" stroke="${soft}" stroke-width="1"/><path d="M${ox - 6} ${oy + 16} H${ox + 6} V${oy + 32} H${ox + 4} V${oy + 18} H${ox - 4} V${oy + 32} H${ox - 6} Z" fill="#c98b52" stroke="#7d5430" stroke-width="1"/><rect x="${ox - 2.5}" y="${oy + 19}" width="5" height="3" fill="${lampFill}"/>`
  );
  // Light falls straight down. The box sides cut it off: the tube sits about
  // 11 up inside a mouth 8 wide, so the beam opens roughly ±25° about plumb.
  const mouthY = oy + 32;
  const tubeY = oy + 21;
  const cut = Math.atan(5.5 / (mouthY - tubeY)); // far edge of the tube past the opposite lip
  const spread = (h) => h * Math.tan(cut);
  const drop = -mouthY; // mouth height above the deck floor
  const leftX = ox - 4 - spread(drop);
  const rightX = ox + 4 + spread(drop);
  // Past the wall the beam is stopped by it: it reaches the wall at this height.
  const wallH = rightX > 0 ? drop - (0 - (ox + 4)) / Math.tan(cut) : 0;
  parts.push(`<path d="M${ox - 4} ${mouthY} L${leftX} 0 L${Math.min(rightX, 0)} 0 ${rightX > 0 ? `L0 ${up(wallH)}` : ""} L${ox + 4} ${mouthY} Z" fill="url(#beam)"/>`);
  parts.push(`<line x1="${ox}" y1="${mouthY}" x2="${ox}" y2="0" stroke="${lamp}" stroke-width="1" stroke-dasharray="3 4"/>`);
  const sx = ox;
  const sy = oy + 15;
  const deg25 = Math.round((cut * 180) / Math.PI);
  parts.push(`<rect x="-164" y="${up(236) - 13}" width="158" height="34" rx="3" fill="#ffffff" fill-opacity="0.85"/>`);
  parts.push(text(-160, up(236), "โคมกล่องไม้ใต้แป ~2.70", { size: 12, weight: 600, anchor: "start", fill: lamp }));
  parts.push(text(-160, up(221), `ส่องลงตรง · ขอบกล่องบีบแสง ±${deg25}°`, { size: 12, anchor: "start", fill: lamp }));

  // Wire inside the rafter at the middle post, up to the wall, down to the switch.
  parts.push(
    `<path d="M${sx} ${sy} L-6 ${up(roofAt(-6) - 8)} L6 ${up(roofAt(-6) - 8)} V${up(126)}" fill="none" stroke="${lamp}" stroke-width="1.4" stroke-dasharray="6 4"/>`
  );
  parts.push(`<rect x="2" y="${up(127)}" width="10" height="14" fill="${lampFill}" stroke="${lamp}" stroke-width="1.4"/>`);
  parts.push(text(16, up(116), "S2 สวิตช์ 2 ทาง", { size: 13, anchor: "start", fill: lamp }));
  parts.push(`<rect x="-24" y="${up(127)}" width="10" height="14" fill="${lampFill}" stroke="${lamp}" stroke-width="1.4"/>`);
  parts.push(text(-28, up(116), "S4", { size: 13, anchor: "end", fill: lamp }));
  parts.push(text(16, up(98), "+1.20", { size: 13, anchor: "start", fill: lamp }));

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
parts.push(dimV(up(RIDGE), 0, W + 200, `~${m(RIDGE)}`));
parts.push(text(W + 200, up(RIDGE) - 14, `สัน ~${m(RIDGE)} จากพื้น`, { size: 16, weight: 600, fill: ink }));

// Widths under the ground line.
const dy = FLOOR + 50;
parts.push(dimH(-DECK - EAVE_L, -DECK, dy + 40, "0.50"));
parts.push(dimH(-DECK, stairX0, dy + 40, "0.40"));
parts.push(dimH(stairX0, stairX1, dy + 40, "1.20 บันได"));
parts.push(dimH(stairX1, 0, dy + 40, "0.40"));
parts.push(dimH(-DECK, 0, dy, "2.00 (เดค)"));
parts.push(dimH(0, W, dy, "4.00 (ตัวห้อง)"));
parts.push(dimH(W, W + EAVE_R, dy, "1.00"));

const notes = [
  ["ไฟระเบียง 2700K · สวิตช์ 2 ทาง S2 ในห้อง + S4 นอกผนัง เปิด/ปิดพร้อมกัน: LED strip ใต้ขอบเดค + ใต้จมูกบันได 3 ขั้น และโคมกล่องไม้ 2 ดวงใต้แป", ink],
  ["ก่อนมุงหลังคา: ① เจาะรูร้อยสายจากจันทันแนวเสากลางเข้าแปที่ห่างผนัง 1.00 (ทะลุรอยต่อแป-จันทัน) และจุดลงผนัง ใส่ยางกันบาด", red],
  ["ร้อยลวดนำสายทิ้งไว้  ② ทาสี zinc กันสนิมทุกจุดที่เจาะ · ปูเดค: ไม้ยื่นเลยคานขอบนอก 3–4 ซม. ซ่อน strip IP65 · บันได IP67", red],
  ["โคมกล่องไม้ราง U 12×16 ยาว ~130 ส่องลงตรง · LED batten 120 ซม. 220V ไม่ต้องมี driver · ห่างปลายเดคข้างละ 2.40 · ป้อนไฟกลาง เดินสายเลียบแปไปทั้งสองดวง", ink],
];
notes.forEach(([line, fill], i) => parts.push(text(-310, 200 + i * 24, line, { size: 14, anchor: "start", fill })));

parts.push(text(-310, 158, "รูปตัด · มองไปทางทิศเหนือ · บันไดลอย 3 ขั้น กว้าง 1.20 กลางเดค · หน้าต่าง 180 × 110 ขอบล่าง 90 · หลังคาประมาณจากรูปโครงจริง รอวัด · ปรับ 28 พ.ย. 2026", { size: 15, anchor: "start", fill: "#6d6a62" }));

// Step detail, side view at 3:1, below the notes.
{
  const k = 3;
  const ox = -200; // deck end
  const oy = 500; // ground line
  const X = (cm) => ox + cm * k;
  const Y = (h) => oy - h * k; // h above ground
  const g = [];
  g.push(text(-310, 330, "รายละเอียดบันได · มองด้านข้าง · มาตราส่วน 3 เท่า", { size: 16, weight: 600, anchor: "start", fill: ink }));
  g.push(`<line x1="${X(-30)}" y1="${oy}" x2="${X(STAIR.run + 40)}" y2="${oy}" stroke="${ink}" stroke-width="2"/>`);
  g.push(`<rect x="${X(-30)}" y="${oy}" width="${(STAIR.run + 70) * k}" height="10" fill="url(#ground)"/>`);
  // Deck end, boards on top.
  g.push(`<rect x="${X(-30)}" y="${Y(FLOOR)}" width="${30 * k}" height="${18 * k}" fill="#e6e6e3" stroke="${ink}" stroke-width="1.2"/>`);
  // Sloping steel stringer from the deck's rim beam to a footing; open under it.
  g.push(`<polygon points="${STAIR.stringerSide.map(([o, h]) => `${X(o)},${Y(h)}`).join(" ")}" fill="#8f8a82" stroke="${ink}" stroke-width="1"/>`);
  {
    const [foot] = STAIR.stringerSide[1];
    g.push(`<rect x="${X(foot - 16)}" y="${oy - 2 * k}" width="${20 * k}" height="${2 * k}" fill="#d9d9d6" stroke="${ink}" stroke-width="1"/>`);
  }
  for (let i = 1; i <= STAIR.count; i++) {
    const { drop, out } = STAIR.at(i);
    const top = FLOOR - drop;
    const front = out;
    const back = out - STAIR.tread;
    // Tread slab.
    g.push(`<rect x="${X(Math.max(back, 0))}" y="${Y(top)}" width="${(front - Math.max(back, 0)) * k}" height="${STAIR.slab * k}" fill="${step}" stroke="${ink}" stroke-width="1.2"/>`);
    // Strip under the nosing, lighting the tread below.
    g.push(`<rect x="${X(front - 4)}" y="${Y(top - STAIR.slab)}" width="${3 * k}" height="${1.2 * k}" fill="${lamp}"/>`);
    g.push(`<path d="M${X(front - 3)} ${Y(top - STAIR.slab - 1)} L${X(front - 10)} ${Y(Math.max(top - STAIR.rise, 0))} L${X(front + 10)} ${Y(Math.max(top - STAIR.rise, 0))} Z" fill="url(#wash)" opacity="0.7"/>`);
  }
  // Dimensions.
  g.push(dimH(X(0), X(STAIR.going), oy + 50, "20"));
  g.push(dimH(X(STAIR.going), X(2 * STAIR.going), oy + 50, "20"));
  g.push(dimH(X(2 * STAIR.going), X(3 * STAIR.going), oy + 50, "20"));
  g.push(dimH(X(0), X(STAIR.run), oy + 95, `ยื่นจากปลายเดค ${STAIR.run}`));
  const r = STAIR.rise.toFixed(2).replace(/0$/, "");
  for (let i = 0; i <= STAIR.count; i++) {
    const h0 = FLOOR - i * STAIR.rise;
    g.push(dimV(Y(h0), Y(h0 - STAIR.rise), X(STAIR.run + 30), r));
  }
  g.push(text(X(STAIR.run + 30) + 70, Y(FLOOR / 2) + 6, "รวม 45", { size: 16, anchor: "start", fill: soft }));
  const note = (y, t, fill = ink) => g.push(text(200, y, t, { size: 14, anchor: "start", fill }));
  note(360, "· 3 ขั้น = ลูกตั้ง 4 ช่วง ช่วงละ 11.25 (พื้นเดค → ขั้น 1 → 2 → 3 → พื้นดิน)");
  note(384, "· ลูกนอน (จมูกถึงจมูก) 20 · แผ่นขั้นลึก 28 สอดเข้าใต้ขั้นบน 8");
  note(408, "· บันไดโล่ง ไม่มีลูกตั้ง ไม่มีฐานทึบ — แผ่นขั้นวางบนเหล็กลาด 2 เส้น ห่างขอบข้างละ 20");
  note(432, "  ใต้ขั้นมองทะลุได้ ขั้นดูลอยซ้อนกัน ยื่นจากปลายเดคแค่ 60 · ตีนเหล็กลงฐานปูน");
  note(456, "· กว้าง 120 กลางความลึกเดค: ห่างแนวจั่ว 40 ห่างขอบนอก 40 ทั้งเหนือ-ใต้");
  note(480, "· แผ่นขั้นหนา ~5 ซม. · strip IP67 ซ่อนใต้จมูก ส่องลงขั้นถัดไป 3 แนว/ฝั่ง", lamp);
  parts.push(g.join(""));
}

const defs = `
  <radialGradient id="beam" gradientUnits="userSpaceOnUse" cx="${LINEAR_X}" cy="${up(roofAt(LINEAR_X)) + 32}" r="300">
    <stop offset="0" stop-color="#ffd77a" stop-opacity="0.6"/>
    <stop offset="1" stop-color="#ffd77a" stop-opacity="0.06"/>
  </radialGradient>
  <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffc85a" stop-opacity="0.8"/>
    <stop offset="1" stop-color="#ffc85a" stop-opacity="0.1"/>
  </linearGradient>
  <pattern id="ground" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#d4d4d0" stroke-width="3"/>
  </pattern>`;

export const section = svgDoc({ x: -330, y: -480, w: 1040, h: 1100, defs, body: parts.join("\n"), font: FONT });
