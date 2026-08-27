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

const optionalLocalizedText = (name: string, label: string) => ({
	name,
	label,
	type: "object" as const,
	fields: [
		{ name: "pt", label: "Português (Portugal)", type: "string" as const },
		{ name: "en", label: "English", type: "string" as const },
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
			name: "contacts",
			label: "Contactos, perfis e atendimento",
			type: "object",
			fields: [
				{ name: "email", label: "E-mail profissional", type: "string" },
				{ name: "phone", label: "Telefone/WhatsApp", type: "string" },
				{
					name: "calendlyUrl",
					label: "Endereço externo do Calendly",
					type: "string",
					description:
						"Usar apenas um endereço HTTPS. O Calendly não é incorporado no site.",
				},
				{
					name: "profiles",
					label: "Perfis profissionais",
					type: "object",
					list: true,
					fields: [
						localizedText("label", "Localized label"),
						{ name: "url", label: "URL", type: "string", required: true },
					],
				},
				{
					name: "regions",
					label: "Regiões de atendimento",
					type: "object",
					list: true,
					fields: [
						{ name: "flag", label: "Flag", type: "string", required: true },
						localizedText("label", "Localized region name"),
					],
				},
				{
					name: "serviceLanguages",
					label: "Idiomas de atendimento",
					type: "string",
					list: true,
				},
			],
		},
		{
			name: "navigation",
			label: "Labels da navegação",
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
					ui: { component: "hidden" },
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
					ui: { component: "hidden" },
					description: "For a menu, this is its hub/landing page.",
				},
				localizedText("label", "Localized label"),
				{
					name: "emphasis",
					label: "Display as primary action",
					type: "boolean",
					ui: { component: "hidden" },
				},
				{
					name: "children",
					label: "Labels do submenu",
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
							ui: { component: "hidden" },
						},
						localizedText("label", "Localized title"),
						localizedText("description", "Localized short description"),
						localizedText("tag", "Localized optional tag"),
						{
							name: "highlight",
							label: "Highlight this entry",
							type: "boolean",
							ui: { component: "hidden" },
						},
					],
				},
			],
		},
		{
			name: "requestTypes",
			label: "Tipos de pedido do formulário",
			type: "object",
			list: true,
			ui: {
				itemProps: (item) => ({ label: item.label?.pt ?? "Tipo de pedido" }),
			},
			fields: [localizedText("label", "Nome apresentado")],
		},
		{
			name: "seo",
			label: "Site-wide SEO",
			type: "object",
			required: true,
			fields: [
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
				optionalLocalizedText(
					"professionalRegistration",
					"Professional identification",
				),
				optionalLocalizedText("disclaimer", "Informational disclaimer"),
				optionalLocalizedText("rightsReserved", "Rights reserved text"),
			],
		},
	],
};
