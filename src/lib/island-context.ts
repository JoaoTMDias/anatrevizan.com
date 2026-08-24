import {
	isPublishedLocale,
	isRouteKey,
	type PublishedLocale,
	type RouteKey,
} from "./routing";

export interface IslandContext {
	locale: PublishedLocale;
	routeKey: RouteKey;
}

export function islandContextFromParams(
	params: URLSearchParams,
): IslandContext | null {
	const locale = params.get("locale");
	const routeKey = params.get("routeKey");
	if (!isPublishedLocale(locale) || !isRouteKey(routeKey)) return null;
	return { locale, routeKey };
}
