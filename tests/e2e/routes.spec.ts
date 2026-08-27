import { expect, test } from "@playwright/test";
import {
	publishedRoutes,
	unpublishedEnglishRoutes,
} from "./editorial-routes";

test.describe("editorial routes", () => {
	for (const route of publishedRoutes) {
		test(`${route.locale} ${route.path || "/"} renders safely`, async ({
			page,
		}) => {
			const consoleErrors: string[] = [];
			page.on("console", (message) => {
				if (message.type() === "error") consoleErrors.push(message.text());
			});

			const response = await page.goto(route.path);
			expect(response?.ok()).toBe(true);
			await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
			await expect(page.locator("main")).toHaveCount(1);
			await expect(page.locator("main h1")).toHaveCount(1);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				`https://anatrevizan.com${route.path}`,
			);
			expect(await page.locator('a[href="#"]').count()).toBe(0);
			expect(consoleErrors).toEqual([]);
		});
	}

	test("incomplete English translations stay out of the public build", async ({
		request,
	}) => {
		for (const path of unpublishedEnglishRoutes)
			expect((await request.get(path)).status()).toBe(404);
	});
});
