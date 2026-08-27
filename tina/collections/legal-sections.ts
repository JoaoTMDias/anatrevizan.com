import type { TinaField } from "tinacms";
import { richText } from "./common";

const text = (name: string, label: string, required = true): TinaField => ({
	name,
	label,
	type: "string",
	required,
});

const legalDocument = (name: string, label: string): TinaField => ({
	name,
	label,
	type: "object",
	fields: [
		text("sourceStatus", "Historical source status"),
		{
			name: "reviewRequirements",
			label: "Required qualified-review coverage",
			type: "string",
			list: true,
			required: true,
		},
		{
			name: "sections",
			label: "Qualified legal copy sections",
			description: "Leave empty until reviewed legal copy is available.",
			type: "object",
			list: true,
			fields: [
				text("heading", "Heading"),
				richText("paragraphs", "Conteúdo legal"),
			],
		},
	],
});

export const privacyPageFields: TinaField[] = [
	legalDocument("privacyPage", "Privacy policy sections"),
];

export const termsPageFields: TinaField[] = [
	legalDocument("termsPage", "Terms of use sections"),
];

export const cookiesPageFields: TinaField[] = [
	legalDocument("cookiesPage", "Cookie policy sections"),
];
