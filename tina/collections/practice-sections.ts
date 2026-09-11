import type { TinaField } from "tinacms";

const text = (name: string, label: string): TinaField => ({
	name,
	label,
	type: "string",
	required: true,
});
const sectionFields: TinaField[] = [
	{
		name: "anchor",
		label: "Identificador",
		type: "string",
		ui: { component: "hidden" },
	},
	text("title", "Título"),
	text("description", "Descrição"),
	{ name: "paragraphs", label: "Parágrafos", type: "string", list: true },
	{
		name: "items",
		label: "Atividades",
		type: "object",
		list: true,
		fields: [
			text("title", "Título"),
			{ ...text("description", "Descrição"), required: false },
		],
	},
	text("notice", "Enquadramento"),
	text("cta", "Botão"),
	{
		name: "routeKey",
		label: "Destino",
		type: "string",
		ui: { component: "hidden" },
	},
	{
		name: "scope",
		label: "Âmbito",
		type: "string",
		ui: { component: "hidden" },
	},
];
export const practiceFields: TinaField[] = [
	{
		name: "practicePage",
		label: "Conteúdo",
		type: "object",
		fields: [
			text("tag", "Selo"),
			text("intro", "Introdução"),
			{
				name: "sections",
				label: "Secções",
				type: "object",
				list: true,
				fields: sectionFields,
			},
			{
				name: "portugal",
				label: "Portugal",
				type: "object",
				fields: sectionFields,
			},
			{
				name: "brazil",
				label: "Brasil",
				type: "object",
				fields: sectionFields,
			},
		],
	},
];
