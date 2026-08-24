export function safeCalendlyUrl(value: unknown): string | null {
	if (typeof value !== "string" || value.trim() === "") return null;
	try {
		const url = new URL(value);
		const isCalendlyHost =
			url.hostname === "calendly.com" || url.hostname.endsWith(".calendly.com");
		return url.protocol === "https:" && isCalendlyHost ? url.href : null;
	} catch {
		return null;
	}
}
