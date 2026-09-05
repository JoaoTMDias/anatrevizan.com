import {
	access,
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
	buildMediaVariants,
	isDownloadMedia,
	isRasterMedia,
	responsiveCssImage,
	responsiveSrcSet,
	sanitizeSvg,
} from "../src/lib/media-pipeline.ts";

describe("pipeline de media", () => {
	it("mantém todas as imagens editoriais em formatos renderizáveis e existentes", async () => {
		const pagesDirectory = join(process.cwd(), "src/content/pages");
		const imagePaths: string[] = [];
		const collectImages = (value: unknown): void => {
			if (Array.isArray(value)) {
				for (const item of value) collectImages(item);
				return;
			}
			if (!value || typeof value !== "object") return;
			for (const [key, child] of Object.entries(value)) {
				if (key === "image" && typeof child === "string" && child)
					imagePaths.push(child);
				else collectImages(child);
			}
		};

		for (const file of await readdir(pagesDirectory))
			if (file.endsWith(".json"))
				collectImages(
					JSON.parse(await readFile(join(pagesDirectory, file), "utf8")),
				);

		expect(imagePaths.length).toBeGreaterThan(0);
		for (const path of imagePaths) {
			expect(isRasterMedia(path) || path.toLowerCase().endsWith(".svg")).toBe(
				true,
			);
			expect(isDownloadMedia(path)).toBe(false);
			await expect(
				access(join(process.cwd(), "public", path.replace(/^\//, ""))),
			).resolves.toBeUndefined();
		}
	});

	it("remove scripts, eventos e URLs executáveis de SVG", () => {
		const unsafe =
			'<svg onload="alert(1)"><script>alert(1)</script><foreignObject><iframe src="https://example.com"></iframe></foreignObject><path onclick=alert(1) style="fill:url(javascript:alert(1))"/><a href="javascript:alert(1)">x</a></svg>';
		const safe = sanitizeSvg(unsafe);
		expect(safe).not.toMatch(
			/script|foreignObject|iframe|onload|onclick|style=|javascript:/i,
		);
		expect(safe).toContain("<svg");
	});

	it("gera URLs responsivas estáveis para raster", () => {
		expect(responsiveSrcSet("/uploads/retrato.jpg")).toBe(
			"/_media/uploads/retrato-480.webp 480w, /_media/uploads/retrato-960.webp 960w, /_media/uploads/retrato-1440.webp 1440w",
		);
		expect(responsiveSrcSet("/marca.svg")).toBeUndefined();
		expect(responsiveCssImage("/uploads/hero.png")).toContain("image-set(");
		expect(isDownloadMedia("/files/documento.PDF")).toBe(true);
		expect(isDownloadMedia("/uploads/retrato.webp")).toBe(false);
	});

	it("produz variantes raster e copia SVG sanitizado", async () => {
		const temporary = await mkdtemp(join(tmpdir(), "editorial-media-"));
		const source = join(temporary, "public");
		const output = join(temporary, "output");
		try {
			await mkdir(join(source, "uploads"), { recursive: true });
			await sharp({
				create: { width: 32, height: 32, channels: 3, background: "red" },
			})
				.jpeg()
				.toFile(join(source, "uploads", "small.jpg"));
			await writeFile(
				join(source, "unsafe.svg"),
				'<svg onload="x"><script>x</script></svg>',
			);
			await writeFile(join(source, "documento.pdf"), "conteúdo PDF");
			await writeFile(join(source, "audio.mp3"), "conteúdo MP3");
			await writeFile(join(source, "video.mp4"), "conteúdo MP4");
			await buildMediaVariants(source, output);
			for (const width of [480, 960, 1440])
				expect(
					await readFile(
						join(output, "_media", "uploads", `small-${width}.webp`),
					),
				).not.toHaveLength(0);
			expect(await readFile(join(output, "unsafe.svg"), "utf8")).toBe(
				"<svg></svg>",
			);
			for (const name of ["documento.pdf", "audio.mp3", "video.mp4"])
				expect(await readFile(join(output, name), "utf8")).toBe(
					`conteúdo ${name.slice(name.lastIndexOf(".") + 1).toUpperCase()}`,
				);
		} finally {
			await rm(temporary, { recursive: true, force: true });
		}
	});
});
