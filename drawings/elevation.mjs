/**
 * Front elevation, seen from the engawa looking east, in centimetres.
 *
 * Horizontal is the plan's y (north on the left, 0 to 960). Vertical is height
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

// Toilet at the north end: 150 deep in plan, so 150 wide from the engawa.
parts.push(r(18, 0, 150, 240, "#e6e6e4"));
// Labels sit right of the fridge, which hides the toilet's front 65.
parts.push(text(125, up(150), "ห้องน้ำ", { size: 22, weight: 600, fill: ink }));
parts.push(text(125, up(126), "150 cm", { size: 20, fill: ink }));
// Fridge stands in front of it, against the north wall.
parts.push(r(18, 0, 65, 180, "#d6d6d3"));
parts.push(text(50, up(80), "ตู้เย็น", { size: 18, weight: 600, fill: ink }));

// Dining set in front of the door: table 100 wide seen end on, a chair each side.
const ghost = `fill="none" stroke="#e3cf9f" stroke-width="5"`;
parts.push(`<path d="M430 ${up(75)} H530 M440 ${up(75)} V0 M520 ${up(75)} V0" ${ghost}/>`);
parts.push(`<rect x="425" y="${up(78)}" width="110" height="8" fill="#ead9b0"/>`);
parts.push(`<path d="M380 ${up(45)} H420 M385 ${up(45)} V0 M415 ${up(45)} V0 M380 ${up(45)} L374 ${up(90)}" ${ghost}/>`);
parts.push(`<path d="M540 ${up(45)} H580 M545 ${up(45)} V0 M575 ${up(45)} V0 M580 ${up(45)} L586 ${up(90)}" ${ghost}/>`);

// Armchair and sofa against the far wall at the south end.
parts.push(r(660, 0, 75, 75, "#e2deda"));
parts.push(text(697, up(32), "ArmChair", { size: 14, weight: 600, fill: ink }));
parts.push(r(754, 0, 186, 80, "#ece7e1"));
parts.push(r(754, 0, 186, 45, "#e6e0d9"));
parts.push(text(847, up(35), "SOFA 186 cm", { size: 20, weight: 600, fill: ink }));

// Sliding door, 300 × 200, centred: three panels in a wood frame.
const d0 = 330;
const d1 = 630;
parts.push(r(d0, 0, 300, 200, "rgba(255,255,255,0.55)"));
for (const [x, w] of [[d0 + 8, 96], [d0 + 104, 96], [d0 + 200, 92]]) {
  parts.push(`<rect x="${x}" y="${up(192)}" width="${w}" height="184" fill="none" stroke="${wood}" stroke-width="8"/>`);
}
parts.push(r(d0 + 194, 105, 5, 22, woodDark));
parts.push(text(480, up(150), "ประตูบานเลื่อน 300 cm", { size: 20, weight: 600, fill: ink }));

// Wood frame: corner posts, door posts, head beam.
for (const x of [0, d0 - 18, d1, L - 18]) parts.push(r(x, 0, 18, 290, wood));
parts.push(r(d0 - 18, 200, 336, 18, wood));
parts.push(r(0, 272, L, 18, wood));

// Roof: steep side faces the engawa, eaves at 2.00 m over the deck edge.
parts.push(r(-50, 230, L + 100, 235, "rgba(150,150,150,0.88)"));
for (let x = -50 + 33; x < L + 50; x += 33) {
  parts.push(`<line x1="${x}" y1="${up(465)}" x2="${x}" y2="${up(230)}" stroke="#8c8c8c" stroke-width="1.5"/>`);
}
parts.push(text(480, up(340), "ผนังตรงกลางจั่ว สูง 400 cm", { size: 22, weight: 600, fill: ink }));

// Overall length under the ground line.
parts.push(dimH(0, L, 95, "ยาว 960 cm"));
parts.push(text(-140, 125, "รูปด้านหน้า · มองจากระเบียง ทิศเหนืออยู่ซ้าย · ปรับ 11 พ.ย. 2026", { size: 15, anchor: "start", fill: "#6d6a62" }));

export const elevation = svgDoc({ x: -160, y: -560, w: 1280, h: 700, body: parts.join("\n"), font: FONT });
