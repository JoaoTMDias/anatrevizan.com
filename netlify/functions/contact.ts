import { createSign } from "node:crypto";
import type { Config, Context } from "@netlify/functions";
import siteConfig from "../../src/content/config/site.json" with {
	type: "json",
};
import {
	CONTACT_FORM_ACTION,
	CONTACT_FORM_MAXIMUM_BYTES,
	contactCountries,
	contactSubmissionSchema,
	isPlausibleSubmissionTime,
	normalizeSheetCell,
} from "../../src/lib/contact-form";

const JSON_HEADERS = {
	"Content-Type": "application/json; charset=utf-8",
	"Cache-Control": "no-store",
};

const EXTERNAL_REQUEST_TIMEOUT_MS = 8_000;

function env(name: string): string {
	const value = Netlify.env.get(name);
	if (!value) throw new Error(`Missing environment variable: ${name}`);
	return value;
}

type ContactResponseCode = "accepted" | "invalid" | "unavailable";

function json(
	status: number,
	code: ContactResponseCode,
	requestId = "",
): Response {
	return new Response(
		JSON.stringify({ version: 1, ok: code === "accepted", code, requestId }),
		{
			status,
			headers: JSON_HEADERS,
		},
	);
}

function base64url(value: string | Buffer): string {
	return Buffer.from(value)
		.toString("base64")
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replace(/=+$/, "");
}

async function googleAccessToken(): Promise<string> {
	const now = Math.floor(Date.now() / 1_000);
	const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
	const claims = base64url(
		JSON.stringify({
			iss: env("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
			scope: "https://www.googleapis.com/auth/spreadsheets",
			aud: "https://oauth2.googleapis.com/token",
			iat: now,
			exp: now + 3_600,
		}),
	);
	const unsigned = `${header}.${claims}`;
	const signer = createSign("RSA-SHA256");
	signer.update(unsigned);
	const signature = signer.sign(
		env("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replaceAll("\\n", "\n"),
	);
	const assertion = `${unsigned}.${base64url(signature)}`;
	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion,
		}),
	});
	if (!response.ok)
		throw new Error(`Google authentication failed (${response.status})`);
	const payload = (await response.json()) as { access_token?: string };
	if (!payload.access_token)
		throw new Error("Google authentication returned no token");
	return payload.access_token;
}

function sheetsUrl(range: string, suffix = ""): string {
	const spreadsheetId = encodeURIComponent(env("GOOGLE_SHEETS_SPREADSHEET_ID"));
	return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}${suffix}`;
}

async function existingRequest(
	accessToken: string,
	requestId: string,
): Promise<boolean> {
	const tab = env("GOOGLE_SHEETS_TAB");
	const response = await fetch(sheetsUrl(`${tab}!B2:B`), {
		headers: { Authorization: `Bearer ${accessToken}` },
		signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
	});
	if (!response.ok)
		throw new Error(`Google Sheets read failed (${response.status})`);
	const payload = (await response.json()) as { values?: string[][] };
	return payload.values?.some((row) => row[0] === requestId) ?? false;
}

async function appendSubmission(
	accessToken: string,
	values: string[],
): Promise<number> {
	const tab = env("GOOGLE_SHEETS_TAB");
	const response = await fetch(
		sheetsUrl(
			`${tab}!A:L`,
			"?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
		),
		{
			method: "POST",
			signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ majorDimension: "ROWS", values: [values] }),
		},
	);
	if (!response.ok)
		throw new Error(`Google Sheets append failed (${response.status})`);
	const payload = (await response.json()) as {
		updates?: { updatedRange?: string };
	};
	const row = payload.updates?.updatedRange?.match(/![A-Z]+(\d+):/)?.[1];
	if (!row) throw new Error("Google Sheets append returned no row number");
	return Number(row);
}

async function updateEmailStatus(
	accessToken: string,
	row: number,
	statuses: [string, string],
): Promise<void> {
	const tab = env("GOOGLE_SHEETS_TAB");
	const response = await fetch(
		sheetsUrl(`${tab}!K${row}:L${row}`, "?valueInputOption=RAW"),
		{
			method: "PUT",
			signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ majorDimension: "ROWS", values: [statuses] }),
		},
	);
	if (!response.ok)
		throw new Error(`Google Sheets status update failed (${response.status})`);
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

async function sendEmail(message: {
	to: string;
	subject: string;
	html: string;
	replyTo?: string;
}): Promise<void> {
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
		headers: {
			Authorization: `Bearer ${env("RESEND_API_KEY")}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: env("CONTACT_EMAIL_FROM"),
			to: [message.to],
			subject: message.subject,
			html: message.html,
			reply_to: message.replyTo,
		}),
	});
	if (!response.ok)
		throw new Error(`Resend delivery failed (${response.status})`);
}

async function verifyTurnstile(
	token: string,
	request: Request,
	ip?: string,
): Promise<boolean> {
	const response = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				secret: env("TURNSTILE_SECRET_KEY"),
				response: token,
				...(ip ? { remoteip: ip } : {}),
			}),
		},
	);
	if (!response.ok) return false;
	const result = (await response.json()) as {
		success?: boolean;
		hostname?: string;
		action?: string;
	};
	return (
		result.success === true &&
		result.action === CONTACT_FORM_ACTION &&
		result.hostname === new URL(request.url).hostname
	);
}

function isSameOrigin(request: Request): boolean {
	const origin = request.headers.get("origin");
	if (!origin) return false;
	try {
		return new URL(origin).hostname === new URL(request.url).hostname;
	} catch {
		return false;
	}
}

