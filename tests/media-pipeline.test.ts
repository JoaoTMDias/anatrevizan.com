import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";
import {
	buildMediaVariants,
	responsiveCssImage,
	responsiveSrcSet,
	sanitizeSvg,
} from "../src/lib/media-pipeline.ts";

describe("pipeline de media", () => {
	it("remove scripts, eventos e URLs executáveis de SVG", () => {
		const unsafe =
			'<svg onload="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">x</a></svg>';
		const safe = sanitizeSvg(unsafe);
		expect(safe).not.toMatch(/script|onload|javascript:/i);
		expect(safe).toContain("<svg");
	});

	it("gera URLs responsivas estáveis para raster", () => {
		expect(responsiveSrcSet("/uploads/retrato.jpg")).toBe(
			"/_media/uploads/retrato-480.webp 480w, /_media/uploads/retrato-960.webp 960w, /_media/uploads/retrato-1440.webp 1440w",
		);
		expect(responsiveSrcSet("/marca.svg")).toBeUndefined();
		expect(responsiveCssImage("/uploads/hero.png")).toContain("image-set(");
	});

	it("produz variantes raster e copia SVG sanitizado", async () => {
		const temporary = await mkdtemp(join(tmpdir(), "editorial-media-"));
		const source = join(temporary, "public");
		const output = join(temporary, "output");
		try {
			await mkdir(join(source, "uploads"), { recursive: true });
			await sharp({ create: { width: 32, height: 32, channels: 3, background: "red" } })
				.jpeg()
				.toFile(join(source, "uploads", "small.jpg"));
			await writeFile(join(source, "unsafe.svg"), '<svg onload="x"><script>x</script></svg>');
			await buildMediaVariants(source, output);
			for (const width of [480, 960, 1440])
				expect(await readFile(join(output, "_media", "uploads", `small-${width}.webp`))).not.toHaveLength(0);
			expect(await readFile(join(output, "unsafe.svg"), "utf8")).toBe("<svg></svg>");
		} finally {
			await rm(temporary, { recursive: true, force: true });
		}
	});
});
