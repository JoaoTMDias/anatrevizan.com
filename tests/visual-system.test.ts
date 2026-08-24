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
const card = readFileSync("src/components/ui/Card.astro", "utf8");
const consultingService = readFileSync(
	"src/components/editorial/ConsultingServicePage.astro",
	"utf8",
);

describe("Phase 3 visual foundation", () => {
	it("defines the approved typography and core palette", () => {
		expect(css).toContain('@import "@fontsource-variable/playfair-display"');
		expect(css).toContain("--font-heading:");
		expect(css).toContain("--primary: oklch(0.4 0.13 18)");
		expect(css).toContain("--accent: oklch(0.45 0.14 140)");
	});

	it("exposes every 50–950 reference color scale", () => {
		for (const family of [
			"primary",
			"accent",
			"secondary",
			"background",
			"foreground",
		]) {
			for (const shade of [
				50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
			]) {
				expect(css).toContain(`--${family}-${shade}:`);
				expect(css).toContain(`--color-${family}-${shade}:`);
			}
		}
	});

	it("provides constrained containers and explicit user preference rules", () => {
		expect(css).toContain("max-width: 80rem");
		expect(css).toContain("@media (prefers-reduced-motion: reduce)");
		expect(css).toContain("@media (forced-colors: active)");
	});
});

describe("Phase 3 consulting visual family", () => {
	it("reserves the approved accent treatment for Environmental and ESG", () => {
		expect(consultingService).toContain(
			"const accent = data.routeKey === 'environmental-esg'",
		);
		expect(consultingService).toContain("tone={accent ? 'accent' : 'primary'}");
		expect(css).toContain(".editorial-hero--accent");
		expect(css).toContain(".consulting-card--accent");
	});

	it("provides explicit filter selection and responsive process steps", () => {
		expect(css).toContain('.consulting-filters [aria-pressed="true"]');
		expect(css).toContain(".consulting-steps");
		expect(css).toContain(
			"grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr))",
		);
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

	it("preserves article semantics for independent editorial cards", () => {
		expect(card).toContain("as?: 'article' | 'div'");
		expect(card).toContain("<Tag class=");
	});

	it("uses fluid heroes and auto-fitting grids for narrow viewports", () => {
		expect(css).toContain("min-height: clamp(24rem, 58vw, 35rem)");
		expect(css).toContain(
			"grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr))",
		);
	});
});
