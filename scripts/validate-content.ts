import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import publishedEnglishRoutes from "../src/content/published-en.json" with {
	type: "json",
};
import {
	isLocalizedValue,
	missingLocalizedPaths,
} from "../src/lib/bilingual.ts";
import {
	type BilingualEditorialDocument,
	validateEditorialDocuments,
} from "../src/lib/editorial.ts";
import { isRouteKey, type RouteKey } from "../src/lib/routing.ts";

const root = process.cwd();
const errors: string[] = [];
const directory = join(root, "src/content/pages");
const pages = readdirSync(directory)
	.filter((file) => file.endsWith(".json"))
	.map((file) => ({
		file,
		value: JSON.parse(
			readFileSync(join(directory, file), "utf8"),
		) as BilingualEditorialDocument,
	}));
const invalidPublishedRoutes = publishedEnglishRoutes.filter(
	(route) => !isRouteKey(route),
);
for (const route of invalidPublishedRoutes)
	errors.push(`[pages/published-en] rota inválida: ${route}`);
for (const issue of validateEditorialDocuments(
	pages.map(({ value }) => value),
	publishedEnglishRoutes.filter(isRouteKey) as RouteKey[],
))
	errors.push(`[pages/${issue.code}] ${issue.message}`);
for (const { file, value } of pages) {
	if (`${value.routeKey}.json` !== file)
		errors.push(
			`[pages/${file}] o nome fixo não corresponde à rota ${value.routeKey}`,
		);
	const walk = (node: unknown, path = "") => {
		if (isLocalizedValue(node)) return;
		if (Array.isArray(node))
			return node.forEach((child, index) => walk(child, `${path}[${index}]`));
		if (!node || typeof node !== "object") return;
		const record = node as Record<string, unknown>;
		if (
			typeof record.image === "string" &&
			record.image.trim() !== "" &&
			"decorative" in record &&
			record.decorative !== true
		) {
			const alt = record.alt;
			if (
				!isLocalizedValue(alt) ||
				typeof alt.pt !== "string" ||
				alt.pt.trim() === ""
			)
				errors.push(
					`[pages/${file}] imagem não decorativa sem alt PT-PT em ${path}`,
				);
		}
		for (const [key, child] of Object.entries(node)) {
			const childPath = path ? `${path}.${key}` : key;
			if (
				(key === "url" || key === "externalUrl") &&
				typeof child === "string" &&
				child &&
				!child.startsWith("https://") &&
				!child.startsWith("mailto:")
			)
				errors.push(`[pages/${file}] destino inseguro em ${childPath}`);
			walk(child, childPath);
		}
	};
	walk(value);
	if (missingLocalizedPaths(value, "pt-PT").length)
		errors.push(`[pages/${file}] PT-PT incompleto`);
}

const publicationDirectory = join(root, "src/content/publications");
const publicationFiles = readdirSync(publicationDirectory).filter((file) =>
	file.endsWith(".md"),
);
const ids = new Set<string>();
for (const file of publicationFiles) {
	const source = readFileSync(join(publicationDirectory, file), "utf8");
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) {
		errors.push(`[publications/${file}] frontmatter ausente`);
		continue;
	}
	const value = parse(match[1]) as Record<string, unknown>;
	for (const field of ["sourceId", "orcidPutCode", "title", "type", "source"])
		if (value[field] == null || value[field] === "")
			errors.push(`[publications/${file}] campo obrigatório ausente: ${field}`);
	if (typeof value.sourceId === "string") {
		if (ids.has(value.sourceId))
			errors.push(`[publications/${file}] sourceId duplicado`);
		ids.add(value.sourceId);
	}
	if (typeof value.url === "string" && !value.url.startsWith("https://"))
		errors.push(`[publications/${file}] URL não HTTPS`);
}

if (errors.length) {
	console.error(
		`Validação editorial falhou com ${errors.length} problema(s):\n${errors.map((error) => `- ${error}`).join("\n")}`,
	);
	process.exitCode = 1;
} else
	console.log(
		`Validação editorial passou: ${pages.length} páginas bilingues e ${publicationFiles.length} publicações ORCID válidas.`,
	);
