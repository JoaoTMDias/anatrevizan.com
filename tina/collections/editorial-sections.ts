import type { TinaField } from "tinacms";
import { richText } from "./common";

const text = (name: string, label: string, required = true): TinaField => ({
	name,
	label,
	type: "string",
	required,
	ui: { component: "textarea" },
});

const cardList = (name: string, label: string): TinaField => ({
	name,
	label,
	type: "object",
	list: true,
	required: true,
	fields: [text("title", "Título"), text("description", "Descrição")],
});

export const homeFields: TinaField[] = [
	{
		name: "home",
		label: "Conteúdo da página inicial",
		type: "object",
		fields: [
			{
				name: "hero",
				label: "Destaque principal",
				type: "object",
				required: true,
				fields: [
					text("heading", "Título"),
					text("subtitle", "Introdução"),
					{
						name: "brandWords",
						label: "Palavras da marca",
						type: "string",
						list: true,
						required: true,
					},
					text("primaryCta", "CTA principal"),
					text("secondaryCta", "CTA secundário"),
				],
			},
			{
				name: "gateways",
				label: "Entradas para Consultoria e Academia",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("eyebrow", "Etiqueta"),
					text("description", "Descrição"),
					text("cta", "CTA"),
					{
						name: "routeKey",
						label: "Destino",
						type: "string",
						required: true,
					},
				],
			},
			text("differencesTitle", "Título dos diferenciais"),
			text("differencesSubtitle", "Introdução dos diferenciais"),
			cardList("differences", "Diferenciais"),
			text("servicesTitle", "Título dos serviços"),
			text("servicesSubtitle", "Introdução dos serviços"),
			{
				name: "services",
				label: "Resumos dos serviços",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("tag", "Etiqueta"),
					text("description", "Descrição"),
					text("cta", "CTA"),
					{
						name: "routeKey",
						label: "Destino",
						type: "string",
						required: true,
					},
				],
			},
			text("academicTitle", "Título da Academia"),
			text("academicSubtitle", "Introdução da Academia"),
			text("publicationsCta", "CTA de publicações"),
			text("speakerKitCta", "CTA do kit de palestrante"),
			text("credentialsLabel", "Label das credenciais"),
			{
				name: "credentials",
				label: "Credenciais",
				type: "string",
				list: true,
				required: true,
			},
			text("finalCtaHeading", "Título do CTA final"),
			text("finalCtaText", "Texto do CTA final"),
			text("finalCtaLabel", "Label do CTA final"),
		],
	},
];

export const aboutFields: TinaField[] = [
	{
		name: "about",
		label: "Conteúdo da página Sobre",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
			text("subtitle", "Introdução do hero"),
			richText("narrative", "Narrativa"),
			text("milestonesTitle", "Título dos marcos"),
			{
				name: "milestones",
				label: "Marcos",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("year", "Ano"),
					text("title", "Título"),
					text("description", "Descrição"),
				],
			},
			text("currentWorkTitle", "Título do trabalho atual"),
			{
				name: "currentWork",
				label: "Trabalho atual",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("country", "País"),
					text("title", "Título"),
					text("description", "Descrição"),
				],
			},
			text("valuesTitle", "Título dos valores"),
			text("valuesSubtitle", "Introdução dos valores"),
			cardList("values", "Values"),
			text("networksLabel", "Label das redes"),
			{
				name: "networks",
				label: "Redes",
				type: "string",
				list: true,
				required: true,
			},
			text("speakerKitCta", "CTA do kit de palestrante"),
			text("finalCtaHeading", "Título do CTA final"),
			text("finalCtaText", "Texto do CTA final"),
			text("finalCtaLabel", "Label do CTA final"),
		],
	},
];

const consultingOfferingFields: TinaField[] = [
	text("title", "Título"),
	text("description", "Descrição", false),
	{
		name: "items",
		label: "Itens",
		type: "string",
		list: true,
	},
];

export const consultingHubFields: TinaField[] = [
	{
		name: "consultingHub",
		label: "Conteúdo da página Consultoria",
		type: "object",
		fields: [
			text("subtitle", "Introdução do hero"),
			text("introHeading", "Título da introdução"),
			text("introText", "Texto introdutório"),
			{
				name: "filters",
				label: "Filtros por país",
				type: "object",
				fields: [
					text("portugal", "Portugal"),
					text("brazil", "Brasil"),
					text("all", "Todos"),
				],
			},
			{
				name: "areas",
				label: "Áreas de consultoria",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("tag", "Etiqueta"),
					text("summary", "Resumo"),
					{
						name: "routeKey",
						label: "Destino",
						type: "string",
						required: true,
					},
					{
						name: "countries",
						label: "Filtros por país",
						type: "string",
						list: true,
						required: true,
					},
				],
			},
			text("areaCta", "CTA da área"),
			text("note", "Nota profissional"),
			text("ctaHeading", "Título do CTA"),
			text("ctaText", "Texto do CTA"),
		],
	},
];

export const consultingServiceFields: TinaField[] = [
	{
		name: "consultingService",
		label: "Conteúdo do serviço de consultoria",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
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
							"Decorative images use an empty alt attribute. Otherwise, alternative text is required.",
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
				fields: consultingOfferingFields,
			},
			text("stepsHeading", "Título das etapas", false),
			text("stepsSubtitle", "Introdução das etapas", false),
			{
				name: "steps",
				label: "Etapas",
				type: "object",
				list: true,
				fields: [
					text("number", "Número"),
					text("title", "Título"),
					text("description", "Descrição"),
				],
			},
			text("crosslinkHeading", "Título do serviço relacionado", false),
			text("crosslinkText", "Texto do serviço relacionado", false),
			{
				name: "crosslinkRouteKey",
				label: "Destino do serviço relacionado",
				type: "string",
			},
			text("differentiatorEyebrow", "Etiqueta do diferencial", false),
			text("differentiatorHeading", "Título do diferencial", false),
			{
				name: "differentiatorImage",
				label: "Imagem do diferencial",
				type: "object",
				fields: [
					{ name: "image", label: "Imagem", type: "image" },
					text("alt", "Texto alternativo", false),
					{
						name: "decorative",
						label: "Imagem decorativa",
						type: "boolean",
						description:
							"Decorative images use an empty alt attribute. Otherwise, alternative text is required.",
						ui: { defaultValue: false },
					},
				],
			},
			richText("differentiatorParagraphs", "Texto diferenciador", false),
			{
				name: "differentiatorCredentials",
				label: "Credenciais do diferencial",
				type: "string",
				list: true,
			},
			text("relatedWorkHeading", "Título do trabalho relacionado", false),
			text("relatedWorkSubtitle", "Introdução do trabalho relacionado", false),
			{
				name: "relatedPublications",
				label: "Publicações relacionadas estáticas (ORCID adiado)",
				type: "object",
				list: true,
				fields: [
					text("title", "Título"),
					text("publication", "Publicação"),
					text("highlight", "Destaque", false),
				],
			},
			text("note", "Nota profissional", false),
			text("ctaHeading", "Título do CTA"),
			text("ctaText", "Texto do CTA"),
		],
	},
];
