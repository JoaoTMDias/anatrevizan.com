import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	isLocaleComplete,
	localizeValue,
	missingLocalizedPaths,
} from "../src/lib/bilingual.ts";
import {
	validateEditorialDocuments,
	type BilingualEditorialDocument,
} from "../src/lib/editorial.ts";
import { routeKeys } from "../src/lib/routing.ts";
import { EditorialCollection } from "../tina/collections/editorial.ts";

const directory = join(process.cwd(), "src/content/pages");
const pages = readdirSync(directory)
	.filter((file) => file.endsWith(".json"))
	.map(
		(file) =>
			JSON.parse(
				readFileSync(join(directory, file), "utf8"),
			) as BilingualEditorialDocument,
	);

describe("modelo editorial bilingue", () => {
	it("mantém exatamente um documento fixo por cada uma das 19 páginas", () => {
		expect(pages).toHaveLength(19);
		expect(pages.map((page) => page.routeKey).sort()).toEqual(
			[...routeKeys].sort(),
		);
		expect(validateEditorialDocuments(pages)).toEqual([]);
	});

	it("não permite criar, apagar ou renomear páginas no Tina", () => {
		expect(EditorialCollection.ui?.allowedActions).toEqual({
			create: false,
			delete: false,
		});
		expect(EditorialCollection.ui?.filename).toEqual({ readonly: true });
	});

	it("mostra no About apenas os campos comuns, media e secções About", () => {
		const about = EditorialCollection.templates?.find(
			(template) => template.name === "about",
		);
		expect(about?.fields.map((field) => field.name)).toEqual([
			"routeKey",
			"title",
			"summary",
			"seo",
			"media",
			"about",
		]);
		expect(about?.fields.map((field) => field.name)).not.toContain("home");
		expect(about?.fields.map((field) => field.name)).not.toContain(
			"consultingHub",
		);
	});

	it("associa cada documento ao template da respetiva família", () => {
		const templates = new Set(
			EditorialCollection.templates?.map((template) => template.name),
		);
		for (const page of pages)
			expect(templates.has(page._template as string)).toBe(true);
	});

	it("localiza sem fallback português", () => {
		const value = { heading: { pt: "Olá", en: "" }, routeKey: "home" };
		expect(localizeValue(value, "en")).toEqual({
			heading: "",
			routeKey: "home",
		});
		expect(isLocaleComplete(value, "en")).toBe(false);
		expect(missingLocalizedPaths(value, "en")).toEqual(["heading"]);
	});

	it("aceita uma tradução parcial sem invalidar o documento PT", () => {
		const home = pages.find((page) => page.routeKey === "home");
		expect(home).toBeDefined();
		expect(isLocaleComplete(home, "pt-PT")).toBe(true);
		expect(isLocaleComplete(home, "en")).toBe(false);
	});
});
