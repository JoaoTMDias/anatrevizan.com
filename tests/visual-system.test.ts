import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/global.css", "utf8");

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
