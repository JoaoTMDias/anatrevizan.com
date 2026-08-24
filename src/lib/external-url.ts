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

const approvedProfileHosts = new Set([
	"linkedin.com",
	"www.linkedin.com",
	"instagram.com",
	"www.instagram.com",
	"orcid.org",
	"www.orcid.org",
]);

export function safeProfileUrl(value: unknown): string | null {
	if (typeof value !== "string" || value.trim() === "") return null;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && approvedProfileHosts.has(url.hostname)
			? url.href
			: null;
	} catch {
		return null;
	}
}

export function safeEmailHref(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const email = value.trim();
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}

export function safeWhatsAppHref(value: unknown): string | null {
	if (typeof value !== "string" || !value.trim().startsWith("+")) return null;
	const digits = value.replace(/\D/g, "");
	return digits.length >= 8 && digits.length <= 15
		? `https://wa.me/${digits}`
		: null;
}
