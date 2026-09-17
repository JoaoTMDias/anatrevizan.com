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
		text("sourceStatus", "Estado da fonte histórica"),
		{
			name: "reviewRequirements",
			label: "Âmbito da revisão qualificada necessária",
			type: "string",
			list: true,
			required: true,
		},
		{
			name: "sections",
			label: "Secções de texto jurídico revisto",
			description: "Deixar vazio até existir texto jurídico revisto.",
			type: "object",
			list: true,
			fields: [
				text("heading", "Título"),
				richText("paragraphs", "Conteúdo legal"),
			],
		},
	],
});

export const privacyPageFields: TinaField[] = [
	legalDocument("privacyPage", "Privacy policy sections"),
];

export const accessibilityPageFields: TinaField[] = [
	legalDocument("accessibilityPage", "Accessibility statement sections"),
];
