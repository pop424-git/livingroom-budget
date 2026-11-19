/**
 * Floor plan, drawn in centimetres.
 *
 * Origin is the inside face of the south-east corner. x runs west across the
 * 400 cm width, y runs north down the 960 cm length. The engawa sits east of
 * the front wall.
 */
import { FONT, dimH, dimV, text, svgDoc } from "./lib.mjs";

const W = 400; // inside width
const L = 960; // inside length
const T = 10; // wall thickness
const DECK = 200; // engawa depth

// Openings, in plan coordinates.
const frontDoor = { y0: 340, y1: 620 }; // east wall, 280 wide, centred
const kitchenWindow = { x0: 85, x1: 185 }; // south wall, 100 × 100, over the counter
const ventWindow = { x0: 335, x1: 375 }; // south wall, 40 × 35 louvre, over the toilet
const northWindow = { x0: 100, x1: 280 }; // north wall, 180 × 110, three-panel slider

// Toilet: 200 × 150 in the south-west corner.
const toilet = { x0: 200, x1: W, y0: 0, y1: 150 };
const toiletDoor = { x0: 205, x1: 275 }; // in its north partition, east corner

const ink = "#3b3a36";
const soft = "#6d6a62";
const door = "#c0562f";

function wall(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hatch)" stroke="${ink}" stroke-width="1.6"/>`;
}

function windowIn(x, y, w, h) {
  // A gap in the wall with two glass lines along its length.
  const horizontal = w > h;
  const lines = horizontal
    ? `<line x1="${x}" y1="${y + h * 0.4}" x2="${x + w}" y2="${y + h * 0.4}"/><line x1="${x}" y1="${y + h * 0.6}" x2="${x + w}" y2="${y + h * 0.6}"/>`
    : `<line x1="${x + w * 0.4}" y1="${y}" x2="${x + w * 0.4}" y2="${y + h}"/><line x1="${x + w * 0.6}" y1="${y}" x2="${x + w * 0.6}" y2="${y + h}"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${ink}" stroke-width="1.2"/><g stroke="${ink}" stroke-width="0.9">${lines}</g>`;
}

const fx = `fill="#fff" stroke="${ink}" stroke-width="1.3"`;
const thin = `fill="none" stroke="${soft}" stroke-width="1"`;

const parts = [];

// Paper and grid.
parts.push(`<rect x="-390" y="-160" width="970" height="1290" fill="#fbfaf6"/>`);
parts.push(`<rect x="-390" y="-160" width="970" height="1290" fill="url(#grid)"/>`);

// Engawa deck with boards running its length, posts on the outer edge, steps at each end.
parts.push(
  `<rect x="${-T - DECK}" y="${-T}" width="${DECK}" height="${L + 2 * T}" fill="#f1e8da" stroke="#8a7a64" stroke-width="1.3"/>`
);
for (let x = -T - DECK + 20; x < -T; x += 20) {
  parts.push(`<line x1="${x}" y1="${-T}" x2="${x}" y2="${L + T}" stroke="#ddd0bc" stroke-width="0.8"/>`);
}
for (const y of [-T, 235, 480, 725, L + T - 12]) {
  parts.push(`<rect x="${-T - DECK}" y="${y}" width="12" height="12" fill="#b47a45" stroke="#7d5430" stroke-width="0.8"/>`);
}
parts.push(`<rect x="${-T - DECK}" y="-55" width="${DECK}" height="45" fill="#e8dcc8" stroke="#8a7a64" stroke-width="1"/>`);
parts.push(`<rect x="${-T - DECK}" y="${L + T}" width="${DECK}" height="45" fill="#e8dcc8" stroke="#8a7a64" stroke-width="1"/>`);
parts.push(text(-T - DECK / 2, -27, "บันได 200", { size: 12, fill: soft }));
parts.push(text(-T - DECK / 2, L + 42, "บันได 200", { size: 12, fill: soft }));
parts.push(`<rect x="-185" y="170" width="150" height="62" fill="#f1e8da"/>`);
parts.push(text(-110, 195, "ระเบียง engawa", { size: 17, weight: 600 }));
parts.push(text(-110, 220, `200 × 960 · 19.2 ตร.ม.`, { size: 13, fill: soft }));

