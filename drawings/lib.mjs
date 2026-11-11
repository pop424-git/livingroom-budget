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
