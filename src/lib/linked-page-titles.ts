import { localizeValue } from "./bilingual";
import { isRouteKey, type PublishedLocale } from "./routing";

export function deriveLinkedPageTitles<T extends Record<string, unknown>>(
	document: T,
	documents: ReadonlyArray<Record<string, unknown>>,
	locale: PublishedLocale,
): T {
	const titles = new Map(
		documents.flatMap((candidate) => {
			if (!isRouteKey(candidate.routeKey)) return [];
			const localized = localizeValue(candidate, locale) as {
				title?: unknown;
			};
			return typeof localized.title === "string"
				? ([[candidate.routeKey, localized.title]] as const)
				: [];
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
	return walk(document) as T;
}