// Exterior walls, broken at each opening.
parts.push(wall(-T, -T, T, frontDoor.y0 + T)); // east, south of the door
parts.push(wall(-T, frontDoor.y1, T, L + T - frontDoor.y1)); // east, north of the door
parts.push(wall(W, -T, T, L + 2 * T)); // west
parts.push(wall(-T, -T, kitchenWindow.x0 + T, T)); // south, up to the kitchen window
parts.push(wall(kitchenWindow.x1, -T, ventWindow.x0 - kitchenWindow.x1, T));
parts.push(wall(ventWindow.x1, -T, W - ventWindow.x1, T));
parts.push(wall(-T, L, northWindow.x0 + T, T)); // north
parts.push(wall(northWindow.x1, L, W - northWindow.x1, T));

parts.push(windowIn(kitchenWindow.x0, -T, kitchenWindow.x1 - kitchenWindow.x0, T));
parts.push(windowIn(ventWindow.x0, -T, ventWindow.x1 - ventWindow.x0, T));
parts.push(windowIn(northWindow.x0, L, northWindow.x1 - northWindow.x0, T));

// Front door: four panels of 70. The outer two are fixed on the outside track;
// the middle two slide on the inside track and meet at the centre.
{
  const { y0, y1 } = frontDoor;
  const p = (y1 - y0) / 4;
  const mid = (y0 + y1) / 2;
  parts.push(`<rect x="${-T}" y="${y0}" width="${T}" height="${y1 - y0}" fill="#fff" stroke="${ink}" stroke-width="1.2"/>`);
  parts.push(
    `<g stroke="${ink}" stroke-width="2.2"><line x1="-7" y1="${y0}" x2="-7" y2="${y0 + p + 4}"/><line x1="-7" y1="${y1 - p - 4}" x2="-7" y2="${y1}"/><line x1="-3" y1="${y0 + p - 4}" x2="-3" y2="${mid}"/><line x1="-3" y1="${mid}" x2="-3" y2="${y1 - p + 4}"/></g>`
  );
  parts.push(`<line x1="-10" y1="${mid}" x2="0" y2="${mid}" stroke="${ink}" stroke-width="1"/>`);
}

// Toilet partitions, with the door gap at the east end of the north partition.
parts.push(wall(toilet.x0 - T, 0, T, toilet.y1 + T));
parts.push(wall(toilet.x0, toilet.y1, toiletDoor.x0 - toilet.x0, T));
parts.push(wall(toiletDoor.x1, toilet.y1, toilet.x1 - toiletDoor.x1, T));

// Toilet door: 70, opens in, leaf comes to rest along the east partition.
{
  const hx = toiletDoor.x0 + 2;
  const hy = toilet.y1;
  const r = toiletDoor.x1 - hx;
  parts.push(`<rect x="${hx - 2}" y="${hy - r}" width="4" height="${r}" fill="${door}"/>`);
  parts.push(
    `<path d="M${toiletDoor.x1} ${hy} A${r} ${r} 0 0 0 ${hx} ${hy - r}" fill="none" stroke="${door}" stroke-width="1.2" stroke-dasharray="5 4"/>`
  );
}

// Kitchen along the south wall: fridge 70, counter 120 with the sink at its west end.
parts.push(`<rect x="3" y="3" width="64" height="62" ${fx}/>`);
parts.push(`<line x1="3" y1="12" x2="67" y2="12" stroke="${soft}" stroke-width="1"/>`);
parts.push(text(35, 43, "ตู้เย็น", { size: 14 }));
parts.push(`<rect x="70" y="0" width="120" height="60" ${fx}/>`);
parts.push(`<rect x="134" y="8" width="48" height="44" rx="5" ${thin}/>`);
parts.push(`<circle cx="158" cy="30" r="3" fill="${soft}"/>`);
parts.push(text(101, 35, "เคาน์เตอร์", { size: 12 }));

