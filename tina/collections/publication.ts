import type { Collection } from "tinacms";

const hiddenString = (name: string, label: string, required = false) => ({
	name,
	label,
	type: "string" as const,
	required,
	ui: { component: "hidden" },
});

export const PublicationCollection: Collection = {
	name: "publication",
	label: "Publications (ORCID)",
	path: "src/content/publications",
	format: "md",
	ui: {
		allowedActions: { create: false, delete: false },
		filename: { readonly: true },
	},
	fields: [
		hiddenString("sourceId", "Stable source ID", true),
		{
			name: "orcidPutCode",
			label: "ORCID put-code",
			type: "number",
			required: true,
			ui: { component: "hidden" },
		},
		hiddenString("title", "Title", true),
		hiddenString("journal", "Journal"),
		hiddenString("year", "Year"),
		hiddenString("type", "Technical type", true),
		hiddenString("doi", "DOI"),
		hiddenString("url", "URL"),
		hiddenString("source", "ORCID source", true),
		{
			name: "language",
			label: "Language",
			type: "string",
			description:
				"Optional editorial metadata. It is only displayed when filled in.",
		},
		{
			name: "topics",
			label: "Topics",
			type: "string",
			list: true,
			description:
				"Optional editorial metadata. It is only displayed when filled in.",
		},
		{
			name: "highlight",
			label: "Highlight",
			type: "string",
			description: "Optional badge text. Leave empty to hide it.",
		},
		{
			name: "priority",
			label: "Editorial priority",
			type: "number",
			description:
				"Optional. Lower numbers appear first on the full publications page.",
		},
	],
};
