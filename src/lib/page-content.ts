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

export interface ConsultingHubContent {
	subtitle: string;
	introHeading: string;
	introText: string;
	filters: { portugal: string; brazil: string; all: string };
	areas: Array<{
		title: string;
		tag: string;
		summary: string;
		routeKey: RouteKey;
		countries: string[];
	}>;
	areaCta: string;
	note: string;
	ctaHeading: string;
	ctaText: string;
}

export interface ConsultingServiceContent {
	tag: string;
	subtitle: string;
	introHeading: string;
	introParagraphs: string[];
	servicesHeading: string;
	servicesSubtitle?: string | null;
	services: Array<{
		title: string;
		description?: string | null;
		items?: string[] | null;
	}>;
	stepsHeading?: string | null;
	stepsSubtitle?: string | null;
	steps?: Array<{ number: string; title: string; description: string }> | null;
	crosslinkHeading?: string | null;
	crosslinkText?: string | null;
	crosslinkRouteKey?: RouteKey | null;
	differentiatorEyebrow?: string | null;
	differentiatorHeading?: string | null;
	differentiatorParagraphs?: string[] | null;
	differentiatorCredentials?: string[] | null;
	relatedWorkHeading?: string | null;
	relatedWorkSubtitle?: string | null;
	relatedPublications?: Array<{
		title: string;
		publication: string;
		highlight?: string | null;
	}> | null;
	note?: string | null;
	ctaHeading: string;
	ctaText: string;
}

export function hasValidRouteKey(value: {
	routeKey?: unknown;
}): value is { routeKey: RouteKey } {
	return isRouteKey(value.routeKey);
}
