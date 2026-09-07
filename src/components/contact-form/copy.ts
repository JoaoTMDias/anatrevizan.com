export type Locale = "pt-PT" | "en";
export type Channel = "email" | "whatsapp";

export const contactFormCopy = {
	"pt-PT": {
		legend: "Como prefere enviar o seu pedido?",
		channelInstruction:
			"A escolha do canal altera os dados necessários e a forma de envio.",
		emailSelected:
			"Envio pelo formulário selecionado. O endereço de email é obrigatório.",
		whatsappSelected:
			"Envio pelo WhatsApp selecionado. Não é necessário indicar um email.",
		emailChannel: "Enviar pelo formulário",
		emailHelp: "O pedido será enviado por email e registado de forma segura.",
		whatsappChannel: "Enviar pelo WhatsApp",
		whatsappHelp:
			"Abriremos o WhatsApp com a mensagem pronta para rever e enviar.",
		name: "Nome",
		email: "E-mail",
		whatsapp: "WhatsApp (opcional)",
		requestType: "Tipo de pedido",
		country: "País onde está",
		message: "Mensagem",
		messageHint:
			"Não inclua dados particularmente sensíveis que não sejam necessários para este primeiro contacto.",
		messagePlaceholder: "Conte brevemente o que aconteceu e o que procura",
		privacyNotice:
			"Usaremos os dados para receber e responder ao seu pedido. Consulte a",
		privacyExternal:
			"Ao continuar, sairá deste site para o WhatsApp, que tratará os dados segundo as suas próprias práticas.",
		privacy: "Política de Privacidade",
		submit: "Enviar pedido",
		sending: "A enviar…",
		openWhatsapp: "Continuar no WhatsApp",
		whatsappNotice:
			"A mensagem só será enviada depois de confirmar no WhatsApp.",
		success:
			"Mensagem enviada com sucesso. Receberá uma confirmação por email.",
		error:
			"Não foi possível enviar a mensagem. Os dados foram mantidos para poder tentar novamente.",
		turnstileError:
			"Não foi possível concluir a verificação de segurança. Tente novamente.",
		configurationError:
			"O envio por email ainda não está configurado. Pode contactar através do WhatsApp.",
		choose: "Selecione uma opção",
		required: "Este campo é obrigatório.",
		invalidEmail: "Introduza um endereço de email válido.",
		shortName: "Introduza pelo menos 2 caracteres.",
		shortMessage: "Introduza pelo menos 20 caracteres.",
		formLabel: "Pedido de contacto",
		errorSummary: "Corrija os campos assinalados",
		fallbackHeading: "Continuar pelo WhatsApp",
		fallbackIntro:
			"O envio pelo formulário está indisponível. Reveja a mensagem antes de a transferir para o WhatsApp.",
		fallbackNote: "Nota: o formulário do site estava indisponível.",
		fallbackPreview: "Mensagem para o WhatsApp",
		fallbackTooLong: "Reduza a mensagem antes de continuar no WhatsApp.",
		copyFallback: "Copiar número e mensagem",
		copyInstructions:
			"Se o WhatsApp não abrir, copie manualmente o número e a mensagem abaixo.",
		externalHint: "abre num novo separador",
	},
	en: {
		legend: "How would you like to send your request?",
		channelInstruction:
			"Your choice changes the information required and how the request is sent.",
		emailSelected: "Form submission selected. An email address is required.",
		whatsappSelected:
			"WhatsApp submission selected. You do not need to provide an email address.",
		emailChannel: "Send through the form",
		emailHelp: "Your request will be emailed and recorded securely.",
		whatsappChannel: "Send through WhatsApp",
		whatsappHelp:
			"We will open WhatsApp with your message ready to review and send.",
		name: "Name",
		email: "Email",
		whatsapp: "WhatsApp (optional)",
		requestType: "Type of request",
		country: "Country",
		message: "Message",
		messageHint:
			"Do not include particularly sensitive information that is not needed for this initial contact.",
		messagePlaceholder:
			"Briefly explain what happened and what you are looking for",
		privacyNotice:
			"We will use the data to receive and reply to your request. See the",
		privacyExternal:
			"Continuing takes you away from this site to WhatsApp, which processes data under its own practices.",
		privacy: "Privacy Policy",
		submit: "Send request",
		sending: "Sending…",
		openWhatsapp: "Continue to WhatsApp",
		whatsappNotice:
			"Your message will only be sent after you confirm it in WhatsApp.",
		success:
			"Your message was sent successfully. You will receive a confirmation by email.",
		error:
			"The message could not be sent. Your entries were kept so you can try again.",
		turnstileError:
			"The security check could not be completed. Please try again.",
		configurationError:
			"Email submission is not configured yet. You can contact me through WhatsApp.",
		choose: "Select an option",
		required: "This field is required.",
		invalidEmail: "Enter a valid email address.",
		shortName: "Enter at least 2 characters.",
		shortMessage: "Enter at least 20 characters.",
		formLabel: "Contact request",
		errorSummary: "Correct the highlighted fields",
		fallbackHeading: "Continue through WhatsApp",
		fallbackIntro:
			"Form submission is unavailable. Review the message before transferring it to WhatsApp.",
		fallbackNote: "Note: the website form was unavailable.",
		fallbackPreview: "Message for WhatsApp",
		fallbackTooLong: "Shorten the message before continuing to WhatsApp.",
		copyFallback: "Copy number and message",
		copyInstructions:
			"If WhatsApp does not open, manually copy the number and message below.",
		externalHint: "opens in a new tab",
	},
} as const;

export type ContactFormCopy = (typeof contactFormCopy)[Locale];
