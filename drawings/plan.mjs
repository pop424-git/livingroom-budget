/**
 * Floor plan, drawn in centimetres.
 *
 * Origin is the inside face of the north-west corner. x runs east across the
 * 400 cm width, y runs south down the 960 cm length. The engawa sits west of
 * the front wall.
 */
import { FONT, dimH, dimV, text, svgDoc } from "./lib.mjs";

const W = 400; // inside width
const L = 960; // inside length
const T = 10; // wall thickness
const DECK = 200; // engawa depth

// Openings, in plan coordinates.
const frontDoor = { y0: 330, y1: 630 }; // west wall, 300 wide, centred
const kitchenWindow = { x0: 125, x1: 185 }; // north wall, 60
const ventWindow = { x0: 325, x1: 385 }; // north wall, 60 × 40, over the toilet
const southWindow = { x0: 100, x1: 280 }; // south wall, 180, left of the sofa

// Toilet: 200 × 150 in the north-east corner.
const toilet = { x0: 200, x1: W, y0: 0, y1: 150 };
const toiletDoor = { x0: 205, x1: 275 }; // in its south wall, west corner

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
parts.push(`<rect x="${-T - DECK}" y="-55" width="100" height="45" fill="#e8dcc8" stroke="#8a7a64" stroke-width="1"/>`);
parts.push(`<rect x="${-T - DECK}" y="${L + T}" width="100" height="45" fill="#e8dcc8" stroke="#8a7a64" stroke-width="1"/>`);
parts.push(text(-160, -27, "บันได", { size: 12, fill: soft }));
parts.push(text(-160, L + 42, "บันได", { size: 12, fill: soft }));
parts.push(`<rect x="-185" y="170" width="150" height="62" fill="#f1e8da"/>`);
parts.push(text(-110, 195, "ระเบียง engawa", { size: 17, weight: 600 }));
parts.push(text(-110, 220, `200 × 960 · 19.2 ตร.ม.`, { size: 13, fill: soft }));

// Exterior walls, broken at each opening.
parts.push(wall(-T, -T, T, frontDoor.y0 + T)); // west, north of the door
parts.push(wall(-T, frontDoor.y1, T, L + T - frontDoor.y1)); // west, south of the door
parts.push(wall(W, -T, T, L + 2 * T)); // east
parts.push(wall(-T, -T, kitchenWindow.x0 + T, T)); // north, up to the kitchen window
parts.push(wall(kitchenWindow.x1, -T, ventWindow.x0 - kitchenWindow.x1, T));
parts.push(wall(ventWindow.x1, -T, W - ventWindow.x1, T));
parts.push(wall(-T, L, southWindow.x0 + T, T)); // south
parts.push(wall(southWindow.x1, L, W - southWindow.x1, T));

parts.push(windowIn(kitchenWindow.x0, -T, kitchenWindow.x1 - kitchenWindow.x0, T));
parts.push(windowIn(ventWindow.x0, -T, ventWindow.x1 - ventWindow.x0, T));
parts.push(windowIn(southWindow.x0, L, southWindow.x1 - southWindow.x0, T));

// Front door: three sliding panels of 100 on staggered tracks.
parts.push(`<rect x="${-T}" y="${frontDoor.y0}" width="${T}" height="300" fill="#fff" stroke="${ink}" stroke-width="1.2"/>`);
parts.push(
  `<g stroke="${ink}" stroke-width="2.2"><line x1="-8" y1="${frontDoor.y0}" x2="-8" y2="${frontDoor.y0 + 105}"/><line x1="-5" y1="${frontDoor.y0 + 97}" x2="-5" y2="${frontDoor.y0 + 203}"/><line x1="-2" y1="${frontDoor.y0 + 195}" x2="-2" y2="${frontDoor.y1}"/></g>`
);

// Toilet partitions, with the door gap at the west end of the south wall.
parts.push(wall(toilet.x0 - T, 0, T, toilet.y1 + T));
parts.push(wall(toilet.x0, toilet.y1, toiletDoor.x0 - toilet.x0, T));
parts.push(wall(toiletDoor.x1, toilet.y1, toilet.x1 - toiletDoor.x1, T));

// Toilet door: 70, opens in, leaf comes to rest along the west wall.
{
  const hx = toiletDoor.x0 + 2;
  const hy = toilet.y1;
  const r = toiletDoor.x1 - hx;
  parts.push(`<rect x="${hx - 2}" y="${hy - r}" width="4" height="${r}" fill="${door}"/>`);
  parts.push(
    `<path d="M${toiletDoor.x1} ${hy} A${r} ${r} 0 0 0 ${hx} ${hy - r}" fill="none" stroke="${door}" stroke-width="1.2" stroke-dasharray="5 4"/>`
  );
}

