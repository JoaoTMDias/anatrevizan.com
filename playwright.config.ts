import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:4322",
		trace: "on-first-retry",
	},
	webServer: {
		// The local fallback adapter produces a standalone Node server. Use the
		// same launcher developers use after a local build.
		command: "pnpm build:preview && pnpm preview",
		url: "http://127.0.0.1:4322",
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
