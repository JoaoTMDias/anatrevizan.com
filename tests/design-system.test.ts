import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readdirSync("src/styles")
	.filter((file) => file.endsWith(".css"))
	.map((file) => readFileSync(`src/styles/${file}`, "utf8"))
	.join("\n");
const baseLayout = readFileSync("src/layouts/Base.astro", "utf8");

describe("design-system guardrails", () => {
	it("ships the approved local fonts", () => {
		expect(css).toContain('@import "@fontsource/fira-sans/400.css"');
		expect(css).toContain('url("/fonts/playfair-display-variable.woff2")');
		expect(existsSync("public/fonts/playfair-display-variable.woff2")).toBe(
			true,
		);
	});

	it("defines the semantic brand tokens", () => {
		for (const token of [
			"--brand-burgundy",
			"--brand-wine",
			"--brand-terracotta-accessible",
			"--brand-ivory",
			"--brand-ink",
			"--background",
			"--foreground",
			"--primary",
			"--primary-foreground",
			"--accent",
			"--accent-foreground",
			"--muted-foreground",
			"--ring",
		])
			expect(css).toContain(`${token}:`);
	});

	it("retains operating-system accessibility fallbacks", () => {
		expect(css).toContain("@media (prefers-reduced-motion: reduce)");
		expect(css).toContain("@media (forced-colors: active)");
	});

	it("applies a saved or operating-system color theme before the document body", () => {
		expect(baseLayout).toContain("localStorage.getItem('theme')");
		expect(baseLayout).toContain("prefers-color-scheme: dark");
		expect(baseLayout.indexOf("localStorage.getItem('theme')")).toBeLessThan(
			baseLayout.indexOf("<BaseHead"),
		);
	});
});
