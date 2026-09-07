import type { Channel, Locale } from "./copy";

export interface FormValues {
	channel: Channel;
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
}

export interface ContactFormProps {
	locale: Locale;
	privacyHref: string;
	requestTypes: Option[];
	turnstileSiteKey: string;
	whatsappHref: string | null;
}

export interface ContactResponse {
	version: 1;
	ok: boolean;
	code: "accepted" | "invalid" | "unavailable";
	requestId: string;
}
