import type { APIRequestContext, Page, Request } from "@playwright/test";

/**
 * Options accepted by the Cloudflare Turnstile widget `render` method.
 */
export interface TurnstileRenderOptions {
	/**
	 * Callback function executed when Turnstile successfully validates a challenge.
	 */
	callback?: (token: string) => void;
	/**
	 * Callback function executed when Turnstile encounters an error.
	 */
	"error-callback"?: (errorCode?: string) => void;
	/**
	 * Callback function executed when a Turnstile token expires.
	 */
	"expired-callback"?: () => void;
	/**
	 * The site key provided for Turnstile verification.
	 */
	sitekey?: string;
	/**
	 * The theme configuration for the Turnstile widget.
	 */
	theme?: string;
	[key: string]: unknown;
}

/**
 * Interface representing the mock Cloudflare Turnstile API object injected into the browser window.
 */
export interface TurnstileMock {
	/**
	 * Renders the Turnstile widget and immediately triggers the validation callback.
	 */
	render: (
		container: HTMLElement,
		options: Record<string, unknown>,
	) => string;
	/**
	 * Resets the Turnstile widget state and re-issues a mock token.
	 */
	reset: (widgetId: string) => void;
	/**
	 * Removes the Turnstile widget instance and clears pending token issue callbacks.
	 */
	remove: (widgetId: string) => void;
}

declare global {
	interface Window {
		turnstile?: TurnstileMock;
	}
}

/**
 * Extracts location pathnames from raw sitemap XML content.
 *
 * @param xmlContent - The XML text string retrieved from `sitemap.xml`.
 * @returns An array of relative URL pathnames extracted from the `<loc>` tags.
 */
function extractPathnamesFromSitemapXml(xmlContent: string): string[] {
	const locationPattern = /<loc>(.*?)<\/loc>/g;
	const matches = Array.from(xmlContent.matchAll(locationPattern));
	const pathnames: string[] = [];

	for (const match of matches) {
		const rawLocationUrl = match[1];
		if (!rawLocationUrl) {
			continue;
		}

		// Unescape standard XML HTML entities in URLs
		const decodedLocationUrl = rawLocationUrl.replaceAll("&amp;", "&");

		try {
			const parsedUrl = new URL(decodedLocationUrl);
			pathnames.push(parsedUrl.pathname);
		} catch {
			// Fallback for relative paths or malformed location strings
			const fallbackPathname = decodedLocationUrl.startsWith("/")
				? decodedLocationUrl
				: `/${decodedLocationUrl}`;
			pathnames.push(fallbackPathname);
		}
	}

	return pathnames;
}

/**
 * Fetches and parses published route pathnames from `/sitemap.xml`.
 *
 * @param apiRequestContext - Playwright API request context used to perform HTTP requests.
 * @returns A promise resolving to an array of relative URL pathnames published in the sitemap.
 * @throws {Error} If the API request fails or returns a non-successful HTTP status code.
 */
export async function publishedPaths(
	apiRequestContext: APIRequestContext,
): Promise<string[]> {
	if (!apiRequestContext) {
		throw new Error("A valid Playwright APIRequestContext is required.");
	}

	const sitemapResponse = await apiRequestContext.get("/sitemap.xml");

	if (!sitemapResponse.ok()) {
		const statusCode = sitemapResponse.status();
		const statusText = sitemapResponse.statusText();
		throw new Error(
			`Failed to fetch sitemap.xml: server responded with HTTP status ${statusCode} (${statusText})`,
		);
	}

	const sitemapXmlContent = await sitemapResponse.text();

	if (!sitemapXmlContent || sitemapXmlContent.trim().length === 0) {
		return [];
	}

	return extractPathnamesFromSitemapXml(sitemapXmlContent);
}

/**
 * Installs a mock Cloudflare Turnstile implementation into the browser window context.
 *
 * Automatically fires the Turnstile completion callback with a dummy token (`"test-token"`)
 * upon `render` and `reset`, allowing E2E test suites to bypass CAPTCHA checks.
 *
 * @param page - Playwright Page instance to attach the init script to.
 */
export async function installFakeTurnstile(page: Page): Promise<void> {
	if (!page) {
		throw new Error("A valid Playwright Page instance is required.");
	}

	await page.addInitScript(() => {
		let activeIssueTokenCallback: (() => void) | undefined;

		const mockTurnstile: TurnstileMock = {
			render: (
				_container: HTMLElement,
				options: Record<string, unknown>,
			): string => {
				const completionCallback = options?.callback;

				activeIssueTokenCallback = () => {
					if (typeof completionCallback === "function") {
						completionCallback("test-token");
					}
				};

				activeIssueTokenCallback();
				return "test-widget";
			},
			reset: (_widgetId: string): void => {
				if (typeof activeIssueTokenCallback === "function") {
					activeIssueTokenCallback();
				}
			},
			remove: (_widgetId: string): void => {
				activeIssueTokenCallback = undefined;
			},
		};

		window.turnstile = mockTurnstile;
	});
}

/**
 * Helper to determine if a failed request originated from the current page's domain origin.
 */
function isSameOriginRequest(failedRequest: Request, currentContextUrl: string): boolean {
	try {
		const targetUrl = new URL(failedRequest.url());
		const currentOrigin = new URL(currentContextUrl).origin;
		return targetUrl.origin === currentOrigin;
	} catch {
		return false;
	}
}

/**
 * Attaches event listeners to record browser console errors, warnings, and failed network requests.
 *
 * @param page - Playwright Page instance to monitor for errors and warnings.
 * @returns An array that accumulates problem description strings as browser events occur.
 */
export function collectBrowserProblems(page: Page): string[] {
	if (!page) {
		throw new Error("A valid Playwright Page instance is required.");
	}

	const capturedProblems: string[] = [];

	page.on("console", (consoleMessage) => {
		const messageType = consoleMessage.type();

		if (messageType === "error" || messageType === "warning") {
			const messageText = consoleMessage.text();
			capturedProblems.push(`${messageType}: ${messageText}`);
		}
	});

	page.on("requestfailed", (failedRequest) => {
		const currentUrl = page.url();

		if (isSameOriginRequest(failedRequest, currentUrl)) {
			try {
				const requestPathname = new URL(failedRequest.url()).pathname;
				capturedProblems.push(`requestfailed: ${requestPathname}`);
			} catch {
				capturedProblems.push(`requestfailed: ${failedRequest.url()}`);
			}
		}
	});

	return capturedProblems;
}
