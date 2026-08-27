import type { TinaField } from "tinacms";

export const localizedText = (
	name: string,
	label: string,
	required = false,
	component?: "textarea" | "rich-text",
): TinaField => ({
	name,
	label,
	type: "object",
	required,
	description:
		"Preencher primeiro PT-PT e depois EN. Traduções parciais podem ser guardadas; EN só é publicado quando estiver completo.",
	fields: [
		{
			name: "pt",
			label: "Português (Portugal)",
			type: component === "rich-text" ? "rich-text" : "string",
			required,
			...(component === "rich-text"
				? {
						overrides: {
							toolbar: ["heading", "link", "ul", "ol", "bold", "italic"],
							headingLevels: ["h2", "h3", "h4"],
						},
					}
				: component === "textarea"
					? { ui: { component: "textarea" } }
					: {}),
		},
		{
			name: "en",
			label: "Inglês",
			type: component === "rich-text" ? "rich-text" : "string",
			...(component === "rich-text"
				? {
						overrides: {
							toolbar: ["heading", "link", "ul", "ol", "bold", "italic"],
							headingLevels: ["h2", "h3", "h4"],
						},
					}
				: component === "textarea"
					? { ui: { component: "textarea" } }
					: {}),
		},
	],
});

const sharedStringNames = new Set([
	"routeKey",
	"crosslinkRouteKey",
	"image",
	"video",
	"poster",
	"url",
	"externalUrl",
	"focalPoint",
	"status",
	"number",
	"slug",
	"date",
	"year",
]);

export function bilingualFields(fields: TinaField[]): TinaField[] {
	return fields.map((field) => {
		if (field.type === "object" && "fields" in field && field.fields)
			return { ...field, fields: bilingualFields(field.fields as TinaField[]) };
		if (field.type === "string" && !sharedStringNames.has(field.name)) {
			const component =
				field.ui && "component" in field.ui
					? field.ui.component === "textarea"
						? "textarea"
						: field.ui.component === "rich-text"
							? "rich-text"
							: undefined
					: undefined;
			const localized = localizedText(
				field.name,
				field.label ?? field.name,
				Boolean(field.required),
				component,
			);
			return field.list ? { ...localized, list: true } : localized;
		}
		return field;
	});
}

export const richText = (
	name: string,
	label: string,
	required = true,
): TinaField => ({
	name,
	label,
	type: "string",
	required,
	ui: { component: "rich-text" },
});
