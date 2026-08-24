import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:4321",
		trace: "on-first-retry",
	},
	webServer: {
		// The local fallback adapter produces a standalone Node server. Running
		// that entrypoint keeps the parent process alive for Playwright, unlike
		// Astro's daemonized preview command in the Codex/IDE environment.
		command:
			"pnpm build:preview && HOST=127.0.0.1 PORT=4321 node dist/server/entry.mjs",
		url: "http://127.0.0.1:4321",
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
