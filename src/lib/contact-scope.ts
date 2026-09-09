export const contactScopes = [
	"BR_LEGAL",
	"PT_ADMIN",
	"ACADEMIC",
	"OTHER",
] as const;
export type ContactScope = (typeof contactScopes)[number];
export function isContactScope(value: unknown): value is ContactScope {
	return contactScopes.includes(value as ContactScope);
}
export const scopeLabels = {
	"pt-PT": {
		BR_LEGAL: "Brasil — assunto jurídico de Direito brasileiro",
		PT_ADMIN: "Portugal — apoio administrativo ou documental",
		ACADEMIC: "Academia — mentoria, investigação, palestra ou formação",
		OTHER: "Outro pedido profissional",
	},
	en: {
		BR_LEGAL: "Brazil — legal matter under Brazilian law",
		PT_ADMIN: "Portugal — administrative or document support",
		ACADEMIC: "Academia — mentoring, research, talk or training",
		OTHER: "Other professional request",
	},
};
export const scopeSubmitLabels = {
	"pt-PT": {
		BR_LEGAL: "Enviar pedido de contacto jurídico",
		PT_ADMIN: "Enviar pedido de apoio administrativo",
		ACADEMIC: "Enviar pedido académico",
		OTHER: "Enviar pedido profissional",
	},
	en: {
		BR_LEGAL: "Send a legal contact request",
		PT_ADMIN: "Send an administrative support request",
		ACADEMIC: "Send an academic enquiry",
		OTHER: "Send a professional enquiry",
	},
};
export const scopeConfirmations = {
	"pt-PT": {
		BR_LEGAL:
			"Recebi o seu pedido relativo a Direito brasileiro. Atuação no Brasil — OAB/SP n.º 330.386.",
		PT_ADMIN:
			"Recebi o seu pedido de apoio administrativo ou documental em Portugal. Este contacto não inclui consulta ou avaliação jurídica, representação ou mandato.",
		ACADEMIC:
			"Recebi o seu pedido académico, de investigação, palestra ou formação.",
		OTHER:
			"Recebi o seu pedido profissional. O próximo contacto permitirá esclarecer o âmbito.",
	},
	en: {
		BR_LEGAL:
			"I received your enquiry relating to Brazilian law. Practice in Brazil — OAB/SP no. 330.386.",
		PT_ADMIN:
			"I received your request for administrative or document support in Portugal. This contact does not include legal advice or assessment, representation or a mandate.",
		ACADEMIC:
			"I received your academic, research, speaking or training enquiry.",
		OTHER:
			"I received your professional enquiry. The next contact will clarify its scope.",
	},
};
export function requestMatchesScope(
	types: readonly { id: string; scope: string }[],
	id: string,
	scope: string,
): boolean {
	return (
		isContactScope(scope) &&
		fixedRequestScopes[id] === scope &&
		types.some((type) => type.id === id && type.scope === scope)
	);
}

export const fixedRequestScopes: Record<string, ContactScope> = {
	"brazil-law": "BR_LEGAL",
	"brazil-environment": "BR_LEGAL",
	"brazil-civil-contracts-consumer": "BR_LEGAL",
	"brazil-labour": "BR_LEGAL",
	"brazil-human-rights": "BR_LEGAL",
	"brazil-legal-opinion": "BR_LEGAL",
	"portugal-administrative": "PT_ADMIN",
	"academic-mentoring": "ACADEMIC",
	"academic-research": "ACADEMIC",
	"academic-training": "ACADEMIC",
	"academic-speaking": "ACADEMIC",
	"professional-other": "OTHER",
};
