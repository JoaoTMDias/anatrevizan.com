import { isEditorialLocale, isRouteKey, pathFor, publishedLocales, routeKeys, type EditorialLocale, type PublishedLocale, type RouteKey } from './routing.ts';

export const editorialStatuses = ['draft', 'ready'] as const;
export type EditorialStatus = (typeof editorialStatuses)[number];

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
}

export interface EditorialIssue { code: 'invalid-locale' | 'invalid-route' | 'invalid-status' | 'duplicate-slug' | 'missing-translation' | 'route-slug-mismatch' | 'unapproved-ready'; message: string }

export function validateEditorialDocuments(documents: readonly EditorialDocument[]): EditorialIssue[] {
	const issues: EditorialIssue[] = [];
	const slugs = new Map<string, string>();
	const pairs = new Map<string, Set<string>>();

	for (const document of documents) {
		if (!isEditorialLocale(document.locale)) issues.push({ code: 'invalid-locale', message: `Locale inválido em ${document.translationGroup}: ${document.locale}` });
		if (!isRouteKey(document.routeKey)) issues.push({ code: 'invalid-route', message: `Rota inválida em ${document.translationGroup}: ${document.routeKey}` });
		if (!editorialStatuses.includes(document.status)) issues.push({ code: 'invalid-status', message: `Estado inválido em ${document.translationGroup}: ${document.status}` });
		if (document.status === 'ready' && document.approvalPending) issues.push({ code: 'unapproved-ready', message: `${document.translationGroup} está ready mas aguarda aprovação` });
		const slugKey = `${document.locale}:${document.slug}`;
		if (slugs.has(slugKey)) issues.push({ code: 'duplicate-slug', message: `Slug duplicado ${slugKey}` });
		else slugs.set(slugKey, document.translationGroup);
		if (!pairs.has(document.translationGroup)) pairs.set(document.translationGroup, new Set());
		pairs.get(document.translationGroup)?.add(document.locale);
		if (isRouteKey(document.routeKey) && publishedLocales.includes(document.locale as PublishedLocale)) {
			const expected = pathFor(document.routeKey, document.locale as PublishedLocale).replace(/^\/en\/?/, '/').replace(/^\//, '');
			if (document.slug !== expected) issues.push({ code: 'route-slug-mismatch', message: `${document.translationGroup}/${document.locale}: esperado “${expected}”, recebido “${document.slug}”` });
		}
	}

	for (const routeKey of routeKeys) {
		const groupLocales = pairs.get(routeKey);
		for (const locale of publishedLocales) {
			if (!groupLocales?.has(locale)) issues.push({ code: 'missing-translation', message: `Falta ${locale} no grupo ${routeKey}` });
		}
	}
	return issues;
}

export function isPublishable(document: EditorialDocument): boolean {
	return document.status === 'ready' && !document.approvalPending && isPublishedDocument(document);
}

function isPublishedDocument(document: EditorialDocument): document is EditorialDocument & { locale: PublishedLocale } {
	return publishedLocales.includes(document.locale as PublishedLocale);
}
