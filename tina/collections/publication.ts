import type { Collection } from "tinacms";
import { ReadonlyField } from "../components/ReadonlyField.ts";

const hiddenString = (name: string, label: string, required = false) => ({
	name,
	label,
	type: "string" as const,
	required,
	ui: { component: "hidden" },
});

const readonlyString = (
	name: string,
	label: string,
	required = false,
	isTitle = false,
) => ({
	name,
	label,
	type: "string" as const,
	required,
	isTitle,
	ui: { component: ReadonlyField },
});

export const PublicationCollection: Collection = {
	name: "publication",
	label: "Publicações (ORCID)",
	path: "src/content/publications",
	format: "md",
	ui: {
		allowedActions: { create: false, delete: false },
		filename: { readonly: true },
	},
	fields: [
		hiddenString("sourceId", "Identificador estável", true),
		{
			name: "orcidPutCode",
			label: "ORCID put-code",
			type: "number",
			required: true,
			ui: { component: "hidden" },
		},
		readonlyString("title", "Título", true, true),
		readonlyString("journal", "Publicação ou evento"),
		readonlyString("year", "Ano"),
		readonlyString("type", "Tipo ORCID", true),
		readonlyString("doi", "DOI"),
		readonlyString("url", "URL"),
		readonlyString("source", "Fonte ORCID", true),
		{
			name: "language",
			label: "Idioma",
			type: "string",
			description:
				"Metadado editorial opcional. Só aparece no site quando estiver preenchido.",
		},
		{
			name: "topics",
			label: "Temas",
			type: "string",
			list: true,
			description:
				"Metadado editorial opcional. Só aparece no site quando estiver preenchido.",
		},
		{
			name: "highlight",
			label: "Destaque",
			type: "string",
			description:
				"Texto opcional do selo. Deixar vazio para não o apresentar.",
		},
		{
			name: "priority",
			label: "Prioridade editorial",
			type: "number",
			description:
				"Opcional. Os números mais baixos aparecem primeiro na página completa de publicações.",
		},
	],
};
