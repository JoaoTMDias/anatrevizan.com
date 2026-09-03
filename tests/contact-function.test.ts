import { generateKeyPairSync } from "node:crypto";
import type { Context } from "@netlify/functions";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import contact from "../netlify/functions/contact.ts";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const environment: Record<string, string> = {
	TURNSTILE_SECRET_KEY: "turnstile-secret",
	GOOGLE_SERVICE_ACCOUNT_EMAIL: "contact@example.iam.gserviceaccount.com",
	GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: privateKey.export({
		type: "pkcs8",
		format: "pem",
	}) as string,
	GOOGLE_SHEETS_SPREADSHEET_ID: "spreadsheet-id",
	GOOGLE_SHEETS_TAB: "Pedidos",
	RESEND_API_KEY: "resend-key",
	CONTACT_EMAIL_FROM: "Ana <formulario@mail.example.com>",
	CONTACT_EMAIL_TO: "contato@example.com",
};

const body = {
	requestId: "0b4f45d7-663d-4ceb-a6c4-9a338caa548f",
	locale: "pt-PT",
	name: "Maria Silva",
	email: "maria@example.com",
	whatsapp: "",
	requestType: "request-1",
	country: "PT",
	message: "Preciso de orientação sobre este assunto.",
	consent: true,
	website: "",
	startedAt: Date.now() - 4_000,
	turnstileToken: "token",
};

function request(payload: unknown = body): Request {
	return new Request("https://example.com/api/contact", {
		method: "POST",
		headers: {
			Origin: "https://example.com",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

function successfulFetch(url: string | URL | Request, init?: RequestInit) {
	const href = String(url);
	if (href.includes("turnstile"))
		return Promise.resolve(
			Response.json({
				success: true,
				hostname: "example.com",
				action: "contact_form",
			}),
		);
	if (href.includes("oauth2"))
		return Promise.resolve(Response.json({ access_token: "google-token" }));
	if (href.includes("B2%3AB")) return Promise.resolve(Response.json({}));
	if (href.includes("sheets.googleapis.com") && init?.method === "POST")
		return Promise.resolve(
			Response.json({ updates: { updatedRange: "Pedidos!A2:L2" } }),
		);
	return Promise.resolve(Response.json({ id: "ok" }));
}

describe("contact Netlify Function", () => {
	beforeEach(() => {
		vi.stubGlobal("Netlify", {
			env: { get: (name: string) => environment[name] },
		});
		vi.stubGlobal("fetch", vi.fn(successfulFetch));
		vi.spyOn(console, "error").mockImplementation(() => undefined);
	});

	afterEach(() => vi.restoreAllMocks());

	it("persists once and sends both emails", async () => {
		const response = await contact(request(), { ip: "127.0.0.1" } as Context);
		expect(response.status).toBe(200);
		const calls = vi.mocked(fetch).mock.calls;
		expect(
			calls.filter(([url]) => String(url).includes("api.resend.com")),
		).toHaveLength(2);
		expect(
			calls.filter(([url]) => String(url).includes("insertDataOption")),
		).toHaveLength(1);
	});

	it("rejects invalid, cross-origin and failed Turnstile submissions", async () => {
		expect((await contact(request({}), {} as Context)).status).toBe(400);
		const crossOrigin = new Request("https://example.com/api/contact", {
			method: "POST",
			headers: { Origin: "https://attacker.example" },
			body: JSON.stringify(body),
		});
		expect((await contact(crossOrigin, {} as Context)).status).toBe(403);
		vi.mocked(fetch).mockResolvedValueOnce(
			Response.json({ success: false, hostname: "example.com" }),
		);
		expect((await contact(request(), {} as Context)).status).toBe(400);
	});

	it("returns success when email delivery fails after persistence", async () => {
		vi.mocked(fetch).mockImplementation((url, init) => {
			if (String(url).includes("api.resend.com"))
				return Promise.resolve(new Response(null, { status: 503 }));
			return successfulFetch(url, init);
		});
		const response = await contact(request(), {} as Context);
		expect(response.status).toBe(200);
		expect(console.error).toHaveBeenCalledWith(
			"contact-email-delivery-failed",
			expect.objectContaining({ requestId: body.requestId }),
		);
	});

	it("does not send email when Sheets persistence fails", async () => {
		vi.mocked(fetch).mockImplementation((url, init) => {
			if (
				String(url).includes("sheets.googleapis.com") &&
				init?.method === "POST"
			)
				return Promise.resolve(new Response(null, { status: 503 }));
			return successfulFetch(url, init);
		});
		const response = await contact(request(), {} as Context);
		expect(response.status).toBe(503);
		expect(
			vi
				.mocked(fetch)
				.mock.calls.some(([url]) => String(url).includes("api.resend.com")),
		).toBe(false);
	});
});
