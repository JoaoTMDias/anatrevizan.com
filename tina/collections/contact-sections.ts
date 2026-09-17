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
			text("bookingHeading", "Título do agendamento"),
			text("bookingIntro", "Introdução do agendamento"),
			text("duration", "Duração"),
			text("validFor", "Temas aplicáveis"),
			text("timezone", "Fuso horário"),
			text("timezoneNote", "Nota sobre o fuso horário"),
			text("otherMethodsHeading", "Título das outras formas de contacto"),
			text("countriesLabel", "Texto das regiões de atendimento"),
			text("languagesLabel", "Texto dos idiomas de atendimento"),
		],
	},
];
