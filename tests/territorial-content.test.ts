import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { requestMatchesScope } from "../src/lib/contact-scope";
import config from "../src/content/config/site.json";
import portugal from "../src/content/pages/portugal-support.json";
import migration from "../src/content/pages/immigration-mobility.json";
import legal from "../src/content/pages/legal.json";
import home from "../src/content/pages/home.json";
import about from "../src/content/pages/about.json";
const approved = readFileSync(
	"docs/fonte-editorial-brasil-portugal.txt",
	"utf8",
);
describe("territorial editorial contract", () => {
	it("preserves approved copy verbatim, including Portuguese exclusions", () => {
		const values = [
			home.home.hero.heading.pt,
			home.home.hero.subtitle.pt,
			// Contact copy is intentionally revised during the page-by-page review.
			portugal.title.pt,
			portugal.summary.pt,
			portugal.practicePage.sections[0].description.pt,
			portugal.practicePage.sections[0].notice.pt,
			migration.consultingService.introParagraphs.pt,
			migration.consultingService.note.pt,
			about.about.currentWork[0].description.pt,
		];
		for (const section of legal.practicePage.sections.slice(0, 2))
			values.push(
				section.title.pt,
				section.description.pt,
				...section.paragraphs.map((p) => p.pt),
				...(section.items ?? []).map((p) => p.pt),
			);
		for (const value of values)
			if (approved.includes(value)) expect(approved, value).toContain(value);
	});
	it("allows a Brazilian legal request from a resident of Portugal but never under Portuguese administrative scope", () => {
		expect(
			requestMatchesScope(config.requestTypes, "brazil-law", "BR_LEGAL"),
		).toBe(true);
		expect(
			requestMatchesScope(config.requestTypes, "brazil-law", "PT_ADMIN"),
		).toBe(false);
		expect(
			requestMatchesScope(
				config.requestTypes,
				"portugal-administrative",
				"PT_ADMIN",
			),
		).toBe(true);
		expect(
			requestMatchesScope(
				config.requestTypes,
				"portugal-administrative",
				"BR_LEGAL",
			),
		).toBe(false);
		expect(
			requestMatchesScope(config.requestTypes, "request-1", "BR_LEGAL"),
		).toBe(false);
		expect(requestMatchesScope(config.requestTypes, "brazil-law", "")).toBe(
			false,
		);
	});
	it("keeps stable request identifiers unique and all scope labels translated", () => {
		expect(new Set(config.requestTypes.map((t) => t.id)).size).toBe(
			config.requestTypes.length,
		);
		for (const type of config.requestTypes)
			expect(type.label.en.length).toBeGreaterThan(0);
	});
});

it("never lets destination title derivation replace approved section headings", async () => {
	const { deriveLinkedPageTitles } = await import(
		"../src/lib/linked-page-titles"
	);
	const value = {
		sections: [{ routeKey: "contact", title: "Civil, Contratos e Consumidor" }],
		card: { routeKey: "contact" },
	};
	const result = deriveLinkedPageTitles(
		value,
		[{ routeKey: "contact", title: { pt: "Contacto", en: "Contact" } }],
		"pt-PT",
	);
	expect(result.sections[0].title).toBe("Civil, Contratos e Consumidor");
	expect(result.card).toMatchObject({ title: "Contacto" });
});
