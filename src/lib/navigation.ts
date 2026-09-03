import type { CmsConfig } from "./data";
import type { PublishedLocale, RouteKey } from "./routing";

type Localized = { pt?: string | null; en?: string | null } | null | undefined;
type Entry =
	| {
			label?: Localized;
			description?: Localized;
			tag?: Localized;
	  }
	| null
	| undefined;

export interface NavigationItem {
	type: "link" | "menu";
	routeKey: RouteKey;
	label: string;
	emphasis?: boolean;
	children?: Array<{
		routeKey: RouteKey;
		label: string;
		description?: string;
		tag?: string;
		highlight?: boolean;
	}>;
}

const localized = (value: Localized, locale: PublishedLocale) =>
	value?.[locale === "en" ? "en" : "pt"] ?? "";

export function navigationItems(
	navigation: CmsConfig["navigation"] | undefined,
	locale: PublishedLocale,
): NavigationItem[] {
	const entry = (routeKey: RouteKey, copy: Entry, highlight = false) => ({
		routeKey,
		label: localized(copy?.label, locale),
		description: localized(copy?.description, locale) || undefined,
		tag: localized(copy?.tag, locale) || undefined,
		highlight,
	});

	return [
		{
			type: "menu",
			routeKey: "legal",
			label: localized(navigation?.consulting?.label, locale),
			children: [
				entry(
					"immigration-mobility",
					navigation?.consulting?.immigrationMobility,
				),
				entry("legal", navigation?.consulting?.legal),
				entry("environmental-esg", navigation?.consulting?.environmentalEsg),
				entry("public-policy", navigation?.consulting?.publicPolicy),
				entry("legal-opinions", navigation?.consulting?.legalOpinions),
			],
		},
		{
			type: "menu",
			routeKey: "publications",
			label: localized(navigation?.academic?.label, locale),
			children: [
				entry("mentoring", navigation?.academic?.mentoring),
				entry("publications", navigation?.academic?.publications, true),
				entry("events", navigation?.academic?.events),
				entry("training", navigation?.academic?.training),
			],
		},
		{
			type: "link",
			routeKey: "about",
			label: localized(navigation?.about, locale),
		},
		{
			type: "link",
			routeKey: "contact",
			label: localized(navigation?.contact, locale),
			emphasis: true,
		},
	];
}
