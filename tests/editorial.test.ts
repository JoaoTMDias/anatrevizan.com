import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	type EditorialDocument,
	isEditorialPreviewEnabled,
	isPublishable,
	shouldRenderEditorialDocument,
	validateEditorialDocuments,
} from "../src/lib/editorial.ts";
import { islandContextFromParams } from "../src/lib/island-context.ts";
import { pathFor, publishedLocales, routeKeys } from "../src/lib/routing.ts";

const docs = routeKeys.flatMap((routeKey) =>
	publishedLocales.map((locale) => ({
		translationGroup: routeKey,
		locale,
		routeKey,
		slug: pathFor(routeKey, locale)
			.replace(/^\/en\/?/, "/")
			.replace(/^\//, ""),
		status: "draft" as const,
		title: routeKey,
		seoTitle: routeKey,
		seoDescription: routeKey,
		approvalPending: true,
	})),
);
const jsonFiles = (directory: string): string[] =>
	readdirSync(directory).flatMap((name) => {
		const absolute = join(directory, name);
		return statSync(absolute).isDirectory()
			? jsonFiles(absolute)
			: name.endsWith(".json")
				? [absolute]
				: [];
	});

describe("editorial validation", () => {
	it("accepts complete structural documents", () =>
		expect(validateEditorialDocuments(docs)).toEqual([]));

	it("validates the 38 real Tina documents and navigation menus", () => {
		const actual = jsonFiles(join(process.cwd(), "src/content/editorial")).map(
			(file) => {
				const value = JSON.parse(readFileSync(file, "utf8"));
				return {
					...value,
					seoTitle: value.seo.title,
					seoDescription: value.seo.description,
				} as EditorialDocument;
			},
		);
		expect(actual).toHaveLength(38);
		expect(validateEditorialDocuments(actual)).toEqual([]);

		const config = JSON.parse(
			readFileSync(join(process.cwd(), "src/content/config/site.json"), "utf8"),
		);
		const menus = config.navigation.filter(
			(item: { type: string }) => item.type === "menu",
		);
		expect(menus.map((item: { routeKey: string }) => item.routeKey)).toEqual([
			"consulting",
			"academic",
		]);
		expect(
			menus.map((item: { children: unknown[] }) => item.children.length),
		).toEqual([5, 5]);
		for (const menu of menus)
			for (const child of menu.children)
				expect(routeKeys).toContain(child.routeKey);
	});

	it("accounts for every Home and About source string in the phase 2 manifest", () => {
		const home = JSON.parse(
			readFileSync(
				join(process.cwd(), "src/content/editorial/pt-PT/home.json"),
				"utf8",
			),
		);
		const about = JSON.parse(
			readFileSync(
				join(process.cwd(), "src/content/editorial/pt-PT/about.json"),
				"utf8",
			),
		);
		const manifest = readFileSync(
			join(process.cwd(), "docs/especificacao-editorial-home-sobre.md"),
			"utf8",
		);

		const homeSourceStrings = [
			home.home.hero.heading,
			home.home.hero.subtitle,
			...home.home.hero.brandWords,
			...home.home.gateways.flatMap(
				(item: { eyebrow: string; description: string }) => [
					item.eyebrow,
					item.description,
				],
			),
			home.home.differencesTitle,
			home.home.differencesSubtitle,
			...home.home.differences.flatMap(
				(item: { title: string; description: string }) => [
					item.title,
					item.description,
				],
			),
			home.home.servicesTitle,
			home.home.servicesSubtitle,
			home.home.academicTitle,
			home.home.academicSubtitle,
			home.home.credentialsLabel,
			...home.home.credentials,
			home.home.finalCtaHeading,
			home.home.finalCtaText,
		];
		const aboutSourceStrings = [
			about.title,
			about.about.tag,
			about.about.subtitle,
			...about.about.narrative,
			about.about.milestonesTitle,
			...about.about.milestones.flatMap(
				(item: { year: string; title: string; description: string }) => [
					item.year,
					item.title,
					item.description,
				],
			),
			about.about.currentWorkTitle,
			...about.about.currentWork.flatMap(
				(item: { title: string; description: string }) => [
					item.title,
					item.description,
				],
			),
			about.about.valuesTitle,
			about.about.valuesSubtitle,
			...about.about.values.flatMap(
				(item: { title: string; description: string }) => [
					item.title,
					item.description,
				],
			),
			about.about.networksLabel,
			...about.about.networks,
			about.about.finalCtaHeading,
			about.about.finalCtaText,
		];

		expect(homeSourceStrings).toHaveLength(33);
		expect(aboutSourceStrings).toHaveLength(57);
		expect(
			homeSourceStrings.every(
				(value) => typeof value === "string" && value.length > 0,
			),
		).toBe(true);
		expect(
			aboutSourceStrings.every(
				(value) => typeof value === "string" && value.length > 0,
			),
		).toBe(true);
		expect(home.status).toBe("draft");
		expect(about.status).toBe("draft");
		expect(home.approvalPending && about.approvalPending).toBe(true);
		expect(home.seo.noindex && about.seo.noindex).toBe(true);
		expect(manifest).toContain("33 + 57 strings");
		expect(manifest).toContain("33 assets hero de zero bytes");
		expect(manifest).toContain("tradução inválida");
	});

	it("keeps invalid English copies out of the migrated page models", () => {
		for (const name of ["home", "about"]) {
			const value = JSON.parse(
				readFileSync(
					join(process.cwd(), `src/content/editorial/en/${name}.json`),
					"utf8",
				),
			);
			expect(value.locale).toBe("en");
			expect(value.status).toBe("draft");
			expect(value.approvalPending).toBe(true);
			expect(value.seo.noindex).toBe(true);
			expect(value[name]).toBeUndefined();
		}
	});

	it.each([
		[
			"duplicate-slug",
			() =>
				validateEditorialDocuments([
					...docs,
					{ ...docs[1], translationGroup: "other", routeKey: "about" as const },
				]),
		],
		[
			"invalid-locale",
			() =>
				validateEditorialDocuments([
					{ ...docs[0], locale: "pt-BR" } as unknown as EditorialDocument,
					...docs.slice(1),
				]),
		],
		[
			"missing-translation",
			() =>
				validateEditorialDocuments(
					docs.filter(
						(doc) => !(doc.routeKey === "about" && doc.locale === "en"),
					),
				),
		],
	])("detects %s", (code, validate) =>
		expect(validate().some((issue) => issue.code === code)).toBe(true),
	);

	it("accepts only draft and ready states, requiring approval for publication", () => {
		expect(isPublishable(docs[0])).toBe(false);
		expect(
			isPublishable({ ...docs[0], status: "ready", approvalPending: true }),
		).toBe(false);
		expect(
			isPublishable({ ...docs[0], status: "ready", approvalPending: false }),
		).toBe(true);
		expect(
			validateEditorialDocuments([
				{ ...docs[0], status: "published" } as unknown as EditorialDocument,
				...docs.slice(1),
			]).some((issue) => issue.code === "invalid-status"),
		).toBe(true);
	});

	it("separates preview mode from production publication rules", () => {
		expect(isEditorialPreviewEnabled({ dev: false })).toBe(false);
		expect(
			isEditorialPreviewEnabled({ dev: false, editorialPreview: "true" }),
		).toBe(true);
		expect(
			isEditorialPreviewEnabled({ dev: false, editorialPreview: "false" }),
		).toBe(false);
		expect(
			isEditorialPreviewEnabled({ dev: false, editorialPreview: undefined }),
		).toBe(false);
		expect(
			isEditorialPreviewEnabled({ dev: true, editorialPreview: "false" }),
		).toBe(true);

		const draftDoc = {
			...docs[0],
			status: "draft" as const,
			approvalPending: false,
		};
		const readyDoc = {
			...docs[0],
			status: "ready" as const,
			approvalPending: false,
		};
		const approvedPendingDoc = {
			...docs[0],
			status: "ready" as const,
			approvalPending: true,
		};

		expect(shouldRenderEditorialDocument(draftDoc, false)).toBe(false);
		expect(shouldRenderEditorialDocument(draftDoc, true)).toBe(true);
		expect(shouldRenderEditorialDocument(readyDoc, false)).toBe(true);
		expect(shouldRenderEditorialDocument(approvedPendingDoc, true)).toBe(false);
	});

	it("validates Tina island context without falling back on invalid values", () => {
		expect(
			islandContextFromParams(
				new URLSearchParams({ locale: "en", routeKey: "about" }),
			),
		).toEqual({ locale: "en", routeKey: "about" });
		expect(
			islandContextFromParams(
				new URLSearchParams({ locale: "pt-BR", routeKey: "home" }),
			),
		).toBeNull();
		expect(
			islandContextFromParams(
				new URLSearchParams({ locale: "en", routeKey: "unknown" }),
			),
		).toBeNull();
	});
});
