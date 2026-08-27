import { isLocaleComplete, missingLocalizedPaths } from "./bilingual.ts";
import {
	isRouteKey,
	type PublishedLocale,
	type RouteKey,
	routeKeys,
} from "./routing.ts";

export interface EditorialDocument {
	routeKey: RouteKey;
	locale: PublishedLocale;
	title: string;
	seoTitle: string;
	seoDescription: string;
	complete: boolean;
}

export interface BilingualEditorialDocument extends Record<string, unknown> {
	routeKey: RouteKey;
}
export interface EditorialIssue {
	code:
		| "invalid-route"
		| "duplicate-route"
		| "missing-page"
		| "incomplete-portuguese";
	message: string;
}

export function validateEditorialDocuments(
	documents: readonly BilingualEditorialDocument[],
): EditorialIssue[] {
	const issues: EditorialIssue[] = [];
	const seen = new Set<RouteKey>();
	for (const document of documents) {
		if (!isRouteKey(document.routeKey)) {
			issues.push({
				code: "invalid-route",
				message: `Rota inválida: ${document.routeKey}`,
			});
			continue;
		}
		if (seen.has(document.routeKey))
			issues.push({
				code: "duplicate-route",
				message: `Página duplicada: ${document.routeKey}`,
			});
		seen.add(document.routeKey);
		if (!isLocaleComplete(document, "pt-PT"))
			issues.push({
				code: "incomplete-portuguese",
				message: `${document.routeKey}: ${missingLocalizedPaths(document, "pt-PT").join(", ")}`,
			});
	}
	for (const routeKey of routeKeys)
		if (!seen.has(routeKey))
			issues.push({
				code: "missing-page",
				message: `Página ausente: ${routeKey}`,
			});
	return issues;
}

export function isEditorialPreviewEnabled(
	env: { dev?: boolean; editorialPreview?: string } = {},
): boolean {
	const dev =
		env.dev ??
		(typeof import.meta !== "undefined" && "env" in import.meta
			? Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV)
			: false);
	const preview =
		env.editorialPreview ??
		(typeof process !== "undefined"
			? process.env.EDITORIAL_PREVIEW
			: undefined);
	return dev || preview === "true";
}

export function isPublishable(document: EditorialDocument): boolean {
	return document.complete;
}
export function isPublishedDocument(document: EditorialDocument): boolean {
	return document.complete;
}
export function shouldRenderEditorialDocument(
	document: EditorialDocument,
	preview = isEditorialPreviewEnabled(),
): boolean {
	return document.complete || preview;
}
