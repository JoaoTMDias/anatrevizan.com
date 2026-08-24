import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	type EditorialDocument,
	isPublishable,
	validateEditorialDocuments,
} from "../src/lib/editorial.ts";
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
});
