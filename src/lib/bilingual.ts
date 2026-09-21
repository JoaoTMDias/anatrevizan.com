import type { PublishedLocale } from "./routing";

export interface LocalizedValue {
	"pt-PT": unknown;
	"pt-BR": unknown;
	en: unknown;
}

function localeValue(value: Record<string, unknown>, locale: PublishedLocale) {
	return value[locale] ?? value[locale.replace("-", "_")];
}

export function isLocalizedValue(value: unknown): value is LocalizedValue {
	return Boolean(
		value &&
			typeof value === "object" &&
			!Array.isArray(value) &&
			("pt-PT" in value || "pt_PT" in value) &&
			("pt-BR" in value || "pt_BR" in value) &&
			"en" in value,
	);
}

export function localizeValue(
	value: unknown,
	locale: PublishedLocale,
): unknown {
	if (isLocalizedValue(value))
		return localizeValue(
			localeValue(value as unknown as Record<string, unknown>, locale),
			locale,
		);
	if (Array.isArray(value))
		return value.map((item) => localizeValue(item, locale));
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value).map(([key, child]) => [
				key,
				localizeValue(child, locale),
			]),
		);
	return value;
}

export function missingLocalizedPaths(
	value: unknown,
	locale: PublishedLocale,
	prefix = "",
): string[] {
	if (isLocalizedValue(value)) {
		const localized = localeValue(
			value as unknown as Record<string, unknown>,
			locale,
		);
		return locale !== "pt-PT" &&
			hasLocalizedContent(
				localeValue(value as unknown as Record<string, unknown>, "pt-PT"),
			) &&
			!hasLocalizedContent(localized)
			? [prefix]
			: [];
	}
	if (Array.isArray(value))
		return value.flatMap((item, index) =>
			missingLocalizedPaths(item, locale, `${prefix}[${index}]`),
		);
	if (value && typeof value === "object")
		return Object.entries(value).flatMap(([key, child]) =>
			missingLocalizedPaths(child, locale, prefix ? `${prefix}.${key}` : key),
		);
	return [];
}

export function hasLocalizedContent(value: unknown): boolean {
	if (typeof value === "string") return value.trim() !== "";
	if (Array.isArray(value)) return value.some(hasLocalizedContent);
	if (!value || typeof value !== "object") return false;
	const record = value as Record<string, unknown>;
	if (record.type === "text") return hasLocalizedContent(record.text);
	return "children" in record && hasLocalizedContent(record.children);
}

export function isLocaleComplete(
	value: unknown,
	locale: PublishedLocale,
): boolean {
	return missingLocalizedPaths(value, locale).length === 0;
}