// Toilet fittings.
parts.push(`<rect x="215" y="0" width="50" height="42" rx="4" ${fx}/>`);
parts.push(`<ellipse cx="240" cy="22" rx="17" ry="12" ${thin}/>`);
parts.push(text(240, 60, "อ่างล้างหน้า", { size: 12, fill: soft }));
parts.push(`<rect x="380" y="55" width="18" height="40" rx="3" ${fx}/>`);
parts.push(`<ellipse cx="356" cy="75" rx="24" ry="18" ${fx}/>`);
parts.push(text(354, 79, "โถ", { size: 12 }));
parts.push(`<circle cx="393" cy="36" r="4.5" fill="#fff" stroke="${door}" stroke-width="1.6"/>`);
parts.push(text(384, 40, "ฉีดชำระ", { size: 11, anchor: "end", fill: soft }));
// Exhaust fan high on the west wall, north of the bowl, across the room from the vent window.
parts.push(`<rect x="384" y="112" width="16" height="22" fill="#fff" stroke="${ink}" stroke-width="1.2"/>`);
parts.push(`<path d="M384 112 L400 134 M400 112 L384 134" stroke="${ink}" stroke-width="0.9"/>`);
parts.push(text(380, 144, "พัดลมดูดอากาศ", { size: 11, anchor: "end", fill: soft }));
parts.push(text(305, 105, "ห้องน้ำ", { size: 15, weight: 600 }));
parts.push(text(305, 122, "3.0 ตร.ม.", { size: 12, fill: soft }));

// Dining in the open floor between the toilet and the living corner: table
// 200 × 100 running east-west, three chairs on the toilet side, a bench of the
// same length on the sofa side. The table's end is against the west wall,
// across from the door, and the set sits midway between the toilet partition
// (160) and the armchair (580).
const dining = { x0: 198, x1: 398, y0: 323, y1: 423 };
const bench = { y0: 428, y1: 468 };
function chair(cx) {
  // 45 wide, 42 deep, back on the south edge, seat facing the table.
  const x = cx - 22.5;
  const y = dining.y0 - 50;
  return `<rect x="${x}" y="${y}" width="45" height="42" rx="6" ${fx}/><rect x="${x + 4}" y="${y}" width="37" height="6" rx="2" fill="${soft}"/>`;
}
const seat = (dining.x1 - dining.x0) / 3;
for (let i = 0; i < 3; i++) parts.push(chair(dining.x0 + seat * (i + 0.5)));
parts.push(`<rect x="${dining.x0}" y="${dining.y0}" width="${dining.x1 - dining.x0}" height="${dining.y1 - dining.y0}" rx="3" ${fx}/>`);
parts.push(text(298, 370, "โต๊ะกินข้าว", { size: 13 }));
parts.push(text(298, 388, "200 × 100", { size: 11, fill: soft }));
parts.push(`<rect x="${dining.x0}" y="${bench.y0}" width="${dining.x1 - dining.x0}" height="${bench.y1 - bench.y0}" rx="3" ${fx}/>`);
parts.push(text(298, 452, "ม้านั่ง 200", { size: 11, fill: soft }));

// Armchair beside the sofa, at its south end.
parts.push(`<rect x="318" y="580" width="75" height="75" rx="10" ${fx}/>`);
parts.push(`<rect x="378" y="584" width="12" height="67" rx="4" ${thin}/>`);
parts.push(text(352, 621, "อาร์มแชร์", { size: 11 }));

