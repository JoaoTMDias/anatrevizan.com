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

export const academicServiceFields: TinaField[] = [
	{
		name: "academicService",
		label: "Conteúdo do serviço académico",
		type: "object",
		fields: [
			text("subtitle", "Introdução do hero"),
			text("introHeading", "Título da introdução"),
			{
				name: "introImage",
				label: "Imagem da introdução",
				type: "object",
				fields: [
					{ name: "image", label: "Imagem", type: "image" },
					text("alt", "Texto alternativo", false),
					{
						name: "decorative",
						label: "Imagem decorativa",
						type: "boolean",
						description:
							"Imagens decorativas usam um atributo alt vazio. Caso contrário, o texto alternativo é obrigatório.",
						ui: { defaultValue: false },
					},
				],
			},
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
		label: "Eventos",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
			text("subtitle", "Introdução do hero"),
			text("emptyHeading", "Título sem eventos"),
			text("emptyText", "Texto sem eventos"),
			text("speakerKitCta", "CTA do kit de palestrante"),
			text("listHeading", "Título da lista"),
			{
				name: "filters",
				label: "Labels dos filtros",
				type: "object",
				fields: [
					text("allYears", "Todos os anos"),
					text("allFormats", "Todos os formatos"),
					text("allLanguages", "Todos os idiomas"),
					text("clear", "Limpar filtros"),
					text("singleResult", "Resultado no singular"),
					text("multipleResults", "Resultados no plural"),
					text("view", "Ver evento"),
					text("empty", "Mensagem sem resultados"),
				],
			},
			{
				name: "entries",
				label: "Palestras e participações",
				type: "object",
				list: true,
				fields: [
					text("slug", "Slug"),
					text("title", "Título"),
					{
						name: "date",
						label: "Data editorial",
						type: "object",
						fields: [
							{ name: "year", label: "Ano", type: "string", required: true },
							{ name: "month", label: "Mês", type: "number" },
							{ name: "day", label: "Dia", type: "number" },
							{ name: "endDay", label: "Dia final", type: "number" },
							{
								name: "precision",
								label: "Precisão",
								type: "string",
								required: true,
							},
							{ name: "pending", label: "Data a confirmar", type: "boolean" },
						],
					},
					text("format", "Formato"),
					text("city", "Cidade"),
					text("country", "País"),
					{ name: "online", label: "Participação online", type: "boolean" },
					text("event", "Evento"),
					text("institution", "Instituição"),
					text("language", "Idioma"),
					text("topic", "Tema", false),
					text("role", "Papel", false),
					text("url", "URL", false),
				],
			},
			...speakingPageFields(),
		],
	},
];

export function speakingPageFields(): TinaField[] {
	return [
	{
		name: "speaking",
		label: "Conteúdo de palestras e participações",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
			text("subtitle", "Introdução do hero"),
			text("photoPlaceholderLabel", "Texto da fotografia temporária"),
			{
				name: "photo",
				label: "Fotografia da palestrante",
				type: "object",
				fields: [
					{ name: "image", label: "Imagem", type: "image", required: false },
					text("alt", "Texto alternativo", false),
					{
						name: "decorative",
						label: "Imagem decorativa",
						type: "boolean",
						ui: { defaultValue: false },
					},
				],
			},
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
}
