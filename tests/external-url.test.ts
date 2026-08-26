import { describe, expect, it } from "vitest";
import { isExternalHref } from "../src/lib/external-url";

describe("isExternalHref", () => {
	it.each([
		"https://example.com/path",
		"http://example.com",
		"//cdn.example.com/asset",
	])("identifies an external web URL: %s", (href) => {
		expect(isExternalHref(href)).toBe(true);
	});

	it.each([
		"/contacto",
		"#main-content",
		"mailto:ana@example.com",
		undefined,
		null,
	])(
		"keeps non-web destinations in the current browsing context: %s",
		(href) => {
			expect(isExternalHref(href)).toBe(false);
		},
	);
});
