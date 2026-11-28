/** Shared helpers for the drawings. All coordinates are centimetres. */

// Leelawadee UI ships with Windows and stacks Thai vowels and tone marks correctly.
export const FONT = "Leelawadee UI, Tahoma, sans-serif";

const INK = "#3b3a36";

// Dimension figures are what people read off the plan, so they get the big type.
const DIM = { size: 20, weight: 500 };

const escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function text(x, y, value, { size = 14, weight = 400, anchor = "middle", fill = INK } = {}) {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}">${escape(value)}</text>`;
}

/** Lines of text stacked around y. */
function lines(x, y, value, opts) {
  const list = Array.isArray(value) ? value : [value];
  const step = (opts.size ?? 14) * 1.25;
  const top = y - ((list.length - 1) * step) / 2;
  return list.map((line, i) => text(x, top + i * step, line, opts)).join("");
}

const tick = (x, y) => `<line x1="${x - 5}" y1="${y + 5}" x2="${x + 5}" y2="${y - 5}" stroke="${INK}" stroke-width="1.3"/>`;

/** Horizontal dimension from x0 to x1 at height y, label above the line. */
export function dimH(x0, x1, y, label) {
  return `<g><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${INK}" stroke-width="0.9"/>${tick(x0, y)}${tick(x1, y)}${lines((x0 + x1) / 2, y - 9, label, DIM)}</g>`;
}

/** Vertical dimension from y0 to y1 at x; label sits on the outer side. */
export function dimV(y0, y1, x, label) {
  const left = x < 0;
  const opts = { ...DIM, anchor: left ? "end" : "start" };
  return `<g><line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${INK}" stroke-width="0.9"/>${tick(x, y0)}${tick(x, y1)}${lines(left ? x - 10 : x + 10, (y0 + y1) / 2 + DIM.size * 0.35, label, opts)}</g>`;
}

export function svgDoc({ x, y, w, h, defs = "", body, font = FONT }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}" font-family="${font}">
<defs>${defs}</defs>
${body}
</svg>
`;
}

/**
 * Steps at each end of the engawa, shared by every drawing.
 *
 * Three treads, so four risers share the 45 drop from deck to ground. Each
 * tread is a slab that runs 8 back under the nosing above it, so the treads
 * nest and the flight stays short. The flight is open, as in the reference
 * photo: no risers and no solid support, only the slabs on two sloping steel
 * stringers set 20 in from each side, so you see through under every tread.
 * The flight is 120 wide, centred on the 200 deck: 40 clear of the gable wall
 * line (the front wall face) and 40 in from the deck's outer edge.
 */
export const STAIR = {
  count: 3,
  width: 120,
  inset: 40, // clear of the wall line, and of the deck's outer edge
  rise: 45 / 4, // 11.25
  going: 20, // nosing to nosing
  lap: 8, // each slab runs this far under the one above
  tread: 28, // going + lap
  slab: 5, // tread board thickness
  stringer: { inset: 20, w: 8, depth: 6 }, // two steel stringers under the slabs
};
STAIR.run = STAIR.count * STAIR.going; // 60 out from the deck end
/** Tread k (1 = top): height of its top below the deck, and its nosing distance from the deck end. */
STAIR.at = (k) => ({ drop: k * STAIR.rise, out: k * STAIR.going });
/**
 * A stringer seen side on, as [out from the deck end, height above ground]
 * points: a sloping bar under the middle of the top and bottom slabs, from the
 * deck's rim beam down to a footing on the ground.
 */
STAIR.stringerSide = (() => {
  const mid = (k) => {
    const { drop, out } = STAIR.at(k);
    return [(Math.max(out - STAIR.tread, 0) + out) / 2, 45 - drop - STAIR.slab];
  };
  const [x1, h1] = mid(1);
  const [x2, h2] = mid(STAIR.count);
  const slope = (h1 - h2) / (x2 - x1);
  const top = (x) => h1 - slope * (x - x1);
  const foot = x1 + h1 / slope; // where the top edge meets the ground
  const d = STAIR.stringer.depth;
  return [[0, top(0)], [foot, 0], [foot - d / slope, 0], [0, top(0) - d]];
})();