export default async function contact(
	request: Request,
	context: Context,
): Promise<Response> {
	if (request.method !== "POST") return json(405, "invalid");
	if (!isSameOrigin(request)) return json(403, "invalid");
	const declaredLength = Number(request.headers.get("content-length") ?? 0);
	if (declaredLength > CONTACT_FORM_MAXIMUM_BYTES) return json(413, "invalid");

	let rawBody: string;
	const integrationStartedAt = Date.now();
	let integrationStage = "google-auth";
	const logIntegrationStage = (state: "started" | "completed") =>
		console.info(
			JSON.stringify({
				event: "contact-integration",
				requestId: submission.requestId,
				integrationStage,
				state,
				durationMs: Date.now() - integrationStartedAt,
			}),
		);
	try {
		rawBody = await request.text();
	} catch {
		return json(400, "invalid");
	}
	if (Buffer.byteLength(rawBody, "utf8") > CONTACT_FORM_MAXIMUM_BYTES)
		return json(413, "invalid");

	let parsed: ReturnType<typeof contactSubmissionSchema.safeParse>;
	try {
		parsed = contactSubmissionSchema.safeParse(JSON.parse(rawBody));
	} catch {
		return json(400, "invalid");
	}
	if (!parsed.success || !isPlausibleSubmissionTime(parsed.data.startedAt))
		return json(400, "invalid");
	const submission = parsed.data;
	const allowedRequestTypes = new Set(
		siteConfig.requestTypes.map((_, index) => `request-${index + 1}`),
	);
	if (!allowedRequestTypes.has(submission.requestType))
		return json(400, "invalid", submission.requestId);
	if (!(await verifyTurnstile(submission.turnstileToken, request, context.ip)))
		return json(400, "invalid", submission.requestId);

	try {
		const requestIndex =
			Number(submission.requestType.replace("request-", "")) - 1;
		const requestType =
			siteConfig.requestTypes[requestIndex]?.label[
				submission.locale === "en" ? "en" : "pt"
			];
		const country = contactCountries.find(
			(option) => option.value === submission.country,
		)?.label[submission.locale];
		if (!requestType || !country)
			return json(400, "invalid", submission.requestId);
		logIntegrationStage("started");
		const accessToken = await googleAccessToken();
		logIntegrationStage("completed");
		integrationStage = "sheets-read";
		logIntegrationStage("started");
		const duplicate = await existingRequest(accessToken, submission.requestId);
		logIntegrationStage("completed");
		if (duplicate) return json(200, "accepted", submission.requestId);

		integrationStage = "sheets-write";
		logIntegrationStage("started");
		const row = await appendSubmission(
			accessToken,
			[
				new Date().toISOString(),
				submission.requestId,
				"email",
				submission.locale,
				submission.name,
				submission.email,
				submission.whatsapp,
				requestType,
				country,
				submission.message,
				"pending",
				"pending",
			].map(normalizeSheetCell),
		);
		logIntegrationStage("completed");

		const safe = Object.fromEntries(
			Object.entries(submission).map(([key, value]) => [
				key,
				escapeHtml(String(value)),
			]),
		);
		integrationStage = "email-dispatch";
		logIntegrationStage("started");
		const adminEmail = sendEmail({
			to: env("CONTACT_EMAIL_TO"),
			replyTo: submission.email,
			subject:
				submission.locale === "en"
					? `New contact request — ${submission.name}`
					: `Novo pedido de contacto — ${submission.name}`,
			html: `<h1>Novo pedido de contacto</h1><p><strong>Nome:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>WhatsApp:</strong> ${safe.whatsapp || "—"}</p><p><strong>Tipo:</strong> ${escapeHtml(requestType)}</p><p><strong>País:</strong> ${escapeHtml(country)}</p><p><strong>Mensagem:</strong></p><p>${String(safe.message).replaceAll("\n", "<br>")}</p><p>ID: ${safe.requestId}</p>`,
		});
		const confirmationEmail = sendEmail({
			to: submission.email,
			replyTo: env("CONTACT_EMAIL_TO"),
			subject:
				submission.locale === "en"
					? "We received your message — Ana Trevizan"
					: "Recebemos a sua mensagem — Ana Trevizan",
			html:
				submission.locale === "en"
					? `<p>Hello ${safe.name},</p><p>Your message was received successfully. I will be in touch soon.</p><p>Ana Trevizan</p>`
					: `<p>Olá ${safe.name},</p><p>A sua mensagem foi recebida com sucesso. Entrarei em contacto em breve.</p><p>Ana Trevizan</p>`,
		});
		const results = await Promise.allSettled([adminEmail, confirmationEmail]);
		const statuses = results.map((result) =>
			result.status === "fulfilled" ? "sent" : "failed",
		) as [string, string];
		try {
			await updateEmailStatus(accessToken, row, statuses);
		} catch {
			console.error("contact-email-status-update-failed", {
				requestId: submission.requestId,
			});
		}
		for (const [index, result] of results.entries()) {
			if (result.status === "rejected")
				console.error("contact-email-delivery-failed", {
					requestId: submission.requestId,
					target: index === 0 ? "admin" : "confirmation",
				});
		}
		logIntegrationStage("completed");
		return json(200, "accepted", submission.requestId);
	} catch (error) {
		console.error(
			JSON.stringify({
				event: "contact-submission-persistence-failed",
				requestId: submission.requestId,
				integrationStage,
				state: "failed",
				error: error instanceof Error ? error.message : "unknown-error",
				durationMs: Date.now() - integrationStartedAt,
			}),
		);
		return json(503, "unavailable", submission.requestId);
	}
}

export const config: Config = {
	path: "/api/contact",
	method: ["POST"],
};
