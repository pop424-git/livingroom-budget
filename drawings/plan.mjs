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

// Deck lighting: two circuits on one two-gang switch inside the front door.
const lamp = "#d9931f"; // light fittings and LED strip
const lampFill = "#fff1cc";
const linearX = -T - 100; // wooden-box lamps under the purlin, 100 out from the front wall
const feedY = 486; // fed from the middle, down the rafter at the middle post

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


// ---------------------------------------------------------------------------
// Switches and outlets, for the "power" sheet. Heights are from the finished
// room floor and live in the schedule, since a plan can't show them.
const pw = "#2f6f9f"; // outlets
const pwFill = "#e4eff8";

function tag(x, y, label, { anchor = "start", fill = pw } = {}) {
  const w = label.length * 7 + 8;
  const left = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  return `<rect x="${left}" y="${y - 11}" width="${w}" height="15" rx="3" fill="#fff" stroke="${fill}" stroke-width="0.8"/>${text(left + w / 2, y, label, { size: 10, weight: 600, fill })}`;
}

/** Outlet symbol: kind "duo" (double), "usb", "ip" (weatherproof), "ac" (dedicated). */
function outlet(cx, cy, kind = "duo") {
  if (kind === "ac") return `<rect x="${cx - 6}" y="${cy - 6}" width="12" height="12" fill="${pw}" stroke="${pw}"/><text x="${cx}" y="${cy + 3.5}" font-size="8" font-weight="700" text-anchor="middle" fill="#fff">A</text>`;
  const ring = kind === "ip" ? `<circle cx="${cx}" cy="${cy}" r="9.5" fill="none" stroke="${pw}" stroke-width="1.2"/>` : "";
  const mark =
    kind === "usb"
      ? `<circle cx="${cx}" cy="${cy}" r="2.4" fill="${pw}"/>`
      : `<line x1="${cx - 2.2}" y1="${cy - 3}" x2="${cx - 2.2}" y2="${cy + 3}"/><line x1="${cx + 2.2}" y1="${cy - 3}" x2="${cx + 2.2}" y2="${cy + 3}"/>`;
  return `${ring}<circle cx="${cx}" cy="${cy}" r="6" fill="${pwFill}" stroke="${pw}" stroke-width="1.4"/><g stroke="${pw}" stroke-width="1.3">${mark}</g>`;
}

function switchBox(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${lampFill}" stroke="${lamp}" stroke-width="1.6"/>`;
}

