/**
 * Outside face of the front wall, seen from the engawa looking west, in
 * centimetres: what sits on the deck side of the wall, electrically.
 *
 * Horizontal is the plan's y: south on the left at 0, north on the right at
 * 960. Vertical is height above the deck floor (level with the room floor).
 */
import { FONT, dimH, text, svgDoc } from "./lib.mjs";

const L = 960;
const up = (h) => -h;

const ink = "#3b3a36";
const soft = "#8a877f";
const faint = "#c9c6bd";
const lamp = "#d9931f";
const lampFill = "#fff1cc";
const pw = "#2f6f9f";
const pwFill = "#e4eff8";
const wood = "#c98b52";

const parts = [];
parts.push(`<rect x="-120" y="-420" width="1200" height="660" fill="#fbfaf6"/>`);

parts.push(text(-100, -380, "ผนังหน้า ด้านระเบียง · มองจากระเบียงเข้าหาห้อง", { size: 24, weight: 600, anchor: "start" }));
parts.push(text(-100, -354, "ซ้าย = ทิศใต้ (ครัว) · ขวา = ทิศเหนือ (ทีวี) · ความสูงวัดจากพื้นเดค (ระดับเดียวกับพื้นห้อง)", { size: 14, fill: soft, anchor: "start" }));

const rect = (x, h0, w, h, attrs) => `<rect x="${x}" y="${up(h0 + h)}" width="${w}" height="${h}" ${attrs}/>`;
const label = (x, h, lines, { anchor = "start", fill = pw } = {}) =>
  lines.map((t, i) => text(x, up(h) + 4 + i * 15, t, { size: 12.5, weight: i ? 400 : 600, anchor, fill: i ? ink : fill })).join("");

// Roof underside and the wall up to it.
parts.push(rect(0, 0, L, 300, `fill="#ffffff" stroke="${ink}" stroke-width="1.6"`));
parts.push(rect(-60, 300, L + 120, 14, `fill="#d8d6d0" stroke="${soft}" stroke-width="1"`));
parts.push(text(L / 2, up(318), "ท้องหลังคา / แป", { size: 11, fill: soft }));

// Deck: boards at 0, structure and ground below, steps at each end.
parts.push(rect(-60, -45, L + 120, 45, `fill="#efe6d6" stroke="${soft}" stroke-width="1"`));
parts.push(`<line x1="-60" y1="0" x2="${L + 60}" y2="0" stroke="${ink}" stroke-width="2.4"/>`);
parts.push(`<line x1="-60" y1="${up(-45)}" x2="${L + 60}" y2="${up(-45)}" stroke="${soft}" stroke-width="1.6"/>`);
for (const [x, w] of [[-60, 30], [L + 30, 30]]) parts.push(rect(x, -45, w, 22, `fill="#e8dcc8" stroke="${soft}" stroke-width="0.8"`));
parts.push(text(-45, up(-56), "บันได", { size: 10, fill: soft }));
parts.push(text(L + 45, up(-56), "บันได", { size: 10, fill: soft }));

// LED strip under the deck edge (in front of everything), washing down.
parts.push(`<line x1="-60" y1="${up(-4)}" x2="${L + 60}" y2="${up(-4)}" stroke="${lamp}" stroke-width="3"/>`);
parts.push(text(80, up(-20), "LED strip ใต้ขอบเดค (ขอบนอก ห่างผนัง 200)", { size: 11, fill: lamp, anchor: "start" }));
// D1 driver box under the deck, by the wall.
parts.push(rect(296, -34, 18, 16, `fill="#fff" stroke="${lamp}" stroke-width="1.2" stroke-dasharray="3 2"`));
parts.push(text(305, up(-29), "D1", { size: 9, weight: 600, fill: lamp }));
parts.push(text(320, up(-30), "กล่อง driver กันน้ำใต้เดค", { size: 10, fill: soft, anchor: "start" }));

// Deck-edge posts, 200 in front of the wall, faint.
for (const x of [0, 240, 480, 720, L - 12]) parts.push(rect(x, 0, 12, 300, `fill="none" stroke="${faint}" stroke-width="1.2" stroke-dasharray="6 4"`));
parts.push(text(18, up(160), "เสาขอบเดค", { size: 10, fill: soft, anchor: "start" }), text(18, up(147), "(อยู่หน้าผนัง 200)", { size: 10, fill: soft, anchor: "start" }));

