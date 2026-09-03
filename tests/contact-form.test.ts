import { describe, expect, it } from "vitest";
import {
	buildWhatsAppMessage,
	contactSubmissionSchema,
	isPlausibleSubmissionTime,
	normalizeSheetCell,
} from "../src/lib/contact-form.ts";

const validSubmission = {
	requestId: "0b4f45d7-663d-4ceb-a6c4-9a338caa548f",
	locale: "pt-PT" as const,
	name: "Maria Silva",
	email: "maria@example.com",
	whatsapp: "",
	requestType: "request-1",
	country: "PT",
	message: "Preciso de orientação sobre este assunto.",
	consent: true as const,
	website: "",
	startedAt: Date.now() - 4_000,
	turnstileToken: "valid-token",
};

describe("contact form", () => {
	it("accepts the strict email submission shape", () => {
		expect(contactSubmissionSchema.safeParse(validSubmission).success).toBe(
			true,
		);
		expect(
			contactSubmissionSchema.safeParse({ ...validSubmission, extra: true })
				.success,
		).toBe(false);
	});

	it("rejects missing consent, invalid email and oversized messages", () => {
		for (const submission of [
			{ ...validSubmission, consent: false },
			{ ...validSubmission, email: "invalid" },
			{ ...validSubmission, message: "x".repeat(5_001) },
		])
			expect(contactSubmissionSchema.safeParse(submission).success).toBe(false);
	});

	it("rejects implausibly fast and stale submissions", () => {
		const now = Date.now();
		expect(isPlausibleSubmissionTime(now - 4_000, now)).toBe(true);
		expect(isPlausibleSubmissionTime(now - 1_000, now)).toBe(false);
		expect(isPlausibleSubmissionTime(now - 25 * 60 * 60 * 1_000, now)).toBe(
			false,
		);
	});

	it("neutralizes spreadsheet formula prefixes", () => {
		expect(normalizeSheetCell("=IMPORTXML('x')")).toBe("'=IMPORTXML('x')");
		expect(normalizeSheetCell("@command")).toBe("'@command");
		expect(normalizeSheetCell("ordinary text")).toBe("ordinary text");
	});

	it("builds localized, URL-encodable WhatsApp messages", () => {
		const message = buildWhatsAppMessage({
			locale: "en",
			name: "John Smith",
			requestType: "Legal consultation",
			country: "Portugal",
			message: "I would like to arrange an initial conversation.",
		});
		expect(message).toContain("Hello, my name is John Smith.");
		expect(message).toContain("Request: Legal consultation");
		expect(decodeURIComponent(encodeURIComponent(message))).toBe(message);
	});
});
