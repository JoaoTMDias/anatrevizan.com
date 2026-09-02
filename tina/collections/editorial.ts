import type { Collection, TinaField } from "tinacms";
import { pathFor, type RouteKey } from "../../src/lib/routing";
import {
	academicHubFields,
	academicServiceFields,
	eventsPageFields,
	publicationsPageFields,
	speakingPageFields,
} from "./academic-sections";
import { bilingualFields, localizedText } from "./common";
import { bookingPageFields, contactPageFields } from "./contact-sections";
import {
	aboutFields,
	consultingHubFields,
	consultingServiceFields,
	homeFields,
} from "./editorial-sections";
import {
	cookiesPageFields,
	privacyPageFields,
	termsPageFields,
} from "./legal-sections";
import { incompleteEnglishWarning } from "../editorial-warning";

const textAndSeoFields: TinaField[] = [
	{
		name: "routeKey",
		label: "Página",
		type: "string",
		required: true,
		ui: { component: "hidden" },
	},
	localizedText("title", "Título", true),
	localizedText("summary", "Resumo"),
	{
		name: "seo",
		label: "SEO (avançado)",
		type: "object",
		fields: [
			localizedText("title", "Título SEO opcional"),
			localizedText("description", "Descrição SEO opcional", false, "textarea"),
			{ name: "image", label: "Imagem social opcional", type: "image" },
		],
	},
];

const mediaField: TinaField = {
	name: "media",
	label: "Media",
	type: "object",
	fields: [
		{
			name: "background",
			label: "Imagem de fundo",
			type: "object",
			fields: [
				{ name: "image", label: "Ficheiro", type: "image" },
				{
					name: "focalPoint",
					label: "Ponto focal",
					type: "string",
					options: ["top", "center", "bottom"],
				},
			],
		},
		{
			name: "foreground",
			label: "Imagem lateral",
			type: "object",
			fields: [
				{ name: "image", label: "Ficheiro", type: "image" },
				localizedText("alt", "Texto alternativo"),
				{ name: "decorative", label: "Decorativa", type: "boolean" },
			],
		},
	],
};

const legalField: TinaField = {
	name: "legal",
	label: "Dados legais",
	type: "object",
	fields: [
		{
			name: "effectiveDate",
			label: "Data de entrada em vigor",
			type: "datetime",
		},
	],
};

const pageFields = (fields: TinaField[], media = true): TinaField[] => [
	...textAndSeoFields,
	...(media ? [mediaField] : []),
	...bilingualFields(fields),
];

export const EditorialCollection: Collection = {
	name: "editorial",
	label: "Páginas",
	path: "src/content/pages",
	format: "json",
	ui: {
		allowedActions: { create: false, delete: false },
		filename: { readonly: true },
		router: ({ document }) => pathFor(document.routeKey as RouteKey, "pt-PT"),
		beforeSubmit: async ({ cms, values }) => {
			const warning = incompleteEnglishWarning(values);
			if (warning) cms.alerts.warn(warning, 0);
			return values;
		},
	},
	templates: [
		{ name: "home", label: "Início", fields: pageFields(homeFields) },
		{ name: "about", label: "Sobre", fields: pageFields(aboutFields) },
		{
			name: "consultingHub",
			label: "Consultoria",
			fields: pageFields(consultingHubFields),
		},
		{
			name: "consultingService",
			label: "Página de serviço de consultoria",
			fields: pageFields(consultingServiceFields),
		},
		{
			name: "academicHub",
			label: "Academia",
			fields: pageFields(academicHubFields),
		},
		{
			name: "academicService",
			label: "Página de serviço académico",
			fields: pageFields(academicServiceFields),
		},
		{
			name: "publications",
			label: "Publicações",
			fields: pageFields(publicationsPageFields),
		},
		{
			name: "events",
			label: "Eventos e Palestras",
			fields: pageFields([...eventsPageFields, ...speakingPageFields]),
		},
		{
			name: "contact",
			label: "Contacto",
			fields: pageFields(contactPageFields),
		},
		{
			name: "booking",
			label: "Agendamento",
			fields: pageFields(bookingPageFields),
		},
		{
			name: "privacy",
			label: "Política de privacidade",
			fields: [...pageFields(privacyPageFields, false), legalField],
		},
		{
			name: "terms",
			label: "Termos",
			fields: [...pageFields(termsPageFields, false), legalField],
		},
		{
			name: "cookies",
			label: "Cookies",
			fields: [...pageFields(cookiesPageFields, false), legalField],
		},
	],
};
