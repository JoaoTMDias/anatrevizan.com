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

const listLabelKeys = [
	"pt",
	"en",
	"title",
	"label",
	"heading",
	"name",
	"question",
	"year",
	"country",
	"tag",
	"eyebrow",
	"date",
	"description",
	"routeKey",
	"url",
];

function displayText(value: unknown): string | undefined {
	if (typeof value === "string" && value.trim()) return value.trim();
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const localized = value as Record<string, unknown>;
	return displayText(localized.pt) ?? displayText(localized.en);
}

export function editorialListItemLabel(
	item: Record<string, unknown>,
	fallback: string,
): string {
	for (const key of listLabelKeys) {
		const label = displayText(item[key]);
		if (label) return label;
	}
	return fallback;
}

export function bilingualFields(fields: TinaField[]): TinaField[] {
	return fields.map((field) => {
		if (field.type === "object" && "fields" in field && field.fields) {
			const localized = {
				...field,
				fields: bilingualFields(field.fields as TinaField[]),
			};
			if (!field.list) return localized;
			return {
				...localized,
				ui: {
					...field.ui,
					itemProps: (item: Record<string, unknown>) => ({
						label: editorialListItemLabel(
							item,
							`${field.label ?? "Item"}`,
						),
					}),
				},
			};
		}
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
			return field.list
				? {
						...localized,
						list: true,
						ui: {
							itemProps: (item: Record<string, unknown>) => ({
								label: editorialListItemLabel(
									item,
									`${field.label ?? "Item"}`,
								),
							}),
						},
					}
				: localized;
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
