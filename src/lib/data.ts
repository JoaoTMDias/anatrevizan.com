import { requestWithMetadata } from "@tinacms/astro/data";
import client from "../../tina/__generated__/client";
import { isLocaleComplete, localizeValue } from "./bilingual";
import type { EditorialDocument } from "./editorial";
import { gitLastModified } from "./git-dates";
import type { HeroMedia } from "./hero-media";
import { isRouteKey, type PublishedLocale, type RouteKey } from "./routing";

export const getConfig = () =>
	requestWithMetadata(client.queries.config({ relativePath: "site.json" }));
export const getEditorial = (relativePath: string) =>
	requestWithMetadata(client.queries.editorial({ relativePath }), {
		priority: "primary",
	});
export async function listEditorial() {
	const result = await client.queries.editorialConnection({ first: 100 });
	return (result.data.editorialConnection.edges ?? []).flatMap((edge) =>
		edge?.node ? [edge.node] : [],
	);
}
export type CmsConfig = Awaited<ReturnType<typeof getConfig>>["data"]["config"];
export type RawCmsEditorial = Awaited<
	ReturnType<typeof getEditorial>
>["data"]["editorial"];
export interface CmsEditorial extends Record<string, unknown> {
	routeKey: RouteKey;
	locale: PublishedLocale;
	title: string;
	summary?: string | null;
	seo: { title: string; description: string; image?: string | null };
	media?: HeroMedia | null;
	lastModified?: string;
	_sys: RawCmsEditorial["_sys"];
}
export type EditorialListItem = Awaited<
	ReturnType<typeof listEditorial>
>[number];

export function localizeEditorial(
	document: RawCmsEditorial | EditorialListItem,
	locale: PublishedLocale,
): CmsEditorial {
	const localized = {
		...(localizeValue(document, locale) as object),
		locale,
	} as CmsEditorial;
	const relativePath = document._sys?.relativePath;
	if (relativePath)
		localized.lastModified = gitLastModified(
			`src/content/pages/${relativePath}`,
		);
	return localized;
}

export function deriveLinkedPageTitles(
	document: CmsEditorial,
	documents: EditorialListItem[],
	locale: PublishedLocale,
): CmsEditorial {
	const titles = new Map(
		documents.flatMap((candidate) => {
			if (!isRouteKey(candidate.routeKey)) return [];
			const localized = localizeEditorial(candidate, locale);
			return [[candidate.routeKey, localized.title] as const];
		}),
	);
	const walk = (value: unknown): unknown => {
		if (Array.isArray(value)) return value.map(walk);
		if (!value || typeof value !== "object") return value;
		const record = Object.fromEntries(
			Object.entries(value).map(([key, child]) => [key, walk(child)]),
		);
		if (isRouteKey(record.routeKey) && titles.has(record.routeKey))
			record.title = titles.get(record.routeKey);
		return record;
	};
	return walk(document) as CmsEditorial;
}

export function toEditorialDocument(
	document: RawCmsEditorial | EditorialListItem,
	locale: PublishedLocale,
): EditorialDocument | null {
	if (!isRouteKey(document.routeKey)) return null;
	const localized = localizeEditorial(document, locale) as unknown as {
		title?: string;
		summary?: string;
		seo?: { title?: string; description?: string };
		lastModified?: string;
	};
	return {
		routeKey: document.routeKey,
		locale,
		title: localized.title ?? "",
		seoTitle: localized.seo?.title || localized.title || "",
		seoDescription: localized.seo?.description || localized.summary || "",
		lastModified: localized.lastModified,
		complete: isLocaleComplete(document, locale),
	};
}
