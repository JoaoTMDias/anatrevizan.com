import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const mode = process.argv[2];
const expectedPublishedDocuments = 28;
assert(
	mode === "preview" || mode === "production",
	"Expected preview or production mode",
);

const manifest = JSON.parse(
	readFileSync(
		join(process.cwd(), "dist/editorial-build-manifest.json"),
		"utf8",
	),
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
assert.equal(manifest.totalDocuments, expectedPublishedDocuments);
assert.deepEqual(manifest.missingRoutes, []);
assert.equal(
	manifest.generatedEditorialRoutes,
	manifest.expectedEditorialRoutes,
);

if (mode === "preview") {
	assert.equal(manifest.expectedEditorialRoutes, expectedPublishedDocuments);
} else {
	assert.equal(manifest.publishableDocuments, expectedPublishedDocuments);
	assert.equal(manifest.expectedEditorialRoutes, expectedPublishedDocuments);
}
console.log(`Build output validation passed in ${mode} mode.`);
