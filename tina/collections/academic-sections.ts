import type { TinaField } from "tinacms";
import { richText } from "./common";

const text = (name: string, label: string, required = true): TinaField => ({
	name,
	label,
	type: "string",
	required,
});

const stringList = (
	name: string,
	label: string,
	required = true,
): TinaField => ({
	name,
	label,
	type: "string",
	list: true,
	required,
});

export const academicHubFields: TinaField[] = [
	{
		name: "academicHub",
		label: "Conteúdo da página Academia",
		type: "object",
		fields: [
			text("subtitle", "Introdução do hero"),
			text("introText", "Texto introdutório"),
			{
				name: "sections",
				label: "Áreas académicas",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("description", "Descrição"),
					text("routeKey", "Destino"),
					text("cta", "CTA"),
					{
						name: "highlight",
						label: "Destaque",
						type: "boolean",
					},
				],
			},
			text("ctaHeading", "Título do CTA"),
			text("ctaText", "Texto do CTA"),
		],
	},
];

export const academicServiceFields: TinaField[] = [
	{
		name: "academicService",
		label: "Conteúdo do serviço académico",
		type: "object",
		fields: [
			text("subtitle", "Introdução do hero"),
			text("introHeading", "Título da introdução"),
			richText("introParagraphs", "Texto de introdução"),
			text("servicesHeading", "Título dos serviços"),
			text("servicesSubtitle", "Introdução dos serviços", false),
			{
				name: "services",
				label: "Serviços",
				type: "object",
				list: true,
				required: true,
				fields: [text("title", "Título"), text("description", "Descrição")],
			},
			text("note", "Nota profissional"),
			text("ctaHeading", "Título do CTA"),
			text("ctaText", "Texto do CTA"),
		],
	},
];

export const publicationsPageFields: TinaField[] = [
	{
		name: "publicationsPage",
		label: "Conteúdo da página Publicações",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
			text("subtitle", "Introdução do hero"),
			text("introText", "Texto introdutório"),
			text("orcidNote", "Nota sobre o ORCID"),
			{
				name: "filters",
				label: "Labels dos filtros",
				type: "object",
				fields: [
					text("allYears", "Todos os anos"),
					text("allTopics", "Todos os temas"),
					text("allLanguages", "Todos os idiomas"),
					text("clear", "Limpar filtros"),
					text("singleResult", "Resultado no singular"),
					text("multipleResults", "Resultados no plural"),
					text("view", "Ver publicação"),
					text("empty", "Mensagem sem resultados"),
				],
			},
			text("ctaHeading", "Título do CTA"),
			text("ctaText", "Texto do CTA"),
		],
	},
];

export const eventsPageFields: TinaField[] = [
	{
		name: "eventsPage",
		label: "Conteúdo da página Eventos",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
			text("subtitle", "Introdução do hero"),
			text("emptyHeading", "Título sem eventos"),
			text("emptyText", "Texto sem eventos"),
			text("speakerKitCta", "CTA do kit de palestrante"),
			{
				name: "entries",
				label: "Eventos",
				type: "object",
				list: true,
				fields: [
					text("slug", "Slug"),
					{ name: "date", label: "Data", type: "datetime", required: true },
					text("city", "Cidade"),
					text("country", "País"),
					text("event", "Evento"),
					text("institution", "Instituição"),
					text("topic", "Tema", false),
					text("role", "Papel", false),
					text("url", "URL", false),
				],
			},
			text("ctaHeading", "Título do CTA"),
			text("ctaText", "Texto do CTA"),
		],
	},
];

export const speakingPageFields: TinaField[] = [
	{
		name: "speakingPage",
		label: "Conteúdo da página Palestras",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
			text("subtitle", "Introdução do hero"),
			text("photoPlaceholderLabel", "Texto da fotografia temporária"),
			text("bioHeading", "Título da biografia"),
			richText("bioParagraphs", "Biografia"),
			text("topicsHeading", "Título dos temas"),
			stringList("topics", "Topics"),
			text("kitHeading", "Título do kit"),
			stringList("kitItems", "Kit contents"),
			text("kitDownloadLabel", "Label do futuro download do kit"),
			text("inviteCta", "CTA para convites"),
			text("ctaHeading", "Título do CTA"),
			text("ctaText", "Texto do CTA"),
		],
	},
];
