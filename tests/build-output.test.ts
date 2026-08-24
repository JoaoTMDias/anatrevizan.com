import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createEditorialBuildReport } from "../scripts/report-build-output.ts";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
	scripts: Record<string, string>;
};
const playwrightConfig = readFileSync("playwright.config.ts", "utf8");

const temporaryDirectories: string[] = [];

function fixture() {
	const root = mkdtempSync(join(tmpdir(), "editorial-build-report-"));
	temporaryDirectories.push(root);
	for (const locale of ["pt-PT", "en"]) {
		const directory = join(root, "src/content/editorial", locale);
		mkdirSync(directory, { recursive: true });
		writeFileSync(
			join(directory, "home.json"),
			JSON.stringify({
				translationGroup: "home",
				locale,
				routeKey: "home",
				slug: "",
				status: "draft",
				approvalPending: true,
				title: "Home",
				seoTitle: "Home",
				seoDescription: "Home",
			}),
		);
	}
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
		expect(() => createEditorialBuildReport(fixture(), "production")).toThrow(
			"Production build has no publishable editorial documents",
		);
	});
});

describe("local editorial preview", () => {
	it("serves the standalone Node build through the shared preview command", () => {
		expect(packageJson.scripts.preview).toBe(
			"cross-env HOST=127.0.0.1 PORT=4322 node dist/server/entry.mjs",
		);
		expect(packageJson.scripts["preview:editorial"]).toBe(
			"pnpm build:preview && pnpm preview",
		);
		expect(playwrightConfig).toContain(
			'command: "pnpm build:preview && pnpm preview"',
		);
		expect(playwrightConfig).toContain(
			'baseURL: "http://127.0.0.1:4322"',
		);
	});
});
