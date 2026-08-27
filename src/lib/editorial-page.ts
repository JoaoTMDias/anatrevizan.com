import type { CmsConfig, CmsEditorial, EditorialListItem } from "./data";
import {
	getConfig,
	listEditorial,
	localizeEditorial,
	toEditorialDocument,
} from "./data";
import {
	isEditorialPreviewEnabled,
	isPublishable,
	shouldRenderEditorialDocument,
	type EditorialDocument,
} from "./editorial";
import {
	publishedLocales,
	type PublishedLocale,
	type RouteKey,
} from "./routing";

export interface EditorialPageView {
	data: CmsEditorial;
	document: EditorialDocument;
	locale: PublishedLocale;
	relativePath: string;
	preview: boolean;
	noindex: boolean;
	availableLocales: PublishedLocale[];
	config: CmsConfig | null;
}
export type EditorialPageResolution =
	| { kind: "renderable"; page: EditorialPageView }
	| { kind: "missing"; reason: "missing" | "invalid" | "not-renderable" };
let indexPromise: Promise<EditorialListItem[]> | undefined;
const index = () => (indexPromise ??= listEditorial());

function view(
	raw: EditorialListItem,
	locale: PublishedLocale,
	preview: boolean,
	config: CmsConfig | null,
): EditorialPageResolution {
	const document = toEditorialDocument(raw, locale);
	if (!document) return { kind: "missing", reason: "invalid" };
	if (!shouldRenderEditorialDocument(document, preview))
		return { kind: "missing", reason: "not-renderable" };
	return {
		kind: "renderable",
		page: {
			data: localizeEditorial(raw, locale),
			document,
			locale,
			relativePath: raw._sys.relativePath,
			preview,
			noindex: !isPublishable(document),
			availableLocales: publishedLocales.filter((candidate) => {
				const alternative = toEditorialDocument(raw, candidate);
				return Boolean(alternative && isPublishable(alternative));
			}),
			config,
		},
	};
}

export async function resolveEditorialPage(
	routeKey: RouteKey,
	locale: PublishedLocale,
	preview = isEditorialPreviewEnabled(),
): Promise<EditorialPageResolution> {
	const [documents, configResult] = await Promise.all([index(), getConfig()]);
	const raw = documents.find((candidate) => candidate.routeKey === routeKey);
	return raw
		? view(raw, locale, preview, configResult.data?.config ?? null)
		: { kind: "missing", reason: "missing" };
}

export async function resolveEditorialPages(
	preview = isEditorialPreviewEnabled(),
): Promise<Map<string, EditorialPageView>> {
	const [documents, configResult] = await Promise.all([index(), getConfig()]);
	const pages = new Map<string, EditorialPageView>();
	for (const raw of documents)
		for (const locale of publishedLocales) {
			const result = view(
				raw,
				locale,
				preview,
				configResult.data?.config ?? null,
			);
			if (result.kind === "renderable")
				pages.set(`${raw.routeKey}:${locale}`, result.page);
		}
	return pages;
}
