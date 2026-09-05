import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Netlify reads `_headers` from the configured publish root (`dist`).
const outputDirectory = join(process.cwd(), "dist");

await mkdir(outputDirectory, { recursive: true });
await writeFile(
	join(outputDirectory, "_headers"),
	"/*\n  X-Robots-Tag: noindex, nofollow\n",
	"utf8",
);

console.info("[preview] wrote global X-Robots-Tag noindex header");
