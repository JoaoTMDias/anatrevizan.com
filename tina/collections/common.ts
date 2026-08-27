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
		},
		{
			name: "en",
			label: "English",
			type: component === "rich-text" ? "rich-text" : "string",
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
	"aspectRatio",
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
				field.ui && "component" in field.ui && field.ui.component === "textarea"
					? "textarea"
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
