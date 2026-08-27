import type { PublishedLocale } from "./routing";

export interface LocalizedValue {
	pt: unknown;
	en: unknown;
}

export function isLocalizedValue(value: unknown): value is LocalizedValue {
	return Boolean(
		value &&
			typeof value === "object" &&
			!Array.isArray(value) &&
			"pt" in value &&
			"en" in value,
	);
}

export function localizeValue(
	value: unknown,
	locale: PublishedLocale,
): unknown {
	if (isLocalizedValue(value))
		return localizeValue(locale === "pt-PT" ? value.pt : value.en, locale);
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
		const localized = locale === "pt-PT" ? value.pt : value.en;
		return locale === "en" &&
			typeof value.pt === "string" &&
			value.pt.trim() !== "" &&
			typeof localized === "string" &&
			localized.trim() === ""
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

export function isLocaleComplete(
	value: unknown,
	locale: PublishedLocale,
): boolean {
	return missingLocalizedPaths(value, locale).length === 0;
}
