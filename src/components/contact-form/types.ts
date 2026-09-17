import type { Channel, Locale } from "./copy";

export interface FormValues {
	channel: Channel;
	scope: string;
	name: string;
	email: string;
	whatsapp: string;
	requestType: string;
	country: string;
	message: string;
	website: string;
	turnstileToken: string;
}

export interface Option {
	label: string;
	value: string;
	flag?: string;
}

export interface ContactFormProps {
	locale: Locale;
	formHeadingId: string;
	privacyHref: string;
	requestTypes: Array<Option & { scope: string }>;
	scopeNotice?: string;
	turnstileSiteKey: string;
	whatsappHref: string | null;
}

export interface ContactResponse {
	version: 1;
	ok: boolean;
	code: "accepted" | "invalid" | "unavailable";
	requestId: string;
}