function powerLayer(parts) {
  // S1 three-gang and S2 two-gang, side by side on the east wall between the
  // door frame (620) and the TV (720), on the latch-free side of the opening.
  parts.push(switchBox(2, 630, 10, 14), switchBox(2, 648, 10, 14));
  parts.push(tag(18, 642, "S1 · 3 ช่อง", { fill: lamp }), tag(18, 662, "S2 · 2 ช่อง", { fill: lamp }));

  // Hidden strip (S1 gang 3) along the two long walls only, up at the ceiling:
  // the east wall over the door, and the west wall from the toilet partition
  // to the north corner. The toilet's only light is a hidden strip on its south wall.
  const cove = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lamp}" stroke-width="2.4" stroke-dasharray="2 4" stroke-linecap="round"/>`;
  parts.push(cove(16, 4, 16, 956), cove(384, 166, 384, 956), cove(204, 18, 396, 18));
  parts.push(tag(392, 520, "ไฟซ่อน", { anchor: "end", fill: lamp }));
  parts.push(tag(24, 470, "ไฟซ่อน", { fill: lamp }));
  parts.push(`<path d="M289 162 Q260 80 250 20" fill="none" stroke="${lamp}" stroke-width="1" stroke-dasharray="4 3"/>`);

  // The two ceiling lamps on S1: over the dining table and over the sofa.
  const lampSym = (cx, cy) =>
    `<circle cx="${cx}" cy="${cy}" r="11" fill="${lampFill}" stroke="${lamp}" stroke-width="1.8"/><path d="M${cx - 7.8} ${cy - 7.8} L${cx + 7.8} ${cy + 7.8} M${cx + 7.8} ${cy - 7.8} L${cx - 7.8} ${cy + 7.8}" stroke="${lamp}" stroke-width="1.5"/>`;
  parts.push(`<path d="M12 637 Q130 560 230 358" fill="none" stroke="${lamp}" stroke-width="1" stroke-dasharray="4 3"/>`);
  parts.push(`<path d="M12 641 Q130 700 230 786" fill="none" stroke="${lamp}" stroke-width="1" stroke-dasharray="4 3"/>`);
  parts.push(lampSym(240, 350), tag(256, 354, "L2", { fill: lamp }));
  parts.push(lampSym(240, 790), tag(256, 794, "L1", { fill: lamp }));

  // S3 outside the toilet, on the room face of its partition, latch side of the door.
  parts.push(switchBox(282, 162, 14, 10));
  parts.push(tag(289, 190, "S3", { anchor: "middle", fill: lamp }));
  // Feed lines from S3 to the toilet light and the fan.
  parts.push(`<path d="M289 162 Q300 120 340 120 T392 123" fill="none" stroke="${lamp}" stroke-width="1" stroke-dasharray="4 3"/>`);

  // Consumer unit high on the south wall, over the fridge.
  parts.push(`<rect x="12" y="1" width="36" height="12" fill="#d8d5cc" stroke="${ink}" stroke-width="1.4"/>`);
  parts.push(`<line x1="12" y1="1" x2="48" y2="13" stroke="${ink}" stroke-width="0.8"/>`);
  parts.push(`<line x1="20" y1="13" x2="20" y2="100" stroke="${ink}" stroke-width="0.7"/>`);
  parts.push(tag(4, 112, "ตู้ไฟ เหนือตู้เย็น", { fill: ink }));

  // P1: two doubles hidden behind the TV, under the bracket.
  parts.push(outlet(8, 800));
  parts.push(tag(50, 805, "P1"));
  // P2: a double low on the wall right under the main switches.
  parts.push(outlet(8, 680), tag(20, 694, "P2 ใต้สวิตช์"));

  parts.push(outlet(8, 240), tag(20, 244, "P3")); // east wall, in line with the south deck lamp
  // P4: the kitchen's one double, on the east wall just past the fridge's
  // side, high enough to serve a microwave on top of the fridge as well.
  parts.push(outlet(30, 7), tag(30, 80, "P4", { anchor: "middle" }));
  parts.push(`<line x1="30" y1="13" x2="30" y2="68" stroke="${pw}" stroke-width="0.7"/>`);
  parts.push(outlet(392, 373), tag(378, 350, "P6", { anchor: "end" })); // dining table end

  // Air conditioner on the north wall over the big window, centred on it,
  // blowing down the length of the room; outlet at its west end.
  parts.push(`<rect x="140" y="938" width="100" height="20" fill="none" stroke="${pw}" stroke-width="1.3" stroke-dasharray="6 4"/>`);
  parts.push(text(190, 952, "แอร์", { size: 11, fill: pw }));
  parts.push(outlet(252, 952, "ac"), tag(262, 935, "P7"));

  parts.push(outlet(392, 668, "usb"), tag(296, 672, "P8", { anchor: "end" })); // sofa arm
  parts.push(`<line x1="386" y1="668" x2="298" y2="668" stroke="${pw}" stroke-width="0.7"/>`);
  parts.push(outlet(-22, 690, "ip"), tag(-36, 694, "P10", { anchor: "end" })); // deck, outside face
}

