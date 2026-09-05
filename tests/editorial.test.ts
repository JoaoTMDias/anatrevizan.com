import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	isLocaleComplete,
	localizeValue,
	missingLocalizedPaths,
} from "../src/lib/bilingual.ts";
import {
	type BilingualEditorialDocument,
	shouldRenderEditorialDocument,
	validateEditorialDocuments,
} from "../src/lib/editorial.ts";
import { routeKeys } from "../src/lib/routing.ts";

const directory = join(process.cwd(), "src/content/pages");
const pages = readdirSync(directory)
	.filter((file) => file.endsWith(".json"))
	.map(
		(file) =>
			JSON.parse(
				readFileSync(join(directory, file), "utf8"),
			) as BilingualEditorialDocument,
	);

describe("publicação editorial bilingue", () => {
	it("mantém exatamente as 14 páginas PT obrigatórias", () => {
		expect(pages).toHaveLength(14);
		expect(pages.map((page) => page.routeKey).sort()).toEqual(
			[...routeKeys].sort(),
		);
		expect(validateEditorialDocuments(pages)).toEqual([]);
		for (const page of pages)
			expect(isLocaleComplete(page, "pt-PT")).toBe(true);
	});

	it("localiza inglês sem recorrer ao português", () => {
		const value = { heading: { pt: "Olá", en: "" }, routeKey: "home" };
		expect(localizeValue(value, "en")).toEqual({
			heading: "",
			routeKey: "home",
		});
		expect(missingLocalizedPaths(value, "en")).toEqual(["heading"]);
		expect(isLocaleComplete(value, "en")).toBe(false);
	});

	it("não publica traduções EN incompletas", () => {
		const incomplete = {
			routeKey: "home" as const,
			locale: "en" as const,
			title: "",
			seoTitle: "",
			seoDescription: "",
			complete: false,
		};
		expect(shouldRenderEditorialDocument(incomplete, true, false)).toBe(false);
	});

	it("bloqueia regressões de traduções EN já publicadas", () => {
		const home = pages.find((page) => page.routeKey === "home");
		expect(home).toBeDefined();
		const regressedHome = structuredClone(home) as typeof home & {
			title: { pt: string; en: string };
		};
		regressedHome.title.en = "";
		const regressedPages = pages.map((page) =>
			page.routeKey === "home" ? regressedHome : page,
		);
		expect(validateEditorialDocuments(regressedPages, ["home"])).toContainEqual(
			{
				code: "published-english-regression",
				message: "home: uma tradução inglesa já publicada ficou incompleta",
			},
		);
	});

	it("considera rich text EN vazio incompleto", () => {
		const value = {
			body: {
				pt: {
					type: "root",
					children: [
						{ type: "p", children: [{ type: "text", text: "Texto" }] },
					],
				},
				en: { type: "root", children: [] },
			},
		};
		expect(missingLocalizedPaths(value, "en")).toEqual(["body"]);
	});
});
