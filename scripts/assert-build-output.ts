import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const mode = process.argv[2];
assert(
	mode === "preview" || mode === "production",
	"Expected preview or production mode",
);

const outputDirectory = join(process.cwd(), "dist/client");
const draftPage = join(outputDirectory, "sobre/index.html");
const sitemap = readFileSync(join(outputDirectory, "sitemap.xml"), "utf8");
const manifest = JSON.parse(
	readFileSync(join(process.cwd(), "dist/editorial-build-manifest.json"), "utf8"),
) as {
	mode: string;
	totalDocuments: number;
	publishableDocuments: number;
	excludedDrafts: number;
	expectedEditorialRoutes: number;
	generatedEditorialRoutes: number;
	missingRoutes: string[];
};

assert.equal(manifest.mode, mode);
assert.equal(manifest.totalDocuments, 38);
assert.deepEqual(manifest.missingRoutes, []);
assert.equal(manifest.generatedEditorialRoutes, manifest.expectedEditorialRoutes);

if (mode === "preview") {
	assert.equal(manifest.expectedEditorialRoutes, 38);
	assert(
		existsSync(draftPage),
		"Preview build must include the draft /sobre page",
	);
	assert(
		readFileSync(draftPage, "utf8").includes(
			'meta name="robots" content="noindex,nofollow"',
		),
		"Preview draft page must be noindex,nofollow",
	);
} else {
	assert.equal(manifest.publishableDocuments, 0);
	assert.equal(manifest.expectedEditorialRoutes, 0);
	assert(
		!existsSync(draftPage),
		"Production build must exclude the draft /sobre page",
	);
}

assert(
	!sitemap.includes("/sobre"),
	`${mode} sitemap must exclude the draft /sobre page`,
);
console.log(`Build output validation passed in ${mode} mode.`);
