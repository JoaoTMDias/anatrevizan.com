import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import {
	type EditorialDocument,
	editorialStatuses,
	validateEditorialDocuments,
} from "../src/lib/editorial.ts";
import {
	editorialLocales,
	isRouteKey,
	publishedLocales,
} from "../src/lib/routing.ts";

const root = process.cwd();
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const jsonFiles = (directory: string, prefix = ""): string[] =>
	readdirSync(directory).flatMap((name) => {
		const absolute = join(directory, name);
		const relative = join(prefix, name);
		return statSync(absolute).isDirectory()
			? jsonFiles(absolute, relative)
			: name.endsWith(".json")
				? [relative]
				: [];
	});
const readCollection = (name: string) => {
	const directory = join(root, "src/content", name);
	return jsonFiles(directory).map((file) => ({
		file,
		value: readJson(join(directory, file)),
	}));
};
const errors: string[] = [];

const publicationDirectory = join(root, "src/content/publications");
const publicationFiles = readdirSync(publicationDirectory).filter((file) =>
	file.endsWith(".md"),
);
const publicationIds = new Set<string>();
if (!publicationFiles.length)
	errors.push("[publications] o snapshot ORCID está vazio");
for (const file of publicationFiles) {
	const source = readFileSync(join(publicationDirectory, file), "utf8");
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match) {
		errors.push(`[publications/${file}] frontmatter YAML ausente`);
		continue;
	}
	const value = parse(match[1]) as Record<string, unknown>;
	for (const field of ["sourceId", "orcidPutCode", "title", "type", "source"])
		if (value[field] == null || value[field] === "")
			errors.push(
				`[publications/${file}] campo ORCID obrigatório ausente: ${field}`,
			);
	if (typeof value.sourceId === "string") {
		if (publicationIds.has(value.sourceId))
			errors.push(
				`[publications/${file}] sourceId duplicado: ${value.sourceId}`,
			);
		publicationIds.add(value.sourceId);
	}
	if (typeof value.url === "string" && !value.url.startsWith("https://"))
		errors.push(`[publications/${file}] URL não HTTPS: ${value.url}`);
	if (
		typeof value.priority === "number" &&
		(!Number.isInteger(value.priority) || value.priority < 1)
	)
		errors.push(`[publications/${file}] prioridade editorial inválida`);
}

const pages = readCollection("editorial").map(({ file, value }) => ({
	file,
	value: {
		...value,
		seoTitle: value.seo?.title,
		seoDescription: value.seo?.description,
	} as EditorialDocument,
}));
for (const issue of validateEditorialDocuments(pages.map(({ value }) => value)))
	errors.push(`[pages/${issue.code}] ${issue.message}`);
for (const { file, value } of pages)
	if (file.split("/")[0] !== value.locale)
		errors.push(`[pages/${file}] diretório e locale não correspondem`);

for (const collection of [
	"services",
	"events",
	"talks",
	"training",
	"mentoring",
]) {
	const documents = readCollection(collection);
	const seenSlugs = new Set<string>();
	const groups = new Map<string, Set<string>>();
	for (const { file, value } of documents) {
		if (file.split("/")[0] !== value.locale)
			errors.push(
				`[${collection}/${file}] diretório e locale não correspondem`,
			);
		if (!editorialLocales.includes(value.locale))
			errors.push(`[${collection}/${file}] locale inválido: ${value.locale}`);
		if (!editorialStatuses.includes(value.status))
			errors.push(`[${collection}/${file}] estado inválido: ${value.status}`);
		if (value.status === "ready" && value.approvalPending)
			errors.push(`[${collection}/${file}] ready ainda por aprovar`);
		if (!isRouteKey(value.parentRouteKey))
			errors.push(
				`[${collection}/${file}] parentRouteKey inválido: ${value.parentRouteKey}`,
			);
		const slug = `${value.locale}:${value.slug}`;
		if (seenSlugs.has(slug))
			errors.push(`[${collection}/${file}] slug duplicado: ${slug}`);
		seenSlugs.add(slug);
		if (!groups.has(value.translationGroup))
			groups.set(value.translationGroup, new Set());
		groups.get(value.translationGroup)?.add(value.locale);
	}
	for (const [group, locales] of groups)
		for (const locale of publishedLocales)
			if (!locales.has(locale))
				errors.push(`[${collection}/${group}] tradução ${locale} ausente`);
}

const config = readJson(join(root, "src/content/config/site.json"));
for (const item of config.navigation ?? []) {
	if (!isRouteKey(item.routeKey))
		errors.push(`[navigation] routeKey inválido: ${item.routeKey}`);
	if (item.type === "menu" && !(item.children?.length > 0))
		errors.push(`[navigation/${item.routeKey}] menu sem filhos`);
	for (const child of item.children ?? [])
		if (!isRouteKey(child.routeKey))
			errors.push(
				`[navigation/${item.routeKey}] filho inválido: ${child.routeKey}`,
			);
}
for (const cta of config.ctas ?? [])
	if (cta.routeKey && !isRouteKey(cta.routeKey))
		errors.push(`[cta/${cta.id}] routeKey inválido: ${cta.routeKey}`);

if (errors.length) {
	console.error(
		`Validação editorial falhou com ${errors.length} problema(s):\n${errors.map((error) => `- ${error}`).join("\n")}`,
	);
	process.exitCode = 1;
} else {
	console.log(
		`Validação editorial passou: ${pages.length} páginas, modelos repetíveis e ${publicationFiles.length} publicações ORCID válidos.`,
	);
}
