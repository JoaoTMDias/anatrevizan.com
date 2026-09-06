import { createSign } from "node:crypto";
import type { Config } from "@netlify/functions";

const HEADERS = {
	"Content-Type": "application/json; charset=utf-8",
	"Cache-Control": "no-store",
};

function env(name: string): string {
	const value = Netlify.env.get(name);
	if (!value) throw new Error("missing-environment");
	return value;
}

function base64url(value: string | Buffer): string {
	return Buffer.from(value).toString("base64url");
}

export default async function contactHealth(): Promise<Response> {
	try {
		const now = Math.floor(Date.now() / 1_000);
		const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
		const claims = base64url(JSON.stringify({
			iss: env("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
			scope: "https://www.googleapis.com/auth/spreadsheets",
			aud: "https://oauth2.googleapis.com/token",
			iat: now,
			exp: now + 3_600,
		}));
		const unsigned = `${header}.${claims}`;
		const signer = createSign("RSA-SHA256");
		signer.update(unsigned);
		const signature = signer.sign(
			env("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replaceAll("\\n", "\n"),
		);
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			signal: AbortSignal.timeout(8_000),
			body: new URLSearchParams({
				grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
				assertion: `${unsigned}.${base64url(signature)}`,
			}),
		});
		const payload = await response.json() as { error?: string };
		return new Response(JSON.stringify({
			ok: response.ok,
			stage: "google-auth",
			status: response.status,
			error: payload.error ?? null,
		}), { status: response.ok ? 200 : 503, headers: HEADERS });
	} catch (error) {
		const errorCode =
			error instanceof Error && error.message === "missing-environment"
				? "missing-environment"
				: error instanceof Error && error.name === "TimeoutError"
					? "timeout"
					: "signing-or-network";
		return new Response(JSON.stringify({
			ok: false,
			stage: "google-auth-local",
			error: errorCode,
		}), { status: 503, headers: HEADERS });
	}
}

export const config: Config = {
	path: "/api/contact-health",
	method: ["GET"],
};
