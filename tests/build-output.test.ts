import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createEditorialBuildReport } from "../scripts/report-build-output.ts";

const temporaryDirectories: string[] = [];

function fixture() {
	const root = mkdtempSync(join(tmpdir(), "editorial-build-report-"));
	temporaryDirectories.push(root);
	const directory = join(root, "src/content/pages");
	mkdirSync(directory, { recursive: true });
	writeFileSync(
		join(directory, "home.json"),
		JSON.stringify({
			routeKey: "home",
			title: { pt: "Início", en: "Home" },
			summary: { pt: "Resumo", en: "Summary" },
			seo: {
				title: { pt: "Início", en: "Home" },
				description: { pt: "Resumo", en: "Summary" },
			},
		}),
	);
	for (const output of [
		"dist/client/index.html",
		"dist/client/en/index.html",
	]) {
		mkdirSync(dirname(join(root, output)), { recursive: true });
		writeFileSync(join(root, output), "<!doctype html><title>Home</title>");
	}
	return root;
}

afterEach(() => {
	for (const directory of temporaryDirectories.splice(0))
		rmSync(directory, { recursive: true, force: true });
});

describe("editorial build report", () => {
	it("records every generated preview route", () => {
		const root = fixture();
		createEditorialBuildReport(root, "preview");
		const manifest = JSON.parse(
			readFileSync(join(root, "dist/editorial-build-manifest.json"), "utf8"),
		);
		expect(manifest).toMatchObject({
			mode: "preview",
			totalDocuments: 2,
			generatedEditorialRoutes: 2,
			missingRoutes: [],
		});
	});

	it("rejects a production build with no publishable homepage", () => {
		const root = fixture();
		rmSync(join(root, "src/content/pages/home.json"));
		expect(() => createEditorialBuildReport(root, "production")).toThrow(
			"Production build has no publishable editorial documents",
		);
	});

	it("reports duplicate metadata without rejecting the build", () => {
		const root = fixture();
		writeFileSync(
			join(root, "src/content/pages/legal.json"),
			JSON.stringify({
				routeKey: "legal",
				title: { pt: "Início", en: "Home" },
				summary: { pt: "Resumo", en: "Summary" },
				seo: {
					title: { pt: "Início", en: "Home" },
					description: { pt: "Resumo", en: "Summary" },
				},
			}),
		);
		for (const output of [
			"dist/client/consultoria/juridica/index.html",
			"dist/client/en/consulting/legal/index.html",
		]) {
			mkdirSync(dirname(join(root, output)), { recursive: true });
			writeFileSync(join(root, output), "<!doctype html><title>Legal</title>");
		}
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
		const report = createEditorialBuildReport(root, "preview");
		expect(report.duplicateMetadata).toHaveLength(4);
		expect(warn).toHaveBeenCalledTimes(4);
	});
});
