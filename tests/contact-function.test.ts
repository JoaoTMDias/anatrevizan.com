import { generateKeyPairSync } from "node:crypto";
import type { Context } from "@netlify/functions";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import contact from "../netlify/functions/contact.ts";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const emailStatusValues = ["failed", "not-configured", "sent"] as const;
type EmailStatus = (typeof emailStatusValues)[number];

const defaultEnvironment: Record<string, string> = {
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
let environment: Record<string, string>;

const body = {
	requestId: "0b4f45d7-663d-4ceb-a6c4-9a338caa548f",
	locale: "pt-PT",
	name: "Maria Silva",
	email: "maria@example.com",
	whatsapp: "",
	requestType: "request-1",
	country: "PT",
	message: "Preciso de orientação sobre este assunto.",
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

function expectEmailStatuses(statuses: [EmailStatus, EmailStatus]) {
	const update = vi
		.mocked(fetch)
		.mock.calls.find(
			([url, init]) =>
				String(url).includes("sheets.googleapis.com") && init?.method === "PUT",
		);
	expect(update).toBeDefined();
	expect(JSON.parse(String(update?.[1]?.body)).values).toEqual([statuses]);
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
		environment = { ...defaultEnvironment };
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
		await expect(response.json()).resolves.toEqual({
			version: 1,
			ok: true,
			code: "accepted",
			requestId: body.requestId,
		});
		expectEmailStatuses(["sent", "sent"]);
		const calls = vi.mocked(fetch).mock.calls;
		const emails = calls.filter(([url]) =>
			String(url).includes("api.resend.com"),
		);
		const messages = emails.map(([, init]) => JSON.parse(String(init?.body)));
		expect(messages[0]).toMatchObject({
			from: environment.CONTACT_EMAIL_FROM,
			to: [environment.CONTACT_EMAIL_TO],
			reply_to: body.email,
		});
		expect(messages[1]).toMatchObject({
			from: environment.CONTACT_EMAIL_FROM,
			to: [body.email],
			reply_to: environment.CONTACT_EMAIL_TO,
		});
		expect(
			calls.findIndex(([url]) => String(url).includes("insertDataOption")),
		).toBeLessThan(calls.indexOf(emails[0]));
		expect(
			calls.filter(([url]) => String(url).includes("api.resend.com")),
		).toHaveLength(2);
		expect(
			calls.filter(([url]) => String(url).includes("insertDataOption")),
		).toHaveLength(1);
		expect(
			calls.some(([url]) => String(url).includes(":append?valueInputOption")),
		).toBe(true);
	});

	it.each(["RESEND_API_KEY", "CONTACT_EMAIL_FROM", "CONTACT_EMAIL_TO"])(
		"persists successfully without %s",
		async (key) => {
			delete environment[key];

			const response = await contact(request(), {} as Context);
			expect(response.status).toBe(200);
			await expect(response.json()).resolves.toMatchObject({
				code: "accepted",
				requestId: body.requestId,
			});
			expectEmailStatuses(["not-configured", "not-configured"]);
			expect(
				vi
					.mocked(fetch)
					.mock.calls.some(([url]) => String(url).includes("api.resend.com")),
			).toBe(false);
		},
	);

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
		await expect(response.json()).resolves.toMatchObject({
			version: 1,
			ok: true,
			code: "accepted",
			requestId: body.requestId,
		});
		expectEmailStatuses(["failed", "failed"]);
		expect(console.error).toHaveBeenCalledWith(
			"contact-email-delivery-failed",
			expect.objectContaining({ requestId: body.requestId }),
		);
	});

	it.each([0, 1])(
		"keeps independent statuses when email %s rejects without logging sensitive errors",
		async (failedIndex) => {
			let emailIndex = 0;
			vi.mocked(fetch).mockImplementation((url, init) => {
				if (
					String(url).includes("api.resend.com") &&
					emailIndex++ === failedIndex
				)
					return Promise.reject(
						new Error(
							`${environment.RESEND_API_KEY} ${body.email} ${body.message} ${body.turnstileToken}`,
						),
					);
				return successfulFetch(url, init);
			});
			expect((await contact(request(), {} as Context)).status).toBe(200);
			expectEmailStatuses(
				failedIndex === 0 ? ["failed", "sent"] : ["sent", "failed"],
			);
			expect(console.error).toHaveBeenCalledExactlyOnceWith(
				"contact-email-delivery-failed",
				{
					requestId: body.requestId,
					target: failedIndex === 0 ? "admin" : "confirmation",
				},
			);
		},
	);

	it("returns success when the email status write fails", async () => {
		vi.mocked(fetch).mockImplementation((url, init) => {
			if (init?.method === "PUT")
				return Promise.reject(new Error("sensitive upstream error"));
			return successfulFetch(url, init);
		});
		const response = await contact(request(), {} as Context);
		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toMatchObject({
			ok: true,
			code: "accepted",
		});
		expect(console.error).toHaveBeenCalledExactlyOnceWith(
			"contact-email-status-update-failed",
			{ requestId: body.requestId },
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
		await expect(response.json()).resolves.toEqual({
			version: 1,
			ok: false,
			code: "unavailable",
			requestId: body.requestId,
		});
		expect(
			vi
				.mocked(fetch)
				.mock.calls.some(([url]) => String(url).includes("api.resend.com")),
		).toBe(false);
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('"error":"Google Sheets append failed (503)"'),
		);
	});

	it("treats a previously persisted request as accepted without sending again", async () => {
		vi.mocked(fetch).mockImplementation((url, init) => {
			if (String(url).includes("B2%3AB"))
				return Promise.resolve(Response.json({ values: [[body.requestId]] }));
			return successfulFetch(url, init);
		});
		const response = await contact(request(), {} as Context);
		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toMatchObject({
			code: "accepted",
			requestId: body.requestId,
		});
		expect(
			vi
				.mocked(fetch)
				.mock.calls.some(([url]) => String(url).includes("api.resend.com")),
		).toBe(false);
	});

	it.each(["oauth2", "B2%3AB"])(
		"returns unavailable when the %s boundary fails",
		async (boundary) => {
			vi.mocked(fetch).mockImplementation((url, init) => {
				if (String(url).includes(boundary))
					return Promise.resolve(new Response(null, { status: 503 }));
				return successfulFetch(url, init);
			});
			const response = await contact(request(), {} as Context);
			expect(response.status).toBe(503);
			await expect(response.json()).resolves.toMatchObject({
				code: "unavailable",
				requestId: body.requestId,
			});
		},
	);
});
