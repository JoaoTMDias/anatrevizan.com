import { buildWhatsAppMessage, contactCountries } from "@/lib/contact-form";
import { isContactScope } from "@/lib/contact-scope";
import type { Locale } from "./copy";
import type { ContactFormProps, FormValues } from "./types";

export function buildWhatsappPreview(
	data: FormValues,
	locale: Locale,
	requestTypes: ContactFormProps["requestTypes"],
	fallbackNote: string,
	emailLabel: string,
	whatsappLabel: string,
	isFallback = false,
) {
	const country =
		contactCountries.find((item) => item.value === data.country)?.label[
			locale
		] ?? data.country;
	const requestType =
		requestTypes.find((item) => item.value === data.requestType)?.label ??
		data.requestType;

	return [
		isFallback ? fallbackNote : "",
		buildWhatsAppMessage({
			locale,
			name: data.name,
			scope: isContactScope(data.scope) ? data.scope : "OTHER",
			requestType,
			country,
			message: data.message,
		}),
		data.email ? `${emailLabel}: ${data.email}` : "",
		data.whatsapp ? `${whatsappLabel}: ${data.whatsapp}` : "",
	]
		.filter(Boolean)
		.join("\n\n");
}

export function canOfferWhatsappFallback(
	data: FormValues,
	requestTypes: ContactFormProps["requestTypes"],
) {
	return (
		isContactScope(data.scope) &&
		requestTypes.some(
			(option) =>
				option.value === data.requestType && option.scope === data.scope,
		)
	);
}
