import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { routeMap } from "../../src/lib/routing";
import {
	collectBrowserProblems,
	installFakeTurnstile,
	publishedPaths,
} from "./site";

const publishedEnglish = JSON.parse(
	readFileSync("src/content/published-en.json", "utf8"),
) as string[];

test.describe("visitor consumes published content", () => {
	test.beforeEach(async ({ page }) => installFakeTurnstile(page));
	test("sitemap is the complete, safe public route contract", async ({
		page,
		request,
	}) => {
		const paths = await publishedPaths(request);
		const ptPaths = paths.filter((path) => !path.startsWith("/en"));
		const enPaths = paths.filter((path) => path.startsWith("/en"));
		const problems = collectBrowserProblems(page);
		expect(new Set(paths).size).toBe(paths.length);
		expect(ptPaths).toHaveLength(14);
		expect(enPaths.sort()).toEqual(
			publishedEnglish
				.map((key) => routeMap[key as keyof typeof routeMap].en)
				.sort(),
		);

		for (const path of paths) {
			problems.length = 0;
			const response = await page.goto(path);
			expect(response?.ok(), path).toBe(true);
			await expect(page.locator("html")).toHaveAttribute(
				"lang",
				path.startsWith("/en") ? "en" : "pt-PT",
			);
			await expect(page.getByRole("main")).toHaveCount(1);
			await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
			await expect(page).toHaveTitle(/\S/);
			await expect(page.locator('meta[name="description"]')).toHaveAttribute(
				"content",
				/\S/,
			);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				`https://anatrevizan.com${path}`,
			);
			await expect(
				page.locator('link[rel="alternate"][hreflang="pt-PT"]'),
			).toHaveCount(1);
			await expect(
				page.locator('link[rel="alternate"][hreflang="en"]'),
			).toHaveCount(1);
			await expect(
				page.locator('link[rel="alternate"][hreflang="x-default"]'),
			).toHaveCount(1);
			const isLegal = [
				"/politica-de-privacidade",
				"/en/privacy-policy",
				"/declaracao-de-acessibilidade",
				"/en/accessibility-statement",
			].includes(path);
			await expect(
				page.locator('meta[property="article:modified_time"]'),
			).toHaveCount(isLegal ? 1 : 0);
			expect(await page.locator('a[href="#"]').count(), path).toBe(0);
			expect(problems, path).toEqual([]);
		}
	});

	test("same-origin assets referenced by the compiled DOM resolve", async ({
		page,
		request,
	}) => {
		const checked = new Set<string>();
		for (const path of await publishedPaths(request)) {
			await page.goto(path);
			const references = await page
				.locator(
					"img[src], source[src], source[srcset], script[src], link[href]",
				)
				.evaluateAll((elements) =>
					elements.flatMap((element) => {
						const raw =
							element.getAttribute("src") ??
							element.getAttribute("href") ??
							element.getAttribute("srcset") ??
							"";
						return raw
							.split(",")
							.map((candidate) => candidate.trim().split(/\s+/)[0]);
					}),
				);
			for (const reference of references) {
				if (!reference) continue;
				const url = new URL(reference, page.url());
				if (
					url.origin !== new URL(page.url()).origin ||
					checked.has(url.pathname)
				)
					continue;
				checked.add(url.pathname);
				const response = await request.get(url.pathname);
				expect(response.status(), `${path} -> ${reference}`).toBeLessThan(400);
			}
		}
	});

	test("internal links and fragments resolve; external links are safe", async ({
		page,
		request,
	}) => {
		for (const path of await publishedPaths(request)) {
			await page.goto(path);
			const sourceUrl = page.url();
			const links = await page.locator("a[href]").evaluateAll((anchors) =>
				anchors.map((anchor) => ({
					href: anchor.getAttribute("href") ?? "",
					target: anchor.getAttribute("target"),
					rel: anchor.getAttribute("rel") ?? "",
					accessibleName:
						anchor.getAttribute("aria-label") ?? anchor.textContent ?? "",
				})),
			);
			for (const link of links) {
				const url = new URL(link.href, sourceUrl);
				if (!["http:", "https:"].includes(url.protocol)) continue;
				if (url.origin !== new URL(sourceUrl).origin) {
					expect(url.protocol, link.href).toBe("https:");
					expect(link.target, link.href).toBe("_blank");
					expect(link.rel, link.href).toContain("noopener");
					expect(link.accessibleName, link.accessibleName).toMatch(
						path.startsWith("/en")
							? /opens in a new tab/i
							: /abre num novo separador/i,
					);
					continue;
				}
				const response = await request.get(url.pathname);
				expect(response.status(), `${path} -> ${link.href}`).toBeLessThan(400);
				if (url.hash) {
					await page.goto(`${url.pathname}${url.hash}`);
					await expect(page.locator(url.hash)).toHaveCount(1);
				}
			}
		}
	});

	test("unknown pages recover accessibly and are not indexed", async ({
		page,
	}) => {
		const response = await page.goto("/pagina-inexistente");
		expect(response?.status()).toBe(404);
		await expect(
			page.getByRole("heading", { name: "Página não encontrada" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Voltar ao início" }),
		).toHaveAttribute("href", "/");
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
			"content",
			"noindex,follow",
		);
	});

	test("robots advertises the sitemap and excludes admin", async ({
		request,
	}) => {
		const response = await request.get("/robots.txt");
		expect(response.ok()).toBe(true);
		const body = await response.text();
		expect(body).toContain("Disallow: /admin");
		expect(body).toContain("Sitemap: https://anatrevizan.com/sitemap.xml");
	});
});