/** Schedule under the power plan. */
function powerSchedule(parts) {
  const x = -370;
  let y = 1062;
  const head = (label) => {
    parts.push(text(x, y, label, { size: 15, weight: 600, anchor: "start" }));
    y += 24;
  };
  const row = (sym, code, label) => {
    if (sym) parts.push(sym(x + 14, y - 5));
    if (code) parts.push(text(x + 34, y, code, { size: 13, weight: 600, anchor: "start", fill: code.startsWith("S") || code.startsWith("L") ? lamp : code.startsWith("C") ? ink : pw }));
    parts.push(text(x + 70, y, label, { size: 13, anchor: "start" }));
    y += 21;
  };
  const sw = (cx, cy) => switchBox(cx - 5, cy - 7, 10, 14);
  const duo = (cx, cy) => outlet(cx, cy);

  head("สวิตช์ · สูง 120 ทุกตัว");
  row(sw, "S1", "3 ช่อง (บน) ระหว่างบานเลื่อนกับทีวี · 1 โคม L1 โซฟา · 2 ไฟซ่อนในห้องทั้งหมด · 3 โคม L2 โต๊ะกินข้าว");
  row(sw, "S2", "2 ช่อง (ล่าง) ใต้ S1 · 1 ไฟระเบียง สั่ง 2 ทาง · 2 ปุ่มฉาก เปิด/ปิด L1 ไฟซ่อน L2 พร้อมกัน");
  row(sw, "S3", "2 ช่อง นอกห้องน้ำ ฝั่งมือจับ · 1 ไฟซ่อนห้องน้ำ · 2 พัดลมดูดอากาศ (หรือสวิตช์ตั้งเวลา หน่วงดับ 5–10 นาที)");
  row((cx, cy) => `<circle cx="${cx}" cy="${cy}" r="8" fill="${lampFill}" stroke="${lamp}" stroke-width="1.6"/><path d="M${cx - 5.6} ${cy - 5.6} L${cx + 5.6} ${cy + 5.6} M${cx + 5.6} ${cy - 5.6} L${cx - 5.6} ${cy + 5.6}" stroke="${lamp}" stroke-width="1.3"/>`, "L", "โคมเพดาน · L1 ระหว่างโซฟากับทีวี · L2 เหนือโต๊ะค่อนมากลางห้อง ท้องโคมสูงจากโต๊ะ 70–80 · เผื่อกล่องต่อสายบนฝ้าตรงจุด");
  row((cx, cy) => `<line x1="${cx - 12}" y1="${cy}" x2="${cx + 12}" y2="${cy}" stroke="${lamp}" stroke-width="2.4" stroke-dasharray="2 4" stroke-linecap="round"/>`, "", "ไฟซ่อน LED strip 24V 2700K ในรางซ่อนชิดฝ้า · ผนังฝั่งประตู 9.6 ม. + ผนังฝั่งห้องน้ำ 8.0 ม. (S1-3)");
  row(null, "", "ห้องน้ำ: ไฟซ่อนผนังทิศใต้ 2.0 ม. ดวงเดียวในห้อง · IP65 (S3-1) · เส้นยาว 8–9.6 ม. ป้อนไฟกลางเส้นหรือสองหัว ไฟไม่ดรอปปลายเส้น");
  row(null, "", "driver ไฟซ่อนวางบนฝ้าใกล้จุดป้อน ทำช่องเซอร์วิสเปิดเปลี่ยนได้ · ห้องน้ำวาง driver นอกห้องน้ำ");
  y += 8;
  head("ปลั๊ก · ปลั๊กคู่มีกราวด์ทุกจุด");
  row(duo, "P1", "หลังทีวี ซ่อนใต้ขาแขวน · สูง 95 · ปลั๊กคู่ 1 ตัว");
  row(duo, "P2", "ใต้สวิตช์ S1 S2 · สูง 30 · ปลั๊กคู่");
  row(duo, "P3", "ผนังข้างประตู ตรงกับโคมระเบียงดวงใต้ · สูง 30");
  row(duo, "P4", "ครัว ปลั๊กคู่ผนังทิศใต้ ซ่อนหลังตู้เย็น · สูง 80 · ตู้เย็น + ไมโครเวฟบนหลังตู้ · ตั้งตู้เย็นห่างผนัง ~8");
  row(duo, "P6", "ผนังปลายโต๊ะกินข้าว · สูง 95 (เหนือท็อปโต๊ะ) · หม้อสุกี้ โน้ตบุ๊ก");
  row((cx, cy) => outlet(cx, cy, "ac"), "P7", "แอร์ 18,000 BTU ผนังหน้าต่างใหญ่ เหนือหน้าต่าง กึ่งกลางบาน · สูง 220 · วงจรแยก + ตัดตอนข้างเครื่อง");
  row((cx, cy) => outlet(cx, cy, "usb"), "P8", "ข้างพนักแขนโซฟา · สูง 70 (พ้นพนัก) · ปลั๊กคู่ + USB-C ชาร์จมือถือ");
  row((cx, cy) => outlet(cx, cy, "ip"), "P10", "นอกผนัง บนระเบียง · สูง 40 · IP55 มีฝาปิด · ช่องเดียวกับ S1/S2 เดินสายสั้น");
  row((cx, cy) => `<rect x="${cx - 6}" y="${cy - 9}" width="12" height="18" fill="#d8d5cc" stroke="${ink}" stroke-width="1.2"/>`, "", "ตู้ไฟ ผนังทิศใต้ เหนือตู้เย็น · ขอบล่าง ~170 · ขอบบน ~210 · พ้นไมโครเวฟบนตู้เย็น · หน้าตู้เปิดได้ไม่ติดอะไร");
  y += 8;
  head("วงจรแนะนำ");
  row(null, "C1", "ไฟในห้อง + ห้องน้ำ + พัดลมดูด · 10A");
  row(null, "C2", "ไฟระเบียง D1 + โคมกล่องไม้ 2 ดวง · 10A");
  row(null, "C3", "ปลั๊กทั่วไป P1 P2 P3 P6 P8 · 16A");
  row(null, "C4", "ครัว P4 · 20A");
  row(null, "C5", "แอร์ P7 · 20A วงจรเดี่ยว");
  row(null, "C6", "ปลั๊กนอก P10 · 16A");
  row(null, "", "ทุกวงจรผ่าน RCBO 30 mA ยกเว้นแอร์ใช้ MCB · ห้องน้ำไม่มีปลั๊ก (ถ้าเพิ่มเครื่องทำน้ำอุ่น แยกวงจร 20A + ELCB)");
}