// Kitchen along the north wall: fridge 70, counter 120 with the sink at its east end.
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
// Exhaust fan high on the east wall, south of the bowl, across the room from the vent window.
parts.push(`<rect x="384" y="112" width="16" height="22" fill="#fff" stroke="${ink}" stroke-width="1.2"/>`);
parts.push(`<path d="M384 112 L400 134 M400 112 L384 134" stroke="${ink}" stroke-width="0.9"/>`);
parts.push(text(380, 144, "พัดลมดูดอากาศ", { size: 11, anchor: "end", fill: soft }));
parts.push(text(305, 105, "ห้องน้ำ", { size: 15, weight: 600 }));
parts.push(text(305, 122, "3.0 ตร.ม.", { size: 12, fill: soft }));

// Dining in front of the sliding door: table 180 × 100, two chairs a side.
function chair(x, y, backAtTop) {
  const back = backAtTop ? y : y + 36;
  return `<rect x="${x}" y="${y}" width="45" height="42" rx="6" ${fx}/><rect x="${x + 4}" y="${back}" width="37" height="6" rx="2" fill="${soft}"/>`;
}
parts.push(chair(140, 382, true), chair(215, 382, true), chair(140, 536, false), chair(215, 536, false));
parts.push(`<rect x="110" y="430" width="180" height="100" rx="3" ${fx}/>`);
parts.push(text(200, 478, "โต๊ะกินข้าว", { size: 13 }));
parts.push(text(200, 496, "180 × 100", { size: 11, fill: soft }));

// Living: armchair, sofa 186 on the east wall, coffee table, TV on the west wall.
parts.push(`<rect x="318" y="660" width="75" height="75" rx="10" ${fx}/>`);
parts.push(`<rect x="378" y="664" width="12" height="67" rx="4" ${thin}/>`);
parts.push(text(352, 701, "อาร์มแชร์", { size: 11 }));
parts.push(`<rect x="310" y="754" width="88" height="186" rx="8" ${fx}/>`);
parts.push(`<rect x="376" y="770" width="18" height="154" rx="4" ${thin}/>`);
parts.push(`<line x1="310" y1="770" x2="376" y2="770" stroke="${soft}" stroke-width="1"/>`);
parts.push(`<line x1="310" y1="924" x2="376" y2="924" stroke="${soft}" stroke-width="1"/>`);
parts.push(`<line x1="310" y1="847" x2="376" y2="847" stroke="${soft}" stroke-width="0.8"/>`);
parts.push(text(343, 815, "โซฟา", { size: 13 }));
parts.push(text(343, 832, "186", { size: 11, fill: soft }));
parts.push(`<rect x="215" y="800" width="60" height="95" rx="4" ${fx}/>`);
parts.push(text(245, 851, "โต๊ะกลาง", { size: 11, fill: soft }));
parts.push(`<rect x="2" y="720" width="40" height="180" rx="2" ${fx}/>`);
parts.push(`<line x1="40" y1="745" x2="40" y2="875" stroke="${ink}" stroke-width="3"/>`);
parts.push(text(21, 815, "ทีวี", { size: 12 }));

parts.push(text(170, 648, "ห้องนั่งเล่น", { size: 19, weight: 600 }));
parts.push(text(170, 670, "35.4 ตร.ม.", { size: 14, fill: soft }));

// Window and opening notes outside the walls.
parts.push(text(155, -18, "หน้าต่างครัว 60", { size: 11, fill: soft }));
parts.push(text(355, -18, "ระบายอากาศ 60 × 40", { size: 11, fill: soft }));
parts.push(text(190, 988, "หน้าต่างบานเลื่อน 180 × 110", { size: 11, fill: soft }));

// Dimensions.
parts.push(dimH(0, 70, -52, "70"));
parts.push(dimH(70, 190, -52, "120"));
parts.push(dimH(200, W, -52, "200"));
parts.push(dimH(0, W, -92, "400"));
parts.push(dimH(-T - DECK, -T, -92, "200"));
parts.push(dimV(toilet.y0, toilet.y1, W + 40, "150"));
parts.push(dimV(0, L, W + 90, "960"));
parts.push(dimV(0, frontDoor.y0, -255, "330"));
parts.push(dimV(frontDoor.y0, frontDoor.y1, -255, ["บานเลื่อน", "300"]));
parts.push(dimV(frontDoor.y1, L, -255, "330"));
parts.push(dimH(0, W, L + 72, "400"));

// North arrow and title.
parts.push(
  `<g transform="translate(510 1035)"><circle r="24" fill="none" stroke="${ink}" stroke-width="1.2"/><path d="M0 -20 L7 8 L0 3 L-7 8 Z" fill="${ink}"/>${text(0, -30, "N", { size: 14, weight: 600 })}</g>`
);
parts.push(text(-370, 1100, "ผังพื้น · ห้อง 400 × 960 cm · 38.4 ตร.ม. · ปรับ 11 พ.ย. 2026", { size: 17, anchor: "start" }));

const defs = `
  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse" x="0" y="0">
    <path d="M50 0H0V50" fill="none" stroke="#e3e0d8" stroke-width="1"/>
  </pattern>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="${soft}" stroke-width="1"/>
  </pattern>`;

export const plan = svgDoc({ x: -390, y: -160, w: 970, h: 1290, defs, body: parts.join("\n"), font: FONT });
