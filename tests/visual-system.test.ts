import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/global.css", "utf8");
const pageHero = readFileSync(
	"src/components/editorial/PageHero.astro",
	"utf8",
);
const contactCta = readFileSync(
	"src/components/editorial/ContactCta.astro",
	"utf8",
);
const emptyState = readFileSync(
	"src/components/editorial/EmptyState.astro",
	"utf8",
);

describe("Phase 3 visual foundation", () => {
	it("defines the approved typography and core palette", () => {
		expect(css).toContain('@import "@fontsource-variable/playfair-display"');
		expect(css).toContain("--font-heading:");
		expect(css).toContain("--primary: oklch(0.4 0.13 18)");
		expect(css).toContain("--accent: oklch(0.45 0.14 140)");
	});

	it("provides constrained containers and explicit user preference rules", () => {
		expect(css).toContain("max-width: 80rem");
		expect(css).toContain("@media (prefers-reduced-motion: reduce)");
		expect(css).toContain("@media (forced-colors: active)");
	});
});

describe("Phase 3 shared editorial structures", () => {
	it("provides static localized heroes with semantic breadcrumbs", () => {
		expect(pageHero).toContain("<Breadcrumbs items={items} />");
		expect(pageHero).toContain("<h1>{title}</h1>");
		expect(pageHero).not.toContain("<video");
	});

	it("provides shared conversion and empty states without fake links", () => {
		expect(contactCta).toContain("pathFor('booking', locale)");
		expect(contactCta).toContain("pathFor('contact', locale)");
		expect(emptyState).toContain("href && linkLabel");
		expect(`${contactCta}${emptyState}`).not.toContain('href="#"');
	});

	it("uses fluid heroes and auto-fitting grids for narrow viewports", () => {
		expect(css).toContain("min-height: clamp(24rem, 58vw, 35rem)");
		expect(css).toContain(
			"grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr))",
		);
	});
});
