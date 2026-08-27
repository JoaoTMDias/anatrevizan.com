import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	isLocaleComplete,
	localizeValue,
	missingLocalizedPaths,
} from "../src/lib/bilingual.ts";
import {
	isLocalIncompleteEnglishPreviewEnabled,
	shouldRenderEditorialDocument,
	validateEditorialDocuments,
	type BilingualEditorialDocument,
} from "../src/lib/editorial.ts";
import { routeKeys } from "../src/lib/routing.ts";
import { EditorialCollection } from "../tina/collections/editorial.ts";
import { GlobalConfigCollection } from "../tina/collections/global-config.ts";
import { contactPageFields } from "../tina/collections/contact-sections.ts";
import { contactFormCopy } from "../src/lib/contact-form-i18n.ts";
import { deriveLinkedPageTitles } from "../src/lib/data.ts";
import { navigationItems } from "../src/lib/navigation.ts";
import { heroAspectRatioForRoute } from "../src/lib/hero-media.ts";
import { incompleteEnglishWarning } from "../tina/editorial-warning.ts";

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

	it("avisa sem bloquear quando a tradução inglesa está incompleta", () => {
		expect(
			incompleteEnglishWarning({
				title: { pt: "Título", en: "" },
				summary: { pt: "Resumo", en: "Summary" },
			}),
		).toBe(
			"A tradução inglesa está incompleta (1 campo por preencher). A página será guardada, mas a versão EN não será publicada até ficar completa.",
		);
		expect(
			incompleteEnglishWarning({ title: { pt: "Título", en: "Title" } }),
		).toBeNull();
		expect(EditorialCollection.ui?.beforeSubmit).toBeTypeOf("function");
	});

	it("só permite preview de inglês incompleto em desenvolvimento local", () => {
		const incomplete = {
			routeKey: "home" as const,
			locale: "en" as const,
			title: "",
			seoTitle: "",
			seoDescription: "",
			complete: false,
		};
		expect(shouldRenderEditorialDocument(incomplete, true, false)).toBe(false);
		expect(shouldRenderEditorialDocument(incomplete, true, true)).toBe(true);
		expect(isLocalIncompleteEnglishPreviewEnabled({ dev: false })).toBe(false);
	});

	it("bloqueia regressões de traduções inglesas já publicadas", () => {
		const home = pages.find((page) => page.routeKey === "home");
		expect(home).toBeDefined();
		expect(validateEditorialDocuments(pages, ["home"])).toContainEqual({
			code: "published-english-regression",
			message: "home: uma tradução inglesa já publicada ficou incompleta",
		});
	});

	it("deriva títulos de cartões a partir da página de destino", () => {
		const linked = deriveLinkedPageTitles(
			{
				routeKey: "home",
				locale: "pt-PT",
				title: "Início",
				seo: { title: "Início", description: "" },
				cards: [{ routeKey: "about" }],
				_sys: { relativePath: "home.json" },
			} as never,
			[
				{
					routeKey: "about",
					title: { pt: "Sobre", en: "About" },
					_sys: { relativePath: "about.json" },
				} as never,
			],
			"pt-PT",
		) as unknown as { cards: Array<{ title: string }> };
		expect(linked.cards[0].title).toBe("Sobre");
	});

	it("mantém proporções de hero no layout e fora do conteúdo", () => {
		expect(heroAspectRatioForRoute("contact")).toBe("landscape");
		expect(heroAspectRatioForRoute("about")).toBe("square");
		for (const page of pages)
			expect(
				(page as unknown as { media?: { foreground?: unknown } }).media
					?.foreground ?? {},
			).not.toHaveProperty("aspectRatio");
		const home = pages.find((page) => page.routeKey === "home") as never as {
			home: {
				gateways: Array<Record<string, unknown>>;
				services: Array<Record<string, unknown>>;
			};
		};
		for (const card of [...home.home.gateways, ...home.home.services])
			expect(card).not.toHaveProperty("title");
	});

	it("não expõe estrutura de navegação, identidade ou CTAs globais", () => {
		const field = (name: string) =>
			GlobalConfigCollection.fields?.find(
				(candidate) => candidate.name === name,
			);
		expect(field("identity")).toBeUndefined();
		expect(field("ctas")).toBeUndefined();
		const seo = field("seo");
		if (!seo || seo.type !== "object") throw new Error("seo ausente");
		expect(seo.fields?.find((item) => item.name === "siteUrl")).toBeUndefined();
		const navigation = field("navigation");
		if (!navigation || navigation.type !== "object")
			throw new Error("navigation ausente");
		expect(navigation.list).not.toBe(true);
		expect(navigation.fields?.map((item) => item.name)).toEqual([
			"consulting",
			"academic",
			"about",
			"contact",
			"booking",
		]);
		expect(JSON.stringify(navigation)).not.toMatch(
			/routeKey|emphasis|highlight/,
		);
		expect(field("requestTypes")).toBeDefined();
	});

	it("deriva estrutura, destinos e destaques da navegação no código", () => {
		const navigation = navigationItems(
			{
				consulting: { label: { pt: "Consultoria", en: "Consulting" } },
				academic: {
					label: { pt: "Academia", en: "Academic" },
					publications: { label: { pt: "Publicações", en: "Publications" } },
				},
				about: { pt: "Sobre", en: "About" },
				contact: { pt: "Contacto", en: "Contact" },
				booking: { pt: "Agendar", en: "Book" },
			} as never,
			"pt-PT",
		);
		expect(navigation.map((item) => item.routeKey)).toEqual([
			"consulting",
			"academic",
			"about",
			"contact",
			"booking",
		]);
		expect(navigation.at(-1)?.emphasis).toBe(true);
		expect(
			navigation[1].children?.find((item) => item.routeKey === "publications")
				?.highlight,
		).toBe(true);
	});

	it("mantém os textos funcionais do formulário em código", () => {
		const contact = contactPageFields[0];
		if (contact.type !== "object") throw new Error("contactPage ausente");
		expect(
			contact.fields?.find((field) => field.name === "formCopy"),
		).toBeUndefined();
		expect(
			contact.fields?.find((field) => field.name === "contactMethods"),
		).toBeUndefined();
		expect(contactFormCopy("pt-PT").submitLabel).toBe("Enviar");
		expect(contactFormCopy("en").submitLabel).toBe("Send");
	});

	it("limita o rich text editorial ao conjunto aprovado", () => {
		const about = EditorialCollection.templates?.find(
			(template) => template.name === "about",
		);
		const aboutSection = about?.fields.find((field) => field.name === "about");
		if (!aboutSection || aboutSection.type !== "object")
			throw new Error("about ausente");
		const narrative = aboutSection.fields?.find(
			(field) => field.name === "narrative",
		);
		if (!narrative || narrative.type !== "object")
			throw new Error("narrative ausente");
		for (const locale of narrative.fields ?? []) {
			expect(locale.type).toBe("rich-text");
			if (locale.type !== "rich-text") continue;
			expect(locale.overrides).toEqual({
				toolbar: ["heading", "link", "ul", "ol", "bold", "italic"],
				headingLevels: ["h2", "h3", "h4"],
			});
		}
	});

	it("considera rich text EN vazio uma tradução incompleta", () => {
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
		expect(isLocaleComplete(value, "en")).toBe(false);
	});

	it("persiste rich text em Markdown, não na árvore interna do editor", () => {
		const containsStoredRoot = (value: unknown): boolean => {
			if (Array.isArray(value)) return value.some(containsStoredRoot);
			if (!value || typeof value !== "object") return false;
			const record = value as Record<string, unknown>;
			if (record.type === "root" && Array.isArray(record.children)) return true;
			return Object.values(record).some(containsStoredRoot);
		};

		for (const page of pages) expect(containsStoredRoot(page)).toBe(false);
	});
});
