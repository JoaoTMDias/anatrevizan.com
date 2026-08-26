import {
	type EditorialLocale,
	isEditorialLocale,
	isPublishedLocale,
	isRouteKey,
	type PublishedLocale,
	pathFor,
	publishedLocales,
	type RouteKey,
	routeKeys,
} from "./routing.ts";
import { type HeroMedia, validateHeroMedia } from "./hero-media.ts";

export const editorialStatuses = ["draft", "ready"] as const;
export type EditorialStatus = (typeof editorialStatuses)[number];

export function isEditorialStatus(value: unknown): value is EditorialStatus {
	return (
		typeof value === "string" &&
		editorialStatuses.includes(value as EditorialStatus)
	);
}

export interface EditorialDocument {
	translationGroup: string;
	locale: EditorialLocale;
	routeKey: RouteKey;
	slug: string;
	status: EditorialStatus;
	title: string;
	seoTitle: string;
	seoDescription: string;
	approvalPending?: boolean;
	media?: HeroMedia | null;
}

export interface EditorialIssue {
	code:
		| "invalid-locale"
		| "invalid-route"
		| "invalid-status"
		| "duplicate-slug"
		| "missing-translation"
		| "route-slug-mismatch"
		| "unapproved-ready"
		| "invalid-hero-aspect-ratio"
		| "invalid-hero-focal-point"
		| "missing-hero-alt"
		| "published-hero-placeholder";
	message: string;
}

/**
 * Validates the editorial dataset against the project rules for locales, route keys,
 * status values, duplicate slugs, and translation completeness.
 */
export function validateEditorialDocuments(
	documents: readonly EditorialDocument[],
): EditorialIssue[] {
	const issues: EditorialIssue[] = [];
	const slugs = new Map<string, string>();
	const pairs = new Map<string, Set<string>>();

	for (const document of documents) {
		if (!isEditorialLocale(document.locale))
			issues.push({
				code: "invalid-locale",
				message: `Locale inválido em ${document.translationGroup}: ${document.locale}`,
			});
		if (!isRouteKey(document.routeKey))
			issues.push({
				code: "invalid-route",
				message: `Rota inválida em ${document.translationGroup}: ${document.routeKey}`,
			});
		if (!editorialStatuses.includes(document.status))
			issues.push({
				code: "invalid-status",
				message: `Estado inválido em ${document.translationGroup}: ${document.status}`,
			});
		if (document.status === "ready" && document.approvalPending)
			issues.push({
				code: "unapproved-ready",
				message: `${document.translationGroup} está ready mas aguarda aprovação`,
			});
		for (const issue of validateHeroMedia(
			document.media,
			document.status === "ready" && !document.approvalPending,
		))
			issues.push({
				code: issue.code,
				message: `${document.translationGroup}/${document.locale}: ${issue.message}`,
			});
		const slugKey = `${document.locale}:${document.slug}`;
		if (slugs.has(slugKey))
			issues.push({
				code: "duplicate-slug",
				message: `Slug duplicado ${slugKey}`,
			});
		else slugs.set(slugKey, document.translationGroup);
		if (!pairs.has(document.translationGroup))
			pairs.set(document.translationGroup, new Set());
		pairs.get(document.translationGroup)?.add(document.locale);
		if (isRouteKey(document.routeKey) && isPublishedLocale(document.locale)) {
			const expected = pathFor(document.routeKey, document.locale)
				.replace(/^\/en\/?/, "/")
				.replace(/^\//, "");
			if (document.slug !== expected)
				issues.push({
					code: "route-slug-mismatch",
					message: `${document.translationGroup}/${document.locale}: esperado “${expected}”, recebido “${document.slug}”`,
				});
		}
	}

	for (const routeKey of routeKeys) {
		const groupLocales = pairs.get(routeKey);
		for (const locale of publishedLocales) {
			if (!groupLocales?.has(locale))
				issues.push({
					code: "missing-translation",
					message: `Falta ${locale} no grupo ${routeKey}`,
				});
		}
	}
	return issues;
}

export interface EditorialPreviewEnvironment {
	dev?: boolean;
	editorialPreview?: string;
}

/**
 * Returns true only when the build is explicitly in editorial preview mode.
 * The default is production-safe: preview is enabled in local development or when
 * the project-owned EDITORIAL_PREVIEW variable is exactly "true".
 */
export function isEditorialPreviewEnabled(
	env: EditorialPreviewEnvironment = {},
): boolean {
	const dev =
		env.dev ??
		(typeof import.meta !== "undefined" && "env" in import.meta
			? Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV)
			: false);
	const editorialPreview =
		env.editorialPreview ??
		(typeof process !== "undefined"
			? process.env.EDITORIAL_PREVIEW
			: undefined) ??
		(typeof import.meta !== "undefined" && "env" in import.meta
			? (import.meta as { env?: { EDITORIAL_PREVIEW?: string } }).env
					?.EDITORIAL_PREVIEW
			: undefined);
	return dev || editorialPreview === "true";
}

/**
 * Indicates whether a document is eligible for the public production sitemap and
 * canonical page set: only ready, approved, published-locale content qualifies.
 */
export function isPublishable(document: EditorialDocument): boolean {
	return (
		document.status === "ready" &&
		!document.approvalPending &&
		isPublishedDocument(document)
	);
}

/**
 * Decides whether a document can be rendered in the current build mode.
 * Production builds exclude draft pages, while preview builds may render draft
 * documents for review with noindex metadata.
 */
export function shouldRenderEditorialDocument(
	document: EditorialDocument,
	previewEnabled = isEditorialPreviewEnabled(),
): boolean {
	if (isPublishable(document)) return true;
	if (
		previewEnabled &&
		document.status === "draft" &&
		isPublishedDocument(document)
	)
		return true;
	return false;
}

/**
 * Narrows a document to the production-published locales used by the site.
 */
export function isPublishedDocument(
	document: EditorialDocument,
): document is EditorialDocument & { locale: PublishedLocale } {
	return isPublishedLocale(document.locale);
}
