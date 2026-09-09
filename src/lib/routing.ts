export const publishedLocales = ["pt-PT", "en"] as const;
export const editorialLocales = [...publishedLocales, "es"] as const;

export type PublishedLocale = (typeof publishedLocales)[number];
export type EditorialLocale = (typeof editorialLocales)[number];

export const routeMap = {
	practice: { "pt-PT": "/atuacao", en: "/en/practice" },
	"portugal-support": {
		"pt-PT": "/atuacao/apoio-administrativo-portugal",
		en: "/en/practice/administrative-support-portugal",
	},
	home: { "pt-PT": "/", en: "/en" },
	"immigration-mobility": {
		"pt-PT": "/atuacao/migracao-e-mobilidade",
		en: "/en/practice/immigration-mobility",
	},
	legal: {
		"pt-PT": "/atuacao/advocacia-brasil",
		en: "/en/practice/brazilian-law",
	},
	"environmental-esg": {
		"pt-PT": "/atuacao/ambiental-administrativo-urbanismo",
		en: "/en/practice/environmental-administrative-urban-law",
	},
	"public-policy": {
		"pt-PT": "/atuacao/esg-politicas-publicas-sustentabilidade",
		en: "/en/practice/esg-public-policy-sustainability",
	},
	"legal-opinions": {
		"pt-PT": "/atuacao/pareceres-e-notas-tecnicas",
		en: "/en/practice/legal-opinions-technical-reports",
	},
	mentoring: { "pt-PT": "/academia/mentorias", en: "/en/academic/mentoring" },
	publications: {
		"pt-PT": "/academia/publicacoes",
		en: "/en/academic/publications",
	},
	events: { "pt-PT": "/academia/eventos", en: "/en/academic/events" },
	training: { "pt-PT": "/academia/formacoes", en: "/en/academic/training" },
	about: { "pt-PT": "/sobre", en: "/en/about" },
	contact: { "pt-PT": "/contacto", en: "/en/contact" },
	privacy: { "pt-PT": "/politica-de-privacidade", en: "/en/privacy-policy" },
	accessibility: {
		"pt-PT": "/declaracao-de-acessibilidade",
		en: "/en/accessibility-statement",
	},
} as const satisfies Record<
	string,
	Record<PublishedLocale, `/${string}` | "/">
>;

export type RouteKey = keyof typeof routeMap;
export const routeKeys = Object.keys(routeMap) as RouteKey[];

export function isPublishedLocale(value: unknown): value is PublishedLocale {
	return publishedLocales.includes(value as PublishedLocale);
}

export function isEditorialLocale(value: unknown): value is EditorialLocale {
	return editorialLocales.includes(value as EditorialLocale);
}

export function isRouteKey(value: unknown): value is RouteKey {
	return typeof value === "string" && Object.hasOwn(routeMap, value);
}

export function pathFor(routeKey: RouteKey, locale: PublishedLocale): string {
	return routeMap[routeKey][locale];
}

export function contactBookingPath(locale: PublishedLocale): string {
	return `${pathFor("contact", locale)}#${locale === "en" ? "book" : "agendar"}`;
}

export function alternatePath(path: string): string | undefined {
	for (const localized of Object.values(routeMap)) {
		if (localized["pt-PT"] === path) return localized.en;
		if (localized.en === path) return localized["pt-PT"];
	}
}

export function localeForPath(path: string): PublishedLocale | undefined {
	for (const localized of Object.values(routeMap)) {
		if (localized["pt-PT"] === path) return "pt-PT";
		if (localized.en === path) return "en";
	}
}

export function routeKeyForPath(path: string): RouteKey | undefined {
	return routeKeys.find(
		(key) => routeMap[key]["pt-PT"] === path || routeMap[key].en === path,
	);
}
