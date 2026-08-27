import { requestWithMetadata } from "@tinacms/astro/data";
import client from "../../tina/__generated__/client";
import { isLocaleComplete, localizeValue } from "./bilingual";
import type { EditorialDocument } from "./editorial";
import { isRouteKey, type PublishedLocale } from "./routing";
import type { HeroMedia } from "./hero-media";

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
	routeKey: string;
	locale: PublishedLocale;
	title: string;
	summary?: string | null;
	seo: { title: string; description: string; image?: string | null };
	media?: HeroMedia | null;
	_sys: RawCmsEditorial["_sys"];
}
export type EditorialListItem = Awaited<
	ReturnType<typeof listEditorial>
>[number];

export function localizeEditorial(
	document: RawCmsEditorial | EditorialListItem,
	locale: PublishedLocale,
): CmsEditorial {
	return {
		...(localizeValue(document, locale) as object),
		locale,
	} as CmsEditorial;
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
	};
	return {
		routeKey: document.routeKey,
		locale,
		title: localized.title ?? "",
		seoTitle: localized.seo?.title || localized.title || "",
		seoDescription: localized.seo?.description || localized.summary || "",
		complete: isLocaleComplete(document, locale),
	};
}