// Living: three-section sofa 280 on the west wall with its chaise in the north
// corner, TV on the east wall.
const sofa = { x0: 302, x1: 398, y0: 660, y1: 940, chaiseX: 250, chaiseY: 847 };
parts.push(
  `<path d="M${sofa.x0} ${sofa.y0} H${sofa.x1} V${sofa.y1} H${sofa.chaiseX} V${sofa.chaiseY} H${sofa.x0} Z" stroke-linejoin="round" ${fx}/>`
);
parts.push(`<rect x="380" y="675" width="15" height="250" rx="4" ${thin}/>`);
parts.push(`<line x1="${sofa.x0}" y1="675" x2="380" y2="675" stroke="${soft}" stroke-width="1"/>`);
parts.push(`<line x1="${sofa.chaiseX}" y1="925" x2="380" y2="925" stroke="${soft}" stroke-width="1"/>`);
parts.push(`<line x1="${sofa.x0}" y1="761" x2="380" y2="761" stroke="${soft}" stroke-width="0.8"/>`);
parts.push(`<line x1="${sofa.x0}" y1="${sofa.chaiseY}" x2="380" y2="${sofa.chaiseY}" stroke="${soft}" stroke-width="0.8"/>`);
parts.push(text(341, 798, "โซฟา", { size: 13 }));
parts.push(text(341, 815, "280", { size: 11, fill: soft }));
parts.push(text(315, 890, "เชส", { size: 11, fill: soft }));
parts.push(`<rect x="2" y="720" width="40" height="180" rx="2" ${fx}/>`);
parts.push(`<line x1="40" y1="745" x2="40" y2="875" stroke="${ink}" stroke-width="3"/>`);
parts.push(text(21, 815, "ทีวี", { size: 12 }));

parts.push(text(170, 648, "ห้องนั่งเล่น", { size: 19, weight: 600 }));
parts.push(text(170, 670, "35.4 ตร.ม.", { size: 14, fill: soft }));

// Window and opening notes outside the walls.
parts.push(text(135, -18, "หน้าต่างครัว 100 × 100", { size: 11, fill: soft }));
parts.push(text(355, -18, "บานเกล็ด 40 × 35", { size: 11, fill: soft }));
parts.push(text(190, 988, "หน้าต่างบานเลื่อน 180 × 110", { size: 11, fill: soft }));

// Dimensions.
parts.push(dimH(0, 70, -52, "70"));
parts.push(dimH(70, 190, -52, "120"));
parts.push(dimH(200, W, -52, "200"));
parts.push(dimH(0, W, -92, "400"));
parts.push(dimH(-T - DECK, -T, -92, "200"));
parts.push(dimV(toilet.y0, toilet.y1, W + 40, "150"));
parts.push(dimV(0, L, W + 90, "960"));
parts.push(dimV(0, frontDoor.y0, -255, String(frontDoor.y0)));
parts.push(dimV(frontDoor.y0, frontDoor.y1, -255, ["บานเลื่อน", String(frontDoor.y1 - frontDoor.y0)]));
parts.push(dimV(frontDoor.y1, L, -255, String(L - frontDoor.y1)));
parts.push(dimH(0, W, L + 72, "400"));

// North arrow and title.
parts.push(
  `<g transform="translate(510 1025)"><circle r="24" fill="none" stroke="${ink}" stroke-width="1.2"/><path d="M0 20 L7 -8 L0 -3 L-7 -8 Z" fill="${ink}"/>${text(0, 44, "N", { size: 14, weight: 600 })}</g>`
);
parts.push(text(-370, 1100, "ผังพื้น · ห้อง 400 × 960 cm · 38.4 ตร.ม. · ปรับ 19 พ.ย. 2026", { size: 17, anchor: "start" }));

const defs = `
  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse" x="0" y="0">
    <path d="M50 0H0V50" fill="none" stroke="#e3e0d8" stroke-width="1"/>
  </pattern>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="${soft}" stroke-width="1"/>
  </pattern>`;

export const plan = svgDoc({ x: -390, y: -160, w: 970, h: 1290, defs, body: parts.join("\n"), font: FONT });
