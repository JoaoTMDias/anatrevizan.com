import type { CmsConfig, CmsEditorial, EditorialListItem } from "./data";
import { getConfig, listEditorial, toEditorialDocument } from "./data";
import {
	type EditorialDocument,
	isEditorialPreviewEnabled,
	isPublishable,
	shouldRenderEditorialDocument,
} from "./editorial";
import {
	isPublishedLocale,
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

let editorialIndexPromise: Promise<EditorialListItem[]> | undefined;
let configPromise: ReturnType<typeof getConfig> | undefined;

function getEditorialIndex(): Promise<EditorialListItem[]> {
	return (editorialIndexPromise ??= listEditorial());
}

function getSiteConfig() {
	return (configPromise ??= getConfig());
}

function toPageView(
	document: EditorialListItem,
	allDocuments: readonly EditorialListItem[],
	preview: boolean,
	config: CmsConfig | null,
): EditorialPageResolution {
	const editorialDocument = toEditorialDocument(document);
	if (!editorialDocument) return { kind: "missing", reason: "invalid" };
	if (!shouldRenderEditorialDocument(editorialDocument, preview))
		return { kind: "missing", reason: "not-renderable" };
	if (!isPublishedLocale(editorialDocument.locale))
		return { kind: "missing", reason: "not-renderable" };

	const availableLocales = allDocuments
		.map(toEditorialDocument)
		.filter((alternative): alternative is EditorialDocument =>
			Boolean(alternative && isPublishable(alternative)),
		)
		.filter(
			(alternative) => alternative.routeKey === editorialDocument.routeKey,
		)
		.map((alternative) => alternative.locale)
		.filter(isPublishedLocale);

	return {
		kind: "renderable",
		page: {
			data: document,
			document: editorialDocument,
			locale: editorialDocument.locale,
			relativePath: document._sys.relativePath,
			preview,
			noindex:
				!isPublishable(editorialDocument) || document.seo.noindex === true,
			availableLocales: [...new Set(availableLocales)],
			config,
		},
	};
}

export async function resolveEditorialPage(
	routeKey: RouteKey,
	locale: PublishedLocale,
	preview = isEditorialPreviewEnabled(),
): Promise<EditorialPageResolution> {
	const [documents, configResult] = await Promise.all([
		getEditorialIndex(),
		getSiteConfig(),
	]);
	const document = documents.find(
		(candidate) =>
			candidate.routeKey === routeKey && candidate.locale === locale,
	);
	if (!document) return { kind: "missing", reason: "missing" };
	return toPageView(
		document,
		documents,
		preview,
		configResult.data?.config ?? null,
	);
}

export async function resolveEditorialPages(
	preview = isEditorialPreviewEnabled(),
): Promise<Map<string, EditorialPageView>> {
	const [documents, configResult] = await Promise.all([
		getEditorialIndex(),
		getSiteConfig(),
	]);
	const pages = new Map<string, EditorialPageView>();
	for (const document of documents) {
		const result = toPageView(
			document,
			documents,
			preview,
			configResult.data?.config ?? null,
		);
		if (result.kind === "renderable")
			pages.set(
				`${result.page.document.routeKey}:${result.page.document.locale}`,
				result.page,
			);
	}
	return pages;
}
