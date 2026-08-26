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
import {
	safeCalendlyUrl,
	safeEmailHref,
	safeProfileUrl,
	safeWhatsAppHref,
} from "../src/lib/external-url.ts";
import { islandContextFromParams } from "../src/lib/island-context.ts";
import { pathFor, publishedLocales, routeKeys } from "../src/lib/routing.ts";
import { localizedDocumentFields } from "../tina/collections/common.ts";

const documents = routeKeys.flatMap((routeKey) =>
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
	it("allows only approved external destinations", () => {
		expect(safeCalendlyUrl("https://calendly.com/ana/initial-call")).toBe(
			"https://calendly.com/ana/initial-call",
		);
		expect(safeCalendlyUrl("javascript:alert(1)")).toBeNull();
		expect(safeCalendlyUrl("https://example.com/calendly")).toBeNull();
		expect(safeCalendlyUrl("http://calendly.com/ana")).toBeNull();
		expect(safeEmailHref("ana@example.com")).toBe("mailto:ana@example.com");
		expect(safeEmailHref("invalid")).toBeNull();
		expect(safeWhatsAppHref("+351926430792")).toBe(
			"https://wa.me/351926430792",
		);
		expect(safeWhatsAppHref("926430792")).toBeNull();
		expect(safeProfileUrl("https://orcid.org/0000-0003-4365-6053")).toBe(
			"https://orcid.org/0000-0003-4365-6053",
		);
		expect(safeProfileUrl("https://example.com/profile")).toBeNull();
	});

	it("keeps the canonical Home slug optional in Tina", () => {
		const slug = localizedDocumentFields.find((field) => field.name === "slug");
		expect(slug).toBeDefined();
		expect(slug?.required).not.toBe(true);
	});

	it("validates every real localized editorial document", () => {
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
		expect(actual).toHaveLength(routeKeys.length * publishedLocales.length);
		expect(validateEditorialDocuments(actual)).toEqual([]);
	});

	it("does not expose localized payloads for pending English translations", () => {
		const localizedPayloads = [
			"home",
			"about",
			"consultingHub",
			"consultingService",
			"academicHub",
			"academicService",
			"publicationsPage",
			"eventsPage",
			"speakingPage",
			"contactPage",
			"bookingPage",
			"privacyPage",
			"termsPage",
			"cookiesPage",
		];
		for (const file of jsonFiles(
			join(process.cwd(), "src/content/editorial/en"),
		)) {
			const document = JSON.parse(readFileSync(file, "utf8"));
			if (!document.approvalPending) continue;
			for (const field of localizedPayloads)
				expect(document[field]).toBeUndefined();
		}
	});

	it.each([
		[
			"duplicate-slug",
			() =>
				validateEditorialDocuments([
					...documents,
					{
						...documents[1],
						translationGroup: "other",
						routeKey: "about" as const,
					},
				]),
		],
		[
			"invalid-locale",
			() =>
				validateEditorialDocuments([
					{ ...documents[0], locale: "pt-BR" } as unknown as EditorialDocument,
					...documents.slice(1),
				]),
		],
		[
			"missing-translation",
			() =>
				validateEditorialDocuments(
					documents.filter(
						(document) =>
							!(document.routeKey === "about" && document.locale === "en"),
					),
				),
		],
	] as const)("detects %s", (code, validate) => {
		expect(validate().some((issue) => issue.code === code)).toBe(true);
	});

	it("requires a ready document without pending approval for publication", () => {
		expect(isPublishable(documents[0])).toBe(false);
		expect(
			isPublishable({
				...documents[0],
				status: "ready",
				approvalPending: true,
			}),
		).toBe(false);
		expect(
			isPublishable({
				...documents[0],
				status: "ready",
				approvalPending: false,
			}),
		).toBe(true);
	});

	it("separates editorial preview from production publication", () => {
		expect(isEditorialPreviewEnabled({ dev: false })).toBe(false);
		expect(
			isEditorialPreviewEnabled({ dev: false, editorialPreview: "true" }),
		).toBe(true);
		expect(
			isEditorialPreviewEnabled({ dev: false, editorialPreview: "false" }),
		).toBe(false);
		expect(
			isEditorialPreviewEnabled({ dev: true, editorialPreview: "false" }),
		).toBe(true);

		const draft = {
			...documents[0],
			status: "draft" as const,
			approvalPending: false,
		};
		const ready = { ...draft, status: "ready" as const };
		expect(shouldRenderEditorialDocument(draft, false)).toBe(false);
		expect(shouldRenderEditorialDocument(draft, true)).toBe(true);
		expect(shouldRenderEditorialDocument(ready, false)).toBe(true);
		expect(
			shouldRenderEditorialDocument({ ...ready, approvalPending: true }, true),
		).toBe(false);
	});

	it("rejects invalid Tina island route context", () => {
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
