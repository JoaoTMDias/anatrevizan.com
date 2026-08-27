import type { TinaField } from "tinacms";

const text = (name: string, label: string, required = true): TinaField => ({
	name,
	label,
	type: "string",
	required,
});

export const contactPageFields: TinaField[] = [
	{
		name: "contactPage",
		label: "Conteúdo da página de contacto",
		type: "object",
		fields: [
			text("tag", "Etiqueta do hero"),
			text("subtitle", "Introdução"),
			text("otherMethodsHeading", "Título das outras formas de contacto"),
			text("countriesLabel", "Texto das regiões de atendimento"),
			text("languagesLabel", "Texto dos idiomas de atendimento"),
			text("bookingCta", "CTA de agendamento"),
		],
	},
];

export const bookingPageFields: TinaField[] = [
	{
		name: "bookingPage",
		label: "Booking page sections",
		type: "object",
		fields: [
			text("tag", "Tag"),
			text("subtitle", "Subtitle"),
			text("duration", "Duration"),
			text("validFor", "Applicable topics"),
			text("timezone", "Timezone"),
			text("timezoneNote", "Timezone note"),
		],
	},
];
