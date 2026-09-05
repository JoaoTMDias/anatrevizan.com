import type { APIRequestContext, Page } from "@playwright/test";

export async function publishedPaths(request: APIRequestContext) {
	const response = await request.get("/sitemap.xml");
	if (!response.ok()) throw new Error(`sitemap returned ${response.status()}`);
	const xml = await response.text();
	return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
		([, href]) => new URL(href.replaceAll("&amp;", "&")).pathname,
	);
}

export async function installFakeTurnstile(page: Page) {
	await page.addInitScript(() => {
		window.turnstile = {
			render: (_container: HTMLElement, options: Record<string, unknown>) => {
				(options.callback as (token: string) => void)("test-token");
				return "test-widget";
			},
			reset: () => undefined,
			remove: () => undefined,
		};
	});
}

export function collectBrowserProblems(page: Page) {
	const problems: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			problems.push(`${message.type()}: ${message.text()}`);
	});
	page.on("requestfailed", (request) => {
		const url = new URL(request.url());
		if (url.origin === new URL(page.url()).origin)
			problems.push(`requestfailed: ${url.pathname}`);
	});
	return problems;
}
