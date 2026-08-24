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

	test("Portuguese Home renders the complete dedicated template", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			/Transformo complexidade jurídica/,
		);
		for (const heading of [
			"Por que a Dra. Ana Trevizan?",
			"Áreas de Consultoria",
			"Credenciais e vínculos",
			"Marque uma conversa inicial",
		])
			await expect(
				page.getByRole("heading", { name: heading, exact: true }),
			).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Academia", exact: true }),
		).toHaveCount(2);
		expect(await page.locator('a[href="#"]').count()).toBe(0);
		expect(await page.locator("h1").count()).toBe(1);
	});

	test("Portuguese About renders ordered editorial sections", async ({
		page,
	}) => {
		await page.goto("/sobre");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Dra. Ana Flávia Trevizan",
		);
		for (const heading of [
			"Marcos do percurso",
			"Onde atuo hoje",
			"O que orienta o meu trabalho",
			"Redes e vínculos de investigação",
			"Falamos?",
		])
			await expect(
				page.getByRole("heading", { name: heading, exact: true }),
			).toBeVisible();
		expect(await page.locator("h1").count()).toBe(1);
		expect(await page.locator('a[href="#"]').count()).toBe(0);
	});

	test("English previews never expose the copied Portuguese page content", async ({
		page,
	}) => {
		for (const route of ["/en", "/en/about"]) {
			await page.goto(route);
			await expect(
				page.getByText(
					"This draft has not been translated or approved for publication.",
				),
			).toBeVisible();
			await expect(
				page.getByText(/Transformo complexidade jurídica|Marcos do percurso/),
			).toHaveCount(0);
		}
	});

	for (const viewport of [
		{ width: 320, height: 800 },
		{ width: 1280, height: 800 },
	]) {
		test(`Home has no horizontal overflow at ${viewport.width}px`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport);
			await page.goto("/");
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth <=
						document.documentElement.clientWidth,
				),
			).toBe(true);
		});
	}

	test("Home reflows at the 320 CSS px equivalent of 400% zoom", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await page.goto("/");
		expect(
			await page.evaluate(
				() =>
					document.documentElement.scrollWidth <=
					document.documentElement.clientWidth,
			),
		).toBe(true);
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});
});
