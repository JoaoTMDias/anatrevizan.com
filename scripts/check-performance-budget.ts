import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

type Size = { raw: number; gzip: number };
type Budget = Record<"javascript" | "css" | "media", Size> & {
	sourceMaps: Size;
};

const root = process.cwd();
const output = resolve(root, "dist/client");
const baselinePath = resolve(root, "tests/performance-budget.json");
const htmlFiles: string[] = [];
const allFiles: string[] = [];

function walk(directory: string) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory() && relative(output, path) === "admin") continue;
		if (entry.isDirectory()) walk(path);
		else {
			allFiles.push(path);
			if (entry.name.endsWith(".html")) htmlFiles.push(path);
		}
	}
}

walk(output);
const referenced = new Set<string>();
for (const html of htmlFiles) {
	const source = readFileSync(html, "utf8");
	for (const [, value] of source.matchAll(
		/(?:src|href|poster)=["']([^"'#?]+)["']/g,
	)) {
		if (!value.startsWith("/")) continue;
		const path = resolve(output, value.slice(1));
		if (path.startsWith(output) && statExists(path)) referenced.add(path);
	}
}

function statExists(path: string) {
	try {
		return statSync(path).isFile();
	} catch {
		return false;
	}
}

function sum(paths: string[]): Size {
	return paths.reduce<Size>(
		(total, path) => {
			const bytes = readFileSync(path);
			total.raw += bytes.byteLength;
			total.gzip += gzipSync(bytes).byteLength;
			return total;
		},
		{ raw: 0, gzip: 0 },
	);
}

function inlineSize(tag: "script" | "style"): Size {
	const chunks = htmlFiles.flatMap((html) => {
		const source = readFileSync(html, "utf8");
		return [
			...source.matchAll(
				new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g"),
			),
		]
			.map((match) => Buffer.from(match[1]))
			.filter((chunk) => chunk.byteLength > 0);
	});
	return chunks.reduce<Size>(
		(total, bytes) => ({
			raw: total.raw + bytes.byteLength,
			gzip: total.gzip + gzipSync(bytes).byteLength,
		}),
		{ raw: 0, gzip: 0 },
	);
}

function add(left: Size, right: Size): Size {
	return { raw: left.raw + right.raw, gzip: left.gzip + right.gzip };
}

const byExtension = (extensions: string[]) =>
	[...referenced].filter((path) =>
		extensions.includes(extname(path).toLowerCase()),
	);
const current: Budget = {
	javascript: add(
		sum(allFiles.filter((path) => [".js", ".mjs"].includes(extname(path)))),
		inlineSize("script"),
	),
	css: add(
		sum(allFiles.filter((path) => extname(path) === ".css")),
		inlineSize("style"),
	),
	media: sum(
		byExtension([
			".avif",
			".gif",
			".jpeg",
			".jpg",
			".mp3",
			".mp4",
			".png",
			".svg",
			".webp",
			".woff2",
		]),
	),
	sourceMaps: sum(allFiles.filter((path) => path.endsWith(".map"))),
};

const baseline = JSON.parse(readFileSync(baselinePath, "utf8")) as Budget;
let warned = false;
for (const category of ["javascript", "css", "media"] as const) {
	for (const metric of ["raw", "gzip"] as const) {
		const limit = Math.ceil(baseline[category][metric] * 1.1);
		if (current[category][metric] > limit) {
			warned = true;
			console.warn(
				`::warning title=Performance budget::${category} ${metric} grew from ${baseline[category][metric]} to ${current[category][metric]} bytes (>10%)`,
			);
		}
	}
}

console.log(JSON.stringify({ baseline, current, warned }, null, 2));
console.log(
	`Measured ${referenced.size} referenced assets from ${htmlFiles.length} HTML files in ${relative(root, output)}.`,
);
