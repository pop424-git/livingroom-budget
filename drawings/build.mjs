/**
 * Renders the dimensioned drawings into public/reference/.
 *
 *   npm run drawings
 *
 * Each drawing is plain SVG built from centimetre figures in its own module,
 * so a change of plan is a change of numbers. The SVG is kept next to the
 * module for review; the gallery shows the raster, which Next can optimise.
 */
// sharp arrives with Next as its image optimiser, so it needs no install of its own.
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { plan, electrical } from "./plan.mjs";
import { elevation } from "./elevation.mjs";
import { section } from "./section.mjs";
import { wiring } from "./wiring.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

// Two pixels per centimetre keeps the dimension text sharp on a phone zoom.
const SCALE = 2;

async function render(name, svg, out, format) {
  writeFileSync(here(`./${name}.svg`), svg);
  const image = sharp(Buffer.from(svg), { density: 72 * SCALE });
  const file = here(`../public/reference/${out}`);
  const info = format === "jpeg" ? await image.flatten({ background: "#ffffff" }).jpeg({ quality: 88 }).toFile(file) : await image.png({ compressionLevel: 9 }).toFile(file);
  console.log(`${out}: ${info.width} × ${info.height}, ${Math.round(info.size / 1024)} KB`);
}

await render("plan", plan, "plan-dimensions.png", "png");
await render("electrical", electrical, "plan-electrical.png", "png");
await render("wiring", wiring, "wiring-diagram.png", "png");
await render("elevation", elevation, "elevation-dimensions.jpg", "jpeg");
await render("section", section, "section-dimensions.jpg", "jpeg");
