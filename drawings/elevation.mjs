/**
 * Front elevation, seen from the engawa looking west, in centimetres.
 *
 * Horizontal is the plan's y (south on the left, 0 to 960). Vertical is height
 * above the finished floor, drawn upwards, so every y below goes through up().
 * Walls are cut away to show what stands behind them, as in the first sketch.
 */
import { FONT, dimH, text, svgDoc } from "./lib.mjs";

const L = 960;
const up = (h) => -h; // height above floor → SVG y

const wood = "#e8c287";
const woodDark = "#c99a5b";
const ink = "#2f2e2b";

const r = (x, y0, w, h, fill, extra = "") =>
  `<rect x="${x}" y="${up(y0 + h)}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;

const parts = [];

parts.push(`<rect x="-160" y="-560" width="1280" height="700" fill="#ffffff"/>`);

// Ground, piers, floor deck and the steps at each end.
parts.push(r(-160, -60, 1280, 15, "#cfcfcf"));
for (const y of [0, 240, 480, 720, L - 25]) parts.push(r(y, -45, 25, 25, "#cf8f55"));
parts.push(r(-10, -20, L + 20, 20, "#c9a083"));
parts.push(r(-70, -32, 60, 12, "#c9a083"), r(-110, -45, 60, 13, "#c9a083"));
parts.push(r(L + 10, -32, 60, 12, "#c9a083"), r(L + 50, -45, 60, 13, "#c9a083"));

// The room behind the front wall, cut away.
parts.push(r(0, 0, L, 240, "#f4f4f3"));

// Toilet at the south end: 150 deep in plan, so 150 wide from the engawa.
parts.push(r(18, 0, 150, 240, "#e6e6e4"));
// Labels sit right of the fridge, which hides the toilet's front 65.
parts.push(text(125, up(150), "ห้องน้ำ", { size: 22, weight: 600, fill: ink }));
parts.push(text(125, up(126), "150 cm", { size: 20, fill: ink }));
// Fridge stands in front of it, against the south wall.
parts.push(r(18, 0, 65, 180, "#d6d6d3"));
parts.push(text(50, up(80), "ตู้เย็น", { size: 18, weight: 600, fill: ink }));

// Dining set seen end on: table 100 wide at 75, a chair on the toilet side
// (left) with its back away from the table, the bench on the sofa side.
const ghost = `fill="none" stroke="#e3cf9f" stroke-width="5"`;
parts.push(`<rect x="318" y="${up(78)}" width="110" height="8" fill="#ead9b0"/>`);
parts.push(`<path d="M333 ${up(75)} V0 M413 ${up(75)} V0" ${ghost}/>`);
parts.push(`<path d="M273 ${up(45)} H315 M278 ${up(45)} V0 M310 ${up(45)} V0 M273 ${up(45)} L267 ${up(90)}" ${ghost}/>`);
parts.push(`<path d="M428 ${up(45)} H468 M433 ${up(45)} V0 M463 ${up(45)} V0" ${ghost}/>`);

// Armchair beside the sofa.
parts.push(r(580, 0, 75, 75, "#e2deda"));

// Three-section sofa against the far wall at the north end, chaise in the corner.
parts.push(r(660, 0, 280, 80, "#ece7e1"));
parts.push(r(660, 0, 280, 45, "#e6e0d9"));
parts.push(r(847, 0, 93, 45, "#ddd6ce"));
parts.push(text(780, up(35), "SOFA 280 cm", { size: 20, weight: 600, fill: ink }));

// Sliding door, 280 × 200 over the outer frame, centred: four panels. The two
// fixed outer panels carry a 2 × 4 glazing grid; the middle pair slide and meet.
const d0 = 340;
const d1 = 620;
const pw = (d1 - d0 - 16) / 4;
parts.push(r(d0, 0, d1 - d0, 200, "rgba(255,255,255,0.55)"));
for (let i = 0; i < 4; i++) {
  const x = d0 + 8 + i * pw;
  parts.push(`<rect x="${x}" y="${up(192)}" width="${pw}" height="184" fill="none" stroke="${wood}" stroke-width="8"/>`);
  if (i === 0 || i === 3) {
    const grid = [`M${x + pw / 2} ${up(188)} V${up(12)}`];
    for (const h of [56, 100, 144]) grid.push(`M${x + 4} ${up(h)} H${x + pw - 4}`);
    parts.push(`<path d="${grid.join(" ")}" stroke="${wood}" stroke-width="3"/>`);
  }
}
parts.push(r(480 - 8, 95, 4, 22, woodDark), r(480 + 4, 95, 4, 22, woodDark));
parts.push(text(480, up(150), "ประตูบานเลื่อน 280 cm", { size: 20, weight: 600, fill: ink }));

// Wood frame: corner posts, door posts, head beam.
for (const x of [0, d0 - 18, d1, L - 18]) parts.push(r(x, 0, 18, 290, wood));
parts.push(r(d0 - 18, 200, d1 - d0 + 36, 18, wood));
parts.push(r(0, 272, L, 18, wood));

// Armchair label goes over the door post that stands in front of it.
parts.push(text(617, up(32), "ArmChair", { size: 14, weight: 600, fill: ink }));

// Roof: steep side faces the engawa, eaves at 2.00 m over the deck edge.
parts.push(r(-50, 230, L + 100, 235, "rgba(150,150,150,0.88)"));
for (let x = -50 + 33; x < L + 50; x += 33) {
  parts.push(`<line x1="${x}" y1="${up(465)}" x2="${x}" y2="${up(230)}" stroke="#8c8c8c" stroke-width="1.5"/>`);
}
parts.push(text(480, up(340), "ผนังตรงกลางจั่ว สูง 400 cm", { size: 22, weight: 600, fill: ink }));

// Overall length under the ground line.
parts.push(dimH(0, L, 95, "ยาว 960 cm"));
parts.push(text(-140, 125, "รูปด้านหน้า · มองจากระเบียง ทิศใต้อยู่ซ้าย · ปรับ 19 พ.ย. 2026", { size: 15, anchor: "start", fill: "#6d6a62" }));

export const elevation = svgDoc({ x: -160, y: -560, w: 1280, h: 700, body: parts.join("\n"), font: FONT });
