import { isRouteKey, type RouteKey } from "./routing";

export interface LinkCard {
	title: string;
	description: string;
	routeKey: RouteKey;
}

export interface HomeContent {
	hero: {
		heading: string;
		subtitle: string;
		brandWords: string[];
		primaryCta: string;
		secondaryCta: string;
	};
	gateways: Array<LinkCard & { eyebrow: string; cta: string }>;
	differencesTitle: string;
	differencesSubtitle: string;
	differences: Array<{ title: string; description: string }>;
	servicesTitle: string;
	servicesSubtitle: string;
	services: Array<LinkCard & { tag: string; cta: string }>;
	academicTitle: string;
	academicSubtitle: string;
	publicationsCta: string;
	speakerKitCta: string;
	featuredPublications: Array<{
		title: string;
		publication?: string | null;
		year: string;
		language: string;
		badge?: string | null;
		url: string;
	}>;
	credentialsLabel: string;
	credentials: string[];
	finalCtaHeading: string;
	finalCtaText: string;
	finalCtaLabel: string;
}

export interface AboutContent {
	tag: string;
	subtitle: string;
	narrative: string[];
	milestonesTitle: string;
	milestones: Array<{ year: string; title: string; description: string }>;
	currentWorkTitle: string;
	currentWork: Array<{ country: string; title: string; description: string }>;
	valuesTitle: string;
	valuesSubtitle: string;
	values: Array<{ title: string; description: string }>;
	networksLabel: string;
	networks: string[];
	speakerKitCta: string;
	finalCtaHeading: string;
	finalCtaText: string;
	finalCtaLabel: string;
}

export function hasValidRouteKey(value: {
	routeKey?: unknown;
}): value is { routeKey: RouteKey } {
	return isRouteKey(value.routeKey);
}
