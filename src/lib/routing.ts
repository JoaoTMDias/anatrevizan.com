export const publishedLocales = ["pt-PT", "pt-BR", "en"] as const;
export const editorialLocales = [...publishedLocales, "es"] as const;

export type PublishedLocale = (typeof publishedLocales)[number];
export type EditorialLocale = (typeof editorialLocales)[number];

export const routeMap = {
	practice: {
		"pt-PT": "/atuacao",
		"pt-BR": "/pt-br/atuacao",
		en: "/en/practice",
	},
	home: { "pt-PT": "/", "pt-BR": "/pt-br", en: "/en" },
	"immigration-mobility": {
		"pt-PT": "/atuacao/migracao-e-mobilidade",
		"pt-BR": "/pt-br/atuacao/migracao-e-mobilidade",
		en: "/en/practice/immigration-mobility",
	},
	legal: {
		"pt-PT": "/atuacao/advocacia-brasil",
		"pt-BR": "/pt-br/atuacao/advocacia-brasil",
		en: "/en/practice/brazilian-law",
	},
	"environmental-esg": {
		"pt-PT": "/atuacao/ambiental-administrativo-urbanismo",
		"pt-BR": "/pt-br/atuacao/ambiental-administrativo-urbanismo",
		en: "/en/practice/environmental-administrative-urban-law",
	},
	"public-policy": {
		"pt-PT": "/atuacao/esg-politicas-publicas-sustentabilidade",
		"pt-BR": "/pt-br/atuacao/esg-politicas-publicas-sustentabilidade",
		en: "/en/practice/esg-public-policy-sustainability",
	},
	mentoring: {
		"pt-PT": "/academia/mentorias",
		"pt-BR": "/pt-br/academia/mentorias",
		en: "/en/academic/mentoring",
	},
	publications: {
		"pt-PT": "/academia/publicacoes",
		"pt-BR": "/pt-br/academia/publicacoes",
		en: "/en/academic/publications",
	},
	events: {
		"pt-PT": "/academia/eventos",
		"pt-BR": "/pt-br/academia/eventos",
		en: "/en/academic/events",
	},
	training: {
		"pt-PT": "/academia/formacoes",
		"pt-BR": "/pt-br/academia/formacoes",
		en: "/en/academic/training",
	},
	about: { "pt-PT": "/sobre", "pt-BR": "/pt-br/sobre", en: "/en/about" },
	contact: {
		"pt-PT": "/contacto",
		"pt-BR": "/pt-br/contacto",
		en: "/en/contact",
	},
	privacy: {
		"pt-PT": "/politica-de-privacidade",
		"pt-BR": "/pt-br/politica-de-privacidade",
		en: "/en/privacy-policy",
	},
	accessibility: {
		"pt-PT": "/declaracao-de-acessibilidade",
		"pt-BR": "/pt-br/declaracao-de-acessibilidade",
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
		const match = Object.values(localized).find(
			(candidate) => candidate === path,
		);
		if (match)
			return Object.values(localized).find((candidate) => candidate !== match);
	}
}

export function localeForPath(path: string): PublishedLocale | undefined {
	for (const localized of Object.values(routeMap)) {
		for (const locale of publishedLocales)
			if (localized[locale] === path) return locale;
	}
}

export function routeKeyForPath(path: string): RouteKey | undefined {
	return routeKeys.find((key) =>
		publishedLocales.some((locale) => routeMap[key][locale] === path),
	);
}
