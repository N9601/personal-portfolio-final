/**
 * Rasterizes public/og.svg to public/og.png (1200x630).
 *
 * Social platforms (X, LinkedIn, WhatsApp, Slack) do not render SVG
 * og:image URLs, so the SVG stays as the editable source and the PNG
 * is what metadata points at.
 *
 * Run from repo root:
 *     node scripts/build_og.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const src = fileURLToPath(new URL("../public/og.svg", import.meta.url));
const out = fileURLToPath(new URL("../public/og.png", import.meta.url));

const png = await sharp(readFileSync(src), { density: 150 })
  .resize(1200, 630)
  .png()
  .toFile(out);

console.log(`Wrote ${out} (${Math.round(png.size / 1024)} KB)`);
