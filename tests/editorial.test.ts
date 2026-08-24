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
import { safeCalendlyUrl } from "../src/lib/external-url.ts";
import { pathFor, publishedLocales, routeKeys } from "../src/lib/routing.ts";
import { localizedDocumentFields } from "../tina/collections/common.ts";

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

const countStrings = (value: unknown): number => {
	if (typeof value === "string") return 1;
	if (Array.isArray(value))
		return value.reduce((total, item) => total + countStrings(item), 0);
	if (value && typeof value === "object")
		return Object.values(value).reduce(
			(total, item) => total + countStrings(item),
			0,
		);
	return 0;
};

describe("editorial validation", () => {
	it("accepts only HTTPS Calendly destinations from editorial configuration", () => {
		expect(safeCalendlyUrl("https://calendly.com/ana/initial-call")).toBe(
			"https://calendly.com/ana/initial-call",
		);
		expect(safeCalendlyUrl("javascript:alert(1)")).toBeNull();
		expect(safeCalendlyUrl("https://example.com/calendly")).toBeNull();
		expect(safeCalendlyUrl("http://calendly.com/ana")).toBeNull();
		expect(safeCalendlyUrl("not a url")).toBeNull();
	});
	it("allows the Tina Home form to keep its canonical empty slug", () => {
		const slugField = localizedDocumentFields.find(
			(field) => field.name === "slug",
		);
		expect(slugField).toBeDefined();
		expect(slugField?.required).not.toBe(true);
	});

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
		expect(home.approvalPending || about.approvalPending).toBe(false);
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

	it("accounts for all 203 Portuguese consulting source strings", () => {
		const directory = join(process.cwd(), "src/content/editorial/pt-PT");
		const hub = JSON.parse(
			readFileSync(join(directory, "consulting.json"), "utf8"),
		);
		const serviceNames = [
			"immigration-mobility",
			"legal",
			"environmental-esg",
			"public-policy",
			"legal-opinions",
		];
		const expectedServiceCounts = [39, 32, 53, 30, 23];

		const hubEditorialStrings =
			1 +
			countStrings({
				subtitle: hub.consultingHub.subtitle,
				introHeading: hub.consultingHub.introHeading,
				introText: hub.consultingHub.introText,
				filters: hub.consultingHub.filters,
				areas: hub.consultingHub.areas.map(
					(area: { title: string; tag: string; summary: string }) => ({
						title: area.title,
						tag: area.tag,
						summary: area.summary,
					}),
				),
				areaCta: hub.consultingHub.areaCta,
				note: hub.consultingHub.note,
				ctaHeading: hub.consultingHub.ctaHeading,
				ctaText: hub.consultingHub.ctaText,
			});
		expect(hubEditorialStrings).toBe(26);

		for (const [index, name] of serviceNames.entries()) {
			const document = JSON.parse(
				readFileSync(join(directory, `${name}.json`), "utf8"),
			);
			const technicalStrings = document.consultingService.crosslinkRouteKey
				? 1
				: 0;
			expect(
				1 + countStrings(document.consultingService) - technicalStrings,
			).toBe(expectedServiceCounts[index]);
			expect(document.status).toBe("draft");
			expect(document.approvalPending).toBe(false);
			expect(document.seo.noindex).toBe(true);
		}

		const manifest = readFileSync(
			join(process.cwd(), "docs/especificacao-editorial-consultoria.md"),
			"utf8",
		);
		expect(manifest).toContain("203 strings PT-PT");
	});

	it("keeps Portuguese consulting content out of English previews", () => {
		for (const name of [
			"consulting",
			"immigration-mobility",
			"legal",
			"environmental-esg",
			"public-policy",
			"legal-opinions",
		]) {
			const value = JSON.parse(
				readFileSync(
					join(process.cwd(), `src/content/editorial/en/${name}.json`),
					"utf8",
				),
			);
			expect(value.approvalPending).toBe(true);
			expect(value.consultingHub).toBeUndefined();
			expect(value.consultingService).toBeUndefined();
		}
	});

	it("accounts for the academic page inventory and publication placeholders", () => {
		const directory = join(process.cwd(), "src/content/editorial/pt-PT");
		const hub = JSON.parse(
			readFileSync(join(directory, "academic.json"), "utf8"),
		);
		const mentoring = JSON.parse(
			readFileSync(join(directory, "mentoring.json"), "utf8"),
		);
		const training = JSON.parse(
			readFileSync(join(directory, "training.json"), "utf8"),
		);
		const publications = JSON.parse(
			readFileSync(join(directory, "publications.json"), "utf8"),
		);
		const events = JSON.parse(
			readFileSync(join(directory, "events.json"), "utf8"),
		);
		const speaking = JSON.parse(
			readFileSync(join(directory, "speaking.json"), "utf8"),
		);

		expect(hub.academicHub.sections).toHaveLength(5);
		expect(1 + countStrings(mentoring.academicService)).toBe(21);
		expect(1 + countStrings(training.academicService)).toBe(22);
		expect(events.eventsPage.entries).toEqual([]);
		expect(1 + countStrings(events.eventsPage)).toBe(8);
		expect(1 + countStrings(speaking.speakingPage)).toBe(24);
		expect(publications.publicationsPage.publications).toHaveLength(25);
		expect(
			publications.publicationsPage.publications.filter(
				(item: { linkStatus: string }) => item.linkStatus === "placeholder",
			),
		).toHaveLength(2);
		expect(
			publications.publicationsPage.publications.some(
				(item: { url?: string }) => item.url === "#",
			),
		).toBe(false);
		for (const document of [
			hub,
			mentoring,
			training,
			publications,
			events,
			speaking,
		]) {
			expect(document.status).toBe("draft");
			expect(document.approvalPending).toBe(false);
			expect(document.seo.noindex).toBe(true);
		}

		const manifest = readFileSync(
			join(process.cwd(), "docs/especificacao-editorial-academia.md"),
			"utf8",
		);
		expect(manifest).toContain("106 strings PT-PT");
		expect(manifest).toContain("25 registos e 136 campos string");
		expect(manifest).toContain('Dois registos usam `link: "#"`');
	});

	it("keeps copied Portuguese academic content out of English documents", () => {
		for (const name of [
			"academic",
			"mentoring",
			"publications",
			"events",
			"speaking",
			"training",
		]) {
			const value = JSON.parse(
				readFileSync(
					join(process.cwd(), `src/content/editorial/en/${name}.json`),
					"utf8",
				),
			);
			expect(value.approvalPending).toBe(true);
			expect(value.academicHub).toBeUndefined();
			expect(value.academicService).toBeUndefined();
			expect(value.publicationsPage).toBeUndefined();
			expect(value.eventsPage).toBeUndefined();
			expect(value.speakingPage).toBeUndefined();
		}
	});

	it("accounts for Contact and Booking content without promoting fake destinations", () => {
		const contact = JSON.parse(
			readFileSync(
				join(process.cwd(), "src/content/editorial/pt-PT/contact.json"),
				"utf8",
			),
		);
		const booking = JSON.parse(
			readFileSync(
				join(process.cwd(), "src/content/editorial/pt-PT/booking.json"),
				"utf8",
			),
		);

		expect(contact.contactPage.formCopy.countries).toHaveLength(5);
		expect(contact.contactPage.contactMethods).toHaveLength(5);
		expect(
			contact.contactPage.contactMethods.map(
				(method: { status: string }) => method.status,
			),
		).toEqual([
			"unconfirmed",
			"missing",
			"placeholder",
			"placeholder",
			"placeholder",
		]);
		expect(JSON.stringify(contact)).not.toContain('"#"');
		expect(JSON.stringify(booking)).not.toContain("calendly.com");
		for (const document of [contact, booking]) {
			expect(document.status).toBe("draft");
			expect(document.approvalPending).toBe(true);
			expect(document.seo.noindex).toBe(true);
		}

		const manifest = readFileSync(
			join(
				process.cwd(),
				"docs/especificacao-editorial-contacto-agendamento.md",
			),
			"utf8",
		);
		expect(manifest).toContain("39 ocorrências de strings editoriais PT-PT");
		expect(manifest).toContain("zero bytes");
		expect(manifest).toContain("https://calendly.com/dratrevizan");
	});

	it("keeps incomplete Contact and Booking translations structural", () => {
		for (const name of ["contact", "booking"]) {
			const value = JSON.parse(
				readFileSync(
					join(process.cwd(), `src/content/editorial/en/${name}.json`),
					"utf8",
				),
			);
			expect(value.approvalPending).toBe(true);
			expect(value.contactPage).toBeUndefined();
			expect(value.bookingPage).toBeUndefined();
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
