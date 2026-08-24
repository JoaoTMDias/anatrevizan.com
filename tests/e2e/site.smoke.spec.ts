import { expect, test } from "@playwright/test";

const routes = [
	{
		path: "/sobre",
		canonical: "https://anatrevizan.com/sobre",
		language: "pt-PT",
	},
	{
		path: "/en/about",
		canonical: "https://anatrevizan.com/en/about",
		language: "en",
	},
] as const;

test.describe("localized draft pages", () => {
	for (const route of routes) {
		test(`${route.language} route has safe metadata and no browser errors`, async ({
			page,
		}) => {
			const consoleErrors: string[] = [];
			page.on("console", (message) => {
				if (message.type() === "error") consoleErrors.push(message.text());
			});

			await page.goto(route.path);
			await expect(page).toHaveTitle(/.+/);
			expect(
				await page.locator('link[rel="canonical"]').getAttribute("href"),
			).toBe(route.canonical);
			expect(
				await page.locator('meta[name="robots"]').getAttribute("content"),
			).toBe("noindex,nofollow");
			expect(await page.locator('link[hreflang="x-default"]').count()).toBe(0);
			expect(consoleErrors).toEqual([]);
		});
	}

	test("draft pages do not advertise an unavailable language switch", async ({
		page,
	}) => {
		await page.goto("/sobre");
		expect(
			await page
				.getByRole("link", { name: /switch to english|english/i })
				.count(),
		).toBe(0);
	});

	test("consulting and academic menus are keyboard accessible", async ({
		page,
	}) => {
		await page.goto("/sobre");
		for (const label of ["Consultoria", "Academia"]) {
			const menu = page.locator("details.nav-menu").filter({ hasText: label });
			const summary = menu.locator("summary");
			await summary.focus();
			expect(
				await summary.evaluate((element) => document.activeElement === element),
			).toBe(true);
			await page.keyboard.press("Enter");
			await expect(menu.locator("a").first()).toBeVisible();
			await page.keyboard.press("Escape");
			expect(await menu.getAttribute("open")).toBe(null);
		}
	});
});
