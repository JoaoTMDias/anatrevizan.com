import { describe, expect, it } from "vitest";
import { sanitizeSvg } from "../src/lib/media-pipeline.ts";

describe("pipeline de media", () => {
	it("remove scripts, eventos e URLs executáveis de SVG", () => {
		const unsafe =
			'<svg onload="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">x</a></svg>';
		const safe = sanitizeSvg(unsafe);
		expect(safe).not.toMatch(/script|onload|javascript:/i);
		expect(safe).toContain("<svg");
	});
});
