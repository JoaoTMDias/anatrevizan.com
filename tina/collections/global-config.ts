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
		{ name: "en", label: "Inglês", type: "string" as const, required: true },
	],
});

const optionalLocalizedText = (name: string, label: string) => ({
	name,
	label,
	type: "object" as const,
	fields: [
		{ name: "pt", label: "Português (Portugal)", type: "string" as const },
		{ name: "en", label: "Inglês", type: "string" as const },
	],
});

const navigationEntry = (name: string, label: string, withTag = false) => ({
	name,
	label,
	type: "object" as const,
	fields: [
		localizedText("label", "Nome no menu"),
		localizedText("description", "Descrição curta"),
		...(withTag ? [localizedText("tag", "Etiqueta opcional")] : []),
	],
});

export const GlobalConfigCollection: Collection = {
	name: "config",
	label: "Configuração global",
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
			label: "Textos da navegação",
			type: "object",
			fields: [
				{
					name: "consulting",
					label: "Menu Consultoria",
					type: "object",
					fields: [
						localizedText("label", "Nome do menu"),
						navigationEntry(
							"immigrationMobility",
							"Migração e Mobilidade",
							true,
						),
						navigationEntry("legal", "Consultoria Jurídica", true),
						navigationEntry("environmentalEsg", "Ambiental e ESG", true),
						navigationEntry(
							"publicPolicy",
							"Políticas Públicas e Governança",
							true,
						),
						navigationEntry(
							"legalOpinions",
							"Pareceres e Notas Técnicas",
							true,
						),
					],
				},
				{
					name: "academic",
					label: "Menu Academia",
					type: "object",
					fields: [
						localizedText("label", "Nome do menu"),
						navigationEntry("mentoring", "Mentorias e Apoio Académico"),
						navigationEntry("publications", "Publicações"),
						navigationEntry("events", "Eventos e Palestras"),
						navigationEntry("speaking", "Palestras e Convites"),
						navigationEntry("training", "Cursos e Formações"),
					],
				},
				localizedText("about", "Sobre"),
				localizedText("contact", "Contacto"),
				localizedText("booking", "Agendar contacto"),
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
			label: "SEO global",
			type: "object",
			required: true,
			fields: [
				localizedText("defaultTitle", "Default title"),
				localizedText("defaultDescription", "Default description"),
				{
					name: "defaultImage",
					label: "Imagem social predefinida",
					type: "image",
				},
			],
		},
		{
			name: "footer",
			label: "Rodapé e navegação legal",
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
