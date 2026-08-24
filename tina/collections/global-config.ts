import type { Collection } from "tinacms";

const localizedText = (name: string, label: string) => ({
	name,
	label,
	type: "object" as const,
	fields: [
		{
			name: "pt",
			label: "Português (Portugal)",
			type: "string" as const,
			required: true,
		},
		{ name: "en", label: "English", type: "string" as const, required: true },
	],
});

export const GlobalConfigCollection: Collection = {
	name: "config",
	label: "Global settings",
	path: "src/content/config",
	format: "json",
	ui: { global: true },
	fields: [
		{
			name: "identity",
			label: "Identity",
			type: "object",
			required: true,
			fields: [
				{ name: "name", label: "Public name", type: "string", required: true },
				{
					name: "legalName",
					label: "Legal name (only after approval)",
					type: "string",
				},
				{ name: "logo", label: "Logo", type: "image" },
				{ name: "portrait", label: "Portrait", type: "image" },
				localizedText("tagline", "Localized tagline"),
			],
		},
		{
			name: "contacts",
			label: "Contacts and profiles",
			type: "object",
			fields: [
				{ name: "email", label: "Professional email", type: "string" },
				{ name: "phone", label: "Phone/WhatsApp", type: "string" },
				{
					name: "calendlyUrl",
					label: "Calendly external URL",
					type: "string",
					description: "External link only; no embed in v1.",
				},
				{
					name: "profiles",
					label: "Professional profiles",
					type: "object",
					list: true,
					fields: [
						localizedText("label", "Localized label"),
						{ name: "url", label: "URL", type: "string", required: true },
					],
				},
			],
		},
		{
			name: "navigation",
			label: "Header and footer navigation",
			type: "object",
			list: true,
			ui: {
				itemProps: (item) => ({
					label: item.label?.pt ?? item.routeKey ?? "Navigation item",
				}),
			},
			fields: [
				{
					name: "type",
					label: "Item type",
					type: "string",
					required: true,
					options: [
						{ label: "Direct link", value: "link" },
						{ label: "Menu with children", value: "menu" },
					],
				},
				{
					name: "routeKey",
					label: "Canonical landing route",
					type: "string",
					required: true,
					description: "For a menu, this is its hub/landing page.",
				},
				localizedText("label", "Localized label"),
				{
					name: "emphasis",
					label: "Display as primary action",
					type: "boolean",
				},
				{
					name: "children",
					label: "Ordered menu entries",
					type: "object",
					list: true,
					ui: {
						itemProps: (item) => ({
							label: item.label?.pt ?? item.routeKey ?? "Menu entry",
						}),
					},
					fields: [
						{
							name: "routeKey",
							label: "Canonical route",
							type: "string",
							required: true,
						},
						localizedText("label", "Localized title"),
						localizedText("description", "Localized short description"),
						localizedText("tag", "Localized optional tag"),
						{
							name: "highlight",
							label: "Highlight this entry",
							type: "boolean",
						},
					],
				},
			],
		},
		{
			name: "ctas",
			label: "Reusable CTAs",
			type: "object",
			list: true,
			fields: [
				{
					name: "id",
					label: "Stable identifier",
					type: "string",
					required: true,
				},
				localizedText("label", "Localized label"),
				{ name: "routeKey", label: "Internal route key", type: "string" },
				{ name: "externalUrl", label: "External URL", type: "string" },
			],
		},
		{
			name: "seo",
			label: "Site-wide SEO",
			type: "object",
			required: true,
			fields: [
				{
					name: "siteUrl",
					label: "Canonical production URL",
					type: "string",
					required: true,
				},
				localizedText("defaultTitle", "Default title"),
				localizedText("defaultDescription", "Default description"),
				{ name: "defaultImage", label: "Default social image", type: "image" },
			],
		},
		{
			name: "footer",
			label: "Footer and legal navigation",
			type: "object",
			fields: [
				localizedText("copyright", "Copyright label"),
				{
					name: "legalRouteKeys",
					label: "Legal route keys",
					type: "string",
					list: true,
				},
			],
		},
	],
};
