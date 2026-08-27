import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import sharp from "sharp";

const rasterExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const allowedDownloads = new Set([".pdf", ".mp3", ".mp4"]);

export function sanitizeSvg(source: string): string {
	return source
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
		.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, "")
		.replace(
			/\s(?:href|xlink:href)\s*=\s*(["'])\s*(?:javascript:|data:text\/html)[\s\S]*?\1/gi,
			"",
		);
}

async function files(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	return (
		await Promise.all(
			entries.map((entry) =>
				entry.isDirectory()
					? files(join(directory, entry.name))
					: [join(directory, entry.name)],
			),
		)
	).flat();
}

export async function buildMediaVariants(
	publicDirectory: string,
	outputDirectory: string,
): Promise<void> {
	const generated = join(outputDirectory, "_media");
	for (const source of await files(publicDirectory)) {
		const extension = extname(source).toLowerCase();
		const destination = join(
			outputDirectory,
			relative(publicDirectory, source),
		);
		if (extension === ".svg")
			await writeFile(destination, sanitizeSvg(await readFile(source, "utf8")));
		if (rasterExtensions.has(extension)) {
			const metadata = await sharp(source).metadata();
			for (const width of [480, 960, 1440].filter(
				(candidate) => !metadata.width || candidate < metadata.width,
			)) {
				const target = join(
					generated,
					relative(publicDirectory, source).replace(
						/\.[^.]+$/,
						`-${width}.webp`,
					),
				);
				await mkdir(join(target, ".."), { recursive: true });
				await sharp(source)
					.resize({ width, withoutEnlargement: true })
					.webp({ quality: 82 })
					.toFile(target);
			}
		}
		if (
			!rasterExtensions.has(extension) &&
			extension !== ".svg" &&
			allowedDownloads.has(extension)
		)
			await stat(source);
	}
}
