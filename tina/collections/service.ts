import type { Collection } from "tinacms";
import { entityUi, localizedDocumentFields, parentRouteField } from "./common";
export const ServiceCollection: Collection = {
	name: "service",
	label: "Services",
	path: "src/content/services",
	format: "json",
	ui: entityUi(),
	fields: [
		...localizedDocumentFields,
		parentRouteField,
		{
			name: "audience",
			label: "Audience",
			type: "string",
			ui: { component: "textarea" },
		},
		{
			name: "scope",
			label: "Scope",
			type: "string",
			ui: { component: "textarea" },
		},
		{
			name: "exclusions",
			label: "Not included",
			type: "string",
			ui: { component: "textarea" },
		},
		{
			name: "process",
			label: "Process",
			type: "string",
			ui: { component: "textarea" },
		},
		{
			name: "jurisdictions",
			label: "Applicable jurisdictions",
			type: "string",
			list: true,
		},
		{
			name: "legalNote",
			label: "Reviewed legal note",
			type: "string",
			ui: { component: "textarea" },
		},
		{ name: "ctaRefs", label: "CTA identifiers", type: "string", list: true },
	],
};
