import type { PublishedLocale } from "./routing";

const copy = {
	"pt-PT": {
		nameLabel: "Nome",
		whatsappLabel: "WhatsApp",
		emailLabel: "E-mail",
		requestTypeLabel: "Tipo de pedido",
		countryLabel: "País onde está",
		subjectLabel: "Assunto",
		subjectPlaceholder: "Conte o que aconteceu e o que procura",
		consentText:
			"Consinto com o tratamento dos meus dados pessoais de acordo com a",
		privacyPolicyLabel: "Política de Privacidade",
		submitLabel: "Enviar",
		successMessage:
			"Mensagem enviada com sucesso. Entrarei em contacto em breve.",
		errorMessage:
			"Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.",
		countries: [
			"Portugal",
			"Brasil",
			"Espanha",
			"Outro país da União Europeia",
			"Outro",
		],
	},
	en: {
		nameLabel: "Name",
		whatsappLabel: "WhatsApp",
		emailLabel: "Email",
		requestTypeLabel: "Type of request",
		countryLabel: "Country",
		subjectLabel: "Subject",
		subjectPlaceholder: "Tell me what happened and what you are looking for",
		consentText:
			"I consent to the processing of my personal data in accordance with the",
		privacyPolicyLabel: "Privacy Policy",
		submitLabel: "Send",
		successMessage:
			"Your message was sent successfully. I will be in touch soon.",
		errorMessage: "The message could not be sent. Please try again.",
		countries: [
			"Portugal",
			"Brazil",
			"Spain",
			"Another European Union country",
			"Other",
		],
	},
} as const;

export function contactFormCopy(locale: PublishedLocale) {
	return copy[locale];
}