/** layer: "deck" for the deck-lighting sheet, "power" for switches and outlets. */
function build(layer) {
const power = layer === "power";
const H = power ? 1910 : 1400;
const parts = [];

// Paper and grid.
parts.push(`<rect x="-390" y="-160" width="970" height="${H}" fill="#fbfaf6"/>`);
parts.push(`<rect x="-390" y="-160" width="970" height="${H}" fill="url(#grid)"/>`);

if (power) parts.push(`<g opacity="0.38">`);
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
// Two treads per flight: the step down from the deck, then the step to the ground.
parts.push(`<line x1="${-T - DECK}" y1="-32.5" x2="${-T}" y2="-32.5" stroke="#8a7a64" stroke-width="0.8"/>`);
parts.push(`<line x1="${-T - DECK}" y1="${L + T + 22.5}" x2="${-T}" y2="${L + T + 22.5}" stroke="#8a7a64" stroke-width="0.8"/>`);
parts.push(text(-T - DECK / 2, -39, "บันได 200", { size: 12, fill: soft }));
parts.push(text(-T - DECK / 2, L + 46, "บันได 200", { size: 12, fill: soft }));
parts.push(`<rect x="-185" y="100" width="150" height="62" fill="#f1e8da"/>`);
parts.push(text(-110, 125, "ระเบียง engawa", { size: 17, weight: 600 }));
parts.push(text(-110, 150, `200 × 960 · 19.2 ตร.ม.`, { size: 13, fill: soft }));

if (power) parts.push(`<g opacity="0.3">`);
// Circuit 1: LED strip hidden under the outer deck edge and under the nosing of
// every step, two treads at each end.
const strip = (x1, y1, x2, y2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lamp}" stroke-width="3" stroke-linecap="round"/>`;
parts.push(strip(-T - DECK + 3, -T, -T - DECK + 3, L + T));
for (const y of [-32.5, -53, L + T + 22.5, L + T + 43]) parts.push(strip(-T - DECK + 4, y, -T - 4, y));

// Circuit 2: two wooden-box linear lamps hung under the purlin, one in each
// half of the deck, fed at the middle through the rafter over the middle post
// and on along the purlin to each lamp.
const woodBox = (cx, cy, len) =>
  `<rect x="${cx - 6}" y="${cy - len / 2}" width="12" height="${len}" rx="1.5" fill="#c98b52" stroke="#7d5430" stroke-width="1.2"/><line x1="${cx}" y1="${cy - len / 2 + 5}" x2="${cx}" y2="${cy + len / 2 - 5}" stroke="${lampFill}" stroke-width="3" stroke-linecap="round"/>`;
const boxY = [240, 720]; // quarter points of the deck
parts.push(`<line x1="${-T - DECK}" y1="${feedY}" x2="${-T}" y2="${feedY}" stroke="${soft}" stroke-width="1" stroke-dasharray="8 5"/>`);
parts.push(`<line x1="${linearX}" y1="${boxY[0] + 60}" x2="${linearX}" y2="${boxY[1] - 60}" stroke="${lamp}" stroke-width="1.2" stroke-dasharray="4 3"/>`);
for (const y of boxY) parts.push(woodBox(linearX, y, 120));
parts.push(`<circle cx="${linearX}" cy="${feedY}" r="5" fill="${lamp}"/>`);
parts.push(text(linearX - 10, feedY - 12, "ป้อนไฟกลาง", { size: 11, anchor: "end", fill: lamp }));

// Drivers in weatherproof boxes under the deck, by the wall south of the door.
for (const [x, label] of [[-34, "D1"]]) {
  parts.push(`<rect x="${x}" y="296" width="18" height="16" fill="#fff" stroke="${lamp}" stroke-width="1.4" stroke-dasharray="3 2"/>`);
  parts.push(text(x + 9, 308, label, { size: 9, weight: 600, fill: lamp }));
}
if (power) parts.push(`</g>`);

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

// Switches on the inside face between the door and the TV: the deck's
// two-gang next to the room's three-gang, so every light is at one spot.
if (!power) {
  parts.push(`<rect x="2" y="650" width="10" height="14" fill="${lampFill}" stroke="${lamp}" stroke-width="1.4"/>`);
  parts.push(text(16, 662, "สวิตช์ 2 ช่อง", { size: 11, anchor: "start", fill: lamp }));
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

// Kitchen along the south wall: a 70 bay for the fridge (55 × 55 × 97),
// IKEA KNOXHULT base cabinet 122 × 61 with a single-bowl sink cut into its
// west (right-hand) door section.
parts.push(`<rect x="8" y="2" width="55" height="55" ${fx}/>`);
parts.push(`<line x1="8" y1="10" x2="63" y2="10" stroke="${soft}" stroke-width="1"/>`);
parts.push(text(35, 39, "ตู้เย็น", { size: 14 }));
parts.push(`<rect x="68" y="0" width="122" height="61" ${fx}/>`);
parts.push(`<rect x="152" y="10" width="34" height="42" rx="4" ${thin}/>`);
parts.push(`<circle cx="169" cy="31" r="2.5" fill="${soft}"/>`);
parts.push(`<circle cx="169" cy="5" r="2" fill="none" stroke="${soft}" stroke-width="1"/>`);
parts.push(text(108, 35, "เคาน์เตอร์", { size: 12 }));

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
parts.push(dimH(0, 68, -52, "68"));
parts.push(dimH(68, 190, -52, "122"));
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
if (power) {
  // Strip the base plan to outlines: no names, sizes or dimension lines, so
  // only the switches and outlets carry any writing.
  const start = parts.indexOf(`<g opacity="0.38">`);
  for (let i = parts.length - 1; i > start; i--) {
    if (parts[i].startsWith("<text") || parts[i].startsWith("<g><line")) parts.splice(i, 1);
  }
  parts.push(`</g>`);
  powerLayer(parts);
  powerSchedule(parts);
}
// Deck lighting legend.
if (!power) {
  const x = -370;
  const rows = [
    ["strip", "LED strip 24V 2700K ซ่อนใต้ขอบเดค 9.6 ม. + ใต้จมูกขั้นบันได 4 แนว ~8 ม. · IP65 / บันได IP67 · วงจร 1"],
    ["box", "โคมกล่องไม้ 2 ดวง ห้อยใต้แป ห่างผนัง 100 · กล่องไม้ 12×12 ยาว ~130 ใส่ LED batten 120 ซม. 2700K · วงจร 2"],
    ["rafter", "จันทันแนวเสากลาง · ร้อยสายในจันทันเข้าแป ป้อนไฟกลางเส้น (เจาะ + ร้อยลวดนำก่อนมุงหลังคา)"],
    ["switch", "สวิตช์ 2 ช่องระหว่างบานเลื่อนกับทีวี: 1 strip · 2 โคมกล่องไม้ · D1 กล่อง driver strip กันน้ำใต้เดค"],
  ];
  parts.push(text(x, 1062, "ไฟระเบียง", { size: 15, weight: 600, anchor: "start" }));
  rows.forEach(([kind, label], i) => {
    const y = 1088 + i * 24;
    if (kind === "strip") parts.push(strip(x + 2, y - 4, x + 30, y - 4));
    if (kind === "box") parts.push(`<g transform="rotate(-90 ${x + 16} ${y - 4})">${woodBox(x + 16, y - 4, 30)}</g>`);
    if (kind === "rafter") parts.push(`<line x1="${x + 2}" y1="${y - 4}" x2="${x + 30}" y2="${y - 4}" stroke="${soft}" stroke-width="1" stroke-dasharray="8 5"/>`);
    if (kind === "switch") parts.push(`<rect x="${x + 11}" y="${y - 11}" width="10" height="14" fill="${lampFill}" stroke="${lamp}" stroke-width="1.4"/>`);
    parts.push(text(x + 40, y, label, { size: 13, anchor: "start" }));
  });
}

parts.push(
  power
    ? text(-370, 1716, "ผังปลั๊ก-สวิตช์ · ห้อง 400 × 960 cm · ความสูงวัดจากพื้นสำเร็จในห้อง · 21 พ.ย. 2026", { size: 17, anchor: "start" })
    : text(-370, 1210, "ผังพื้น · ห้อง 400 × 960 cm · 38.4 ตร.ม. · ไฟระเบียง · ปรับ 21 พ.ย. 2026", { size: 17, anchor: "start" })
);

const defs = `
  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse" x="0" y="0">
    <path d="M50 0H0V50" fill="none" stroke="#e3e0d8" stroke-width="1"/>
  </pattern>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="${soft}" stroke-width="1"/>
  </pattern>`;

return svgDoc({ x: -390, y: -160, w: 970, h: H, defs, body: parts.join("\n"), font: FONT });
}

export const plan = build("deck");
export const electrical = build("power");
