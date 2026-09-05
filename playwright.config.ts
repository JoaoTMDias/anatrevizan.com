import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseUrl ?? "http://127.0.0.1:4322";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	timeout: 180_000,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: process.env.CI
		? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
		: "list",
	use: {
		baseURL,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "off",
	},
	webServer: externalBaseUrl
		? undefined
		: {
				// The local fallback adapter produces a standalone Node server. Use the
				// same launcher developers use after a local build. CI has already built
				// the preview in the preceding workflow step.
				command: process.env.CI
					? "pnpm preview"
					: "cross-env SITE_URL=https://anatrevizan.com pnpm build:local && pnpm preview",
				url: baseURL,
				reuseExistingServer: !process.env.CI,
				timeout: 180_000,
				env: {
					...process.env,
					PUBLIC_TURNSTILE_SITE_KEY:
						process.env.PUBLIC_TURNSTILE_SITE_KEY ?? "test-site-key",
				},
			},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	workers: 2,
});
