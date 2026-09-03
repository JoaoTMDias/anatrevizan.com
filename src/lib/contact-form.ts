import { z } from "zod";

export const CONTACT_FORM_ACTION = "contact_form";
export const CONTACT_FORM_MINIMUM_SECONDS = 3;
export const CONTACT_FORM_MAXIMUM_BYTES = 16_384;

export const contactCountries = [
	{ value: "PT", label: { "pt-PT": "Portugal", en: "Portugal" } },
	{ value: "BR", label: { "pt-PT": "Brasil", en: "Brazil" } },
	{ value: "ES", label: { "pt-PT": "Espanha", en: "Spain" } },
	{
		value: "EU_OTHER",
		label: {
			"pt-PT": "Outro país da União Europeia",
			en: "Another European Union country",
		},
	},
	{ value: "OTHER", label: { "pt-PT": "Outro", en: "Other" } },
] as const;

const countryValues = contactCountries.map((country) => country.value) as [
	string,
	...string[],
];

export const contactSubmissionSchema = z
	.object({
		requestId: z.uuid(),
		locale: z.enum(["pt-PT", "en"]),
		name: z.string().trim().min(2).max(120),
		email: z.email().max(254),
		whatsapp: z.string().trim().max(32).optional().default(""),
		requestType: z.string().trim().min(1).max(160),
		country: z.enum(countryValues),
		message: z.string().trim().min(20).max(5_000),
		consent: z.literal(true),
		website: z.string().max(0),
		startedAt: z.number().int().positive(),
		turnstileToken: z.string().min(1).max(2_048),
	})
	.strict();

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export function normalizeSheetCell(value: unknown): string {
	const text = String(value ?? "")
		.replaceAll("\u0000", "")
		.trim();
	return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

export function isPlausibleSubmissionTime(
	startedAt: number,
	now = Date.now(),
): boolean {
	const elapsed = now - startedAt;
	return (
		Number.isFinite(elapsed) &&
		elapsed >= CONTACT_FORM_MINIMUM_SECONDS * 1_000 &&
		elapsed <= 24 * 60 * 60 * 1_000
	);
}

export function buildWhatsAppMessage(input: {
	locale: "pt-PT" | "en";
	name: string;
	requestType: string;
	country: string;
	message: string;
}): string {
	const labels =
		input.locale === "en"
			? { intro: "Hello, my name is", type: "Request", country: "Country" }
			: { intro: "Olá, o meu nome é", type: "Pedido", country: "País" };
	return `${labels.intro} ${input.name}.\n\n${labels.type}: ${input.requestType}\n${labels.country}: ${input.country}\n\n${input.message}`;
}