// Sliding door 340–620, 200 high, four panels.
parts.push(rect(340, 0, 280, 200, `fill="#eef3f4" stroke="${ink}" stroke-width="1.6"`));
for (let i = 1; i < 4; i++) parts.push(`<line x1="${340 + 70 * i}" y1="${up(200)}" x2="${340 + 70 * i}" y2="0" stroke="${faint}" stroke-width="1.2"/>`);
parts.push(text(480, up(110), "ประตูบานเลื่อน 280 × 200", { size: 13, fill: soft }));

// Two wooden-box lamps under the purlin, 100 out from the wall, at the quarter points.
for (const c of [240, 720]) {
  parts.push(`<line x1="${c - 50}" y1="${up(300)}" x2="${c - 50}" y2="${up(290)}" stroke="${soft}" stroke-width="1"/>`);
  parts.push(`<line x1="${c + 50}" y1="${up(300)}" x2="${c + 50}" y2="${up(290)}" stroke="${soft}" stroke-width="1"/>`);
  parts.push(rect(c - 65, 278, 130, 12, `rx="1.5" fill="${wood}" stroke="#7d5430" stroke-width="1.2"`));
  parts.push(rect(c - 58, 278, 116, 3, `fill="${lampFill}"`));
  parts.push(`<path d="M${c - 60} ${up(278)} L${c - 110} ${up(200)} L${c + 110} ${up(200)} L${c + 60} ${up(278)} Z" fill="#ffd77a" fill-opacity="0.16"/>`);
}
parts.push(label(240, 262, ["โคมกล่องไม้ ใต้แป", "ห่างผนัง 100 · ท้องโคม ~2.78"], { anchor: "middle", fill: lamp }));
parts.push(label(720, 262, ["โคมกล่องไม้ ใต้แป", "LED batten 120 ซม. 2700K"], { anchor: "middle", fill: lamp }));

// S4: the deck lights' second switch, outside, behind S1/S2 (plan y ≈ 650).
parts.push(rect(645, 113, 10, 14, `rx="1.5" fill="${lampFill}" stroke="${lamp}" stroke-width="1.6"`));
parts.push(rect(643, 111, 14, 18, `rx="2" fill="none" stroke="${lamp}" stroke-width="0.8"`));
parts.push(label(664, 128, ["S4 สวิตช์ไฟระเบียง 2 ทาง", "สูง 120 · กล่องกันน้ำมีฝา", "หลัง S1 S2 ในห้องพอดี"], { fill: lamp }));

// P10: weatherproof double, low.
parts.push(rect(684, 36, 12, 8, `rx="1.5" fill="${pwFill}" stroke="${pw}" stroke-width="1.4"`));
parts.push(rect(682, 34, 16, 12, `rx="2" fill="none" stroke="${pw}" stroke-width="0.8"`));
parts.push(label(704, 52, ["P10 ปลั๊กกันน้ำ IP55", "สูง 40 · มีฝาปิด"]));

// Height scale.
for (const h of [0, 40, 120, 200, 278]) {
  parts.push(`<line x1="-96" y1="${up(h)}" x2="-84" y2="${up(h)}" stroke="${ink}" stroke-width="1"/>`);
  parts.push(text(-100, up(h) + 4, String(h), { size: 12, anchor: "end" }));
}
parts.push(`<line x1="-90" y1="0" x2="-90" y2="${up(300)}" stroke="${ink}" stroke-width="0.8"/>`);

// Positions along the wall.
parts.push(dimH(0, 240, 90, "240"));
parts.push(dimH(240, 340, 90, "100"));
parts.push(dimH(340, 620, 90, "280"));
parts.push(dimH(620, 650, 90, "30"));
parts.push(dimH(650, 720, 90, "70"));
parts.push(dimH(720, L, 90, "240"));

parts.push(text(-100, 150, "· S4 กับ S2 ช่อง 1 ในห้อง คุมไฟระเบียงชุดเดียวกัน (strip ใต้เดค + โคมกล่องไม้ 2 ดวง) ตั้ง Multi-Control ในแอป · S4 ต้องเดินสาย L + N", { size: 13.5, anchor: "start" }));
parts.push(text(-100, 174, "· ระเบียงมีชายคาบังฝน แต่ยังโดนฝนสาดและความชื้น ใช้กล่อง/หน้ากากกันน้ำทั้ง S4 และ P10", { size: 13.5, anchor: "start" }));
parts.push(text(-100, 212, "รูปด้านนอก ผนังหน้า ด้านระเบียง · 22 พ.ย. 2026", { size: 16, anchor: "start" }));

export const wallDeck = svgDoc({ x: -120, y: -420, w: 1200, h: 660, body: parts.join("\n"), font: FONT });
