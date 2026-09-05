import assert from "node:assert/strict";
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
	type EditorialDocument,
	isPublishable,
	shouldRenderEditorialDocument,
} from "../src/lib/editorial.ts";
import { isLocaleComplete, localizeValue } from "../src/lib/bilingual.ts";
import {
	publishedLocales,
	type PublishedLocale,
	pathFor,
} from "../src/lib/routing.ts";

export type BuildReportMode = "preview" | "production";

export function createEditorialBuildReport(
	root: string,
	mode: BuildReportMode,
	allowEmptyProduction = false,
) {
	const contentDirectory = join(root, "src/content/pages");
	const outputDirectory = join(root, "dist/client");
	const sourceFiles = readdirSync(contentDirectory, { recursive: true }).filter(
		(file): file is string =>
			typeof file === "string" && file.endsWith(".json"),
	);
	const documents = sourceFiles.map((file) =>
		JSON.parse(readFileSync(join(contentDirectory, file), "utf8")),
	);
	const localizedDocuments = documents.flatMap((document) =>
		publishedLocales.flatMap((locale) => {
			const localized = localizeValue(document, locale) as {
				title?: string;
				summary?: string;
				seo?: { title?: string; description?: string };
			};
			return [
				{
					routeKey: document.routeKey,
					locale,
					title: localized.title ?? "",
					seoTitle: localized.seo?.title || localized.title || "",
					seoDescription: localized.seo?.description || localized.summary || "",
					complete: isLocaleComplete(document, locale),
				} as EditorialDocument,
			];
		}),
	);
	const publishable = localizedDocuments.filter(isPublishable);
	const expected = localizedDocuments.filter((document) =>
		shouldRenderEditorialDocument(document, mode === "preview"),
	);
	const excludedDrafts = localizedDocuments.filter(
		(document) => !isPublishable(document),
	).length;
	const duplicateMetadata = ["seoTitle", "seoDescription"].flatMap((field) => {
		const seen = new Map<string, string>();
		return publishable.flatMap((document) => {
			const value = document[field as "seoTitle" | "seoDescription"].trim();
			if (!value) return [];
			const key = `${document.locale}:${value}`;
			const previous = seen.get(key);
			seen.set(key, document.routeKey);
			return previous
				? [
						{
							field,
							locale: document.locale,
							routes: [previous, document.routeKey],
						},
					]
				: [];
		});
	});

	const outputFor = (
		document: EditorialDocument & { locale: PublishedLocale },
	) => {
		const route = pathFor(document.routeKey, document.locale);
		return route === "/"
			? join(outputDirectory, "index.html")
			: join(outputDirectory, route.slice(1), "index.html");
	};
	const generated = expected.filter((document) => {
		const output = outputFor(document);
		return existsSync(output) && readFileSync(output, "utf8").trim().length > 0;
	});

	const manifest = {
		mode,
		totalDocuments: localizedDocuments.length,
		publishableDocuments: publishable.length,
		excludedDrafts,
		expectedEditorialRoutes: expected.length,
		generatedEditorialRoutes: generated.length,
		missingRoutes: expected
			.filter((document) => !generated.includes(document))
			.map((document) => pathFor(document.routeKey, document.locale)),
		duplicateMetadata,
	};
	const manifestPath = join(root, "dist/editorial-build-manifest.json");
	mkdirSync(dirname(manifestPath), { recursive: true });
	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

	console.log(`Editorial build mode: ${mode}`);
	console.log(
		`Publishable documents: ${publishable.length}/${localizedDocuments.length}`,
	);
	console.log(`Excluded drafts: ${excludedDrafts}`);
	for (const duplicate of duplicateMetadata) {
		console.warn(
			`Duplicate ${duplicate.field} (${duplicate.locale}): ${duplicate.routes.join(", ")}`,
		);
	}
	console.log(
		`Generated editorial routes: ${generated.length}/${expected.length}`,
	);

	assert.deepEqual(
		manifest.missingRoutes,
		[],
		`Missing or empty editorial outputs: ${manifest.missingRoutes.join(", ")}`,
	);

	if (mode === "production" && !allowEmptyProduction) {
		assert(
			publishable.length > 0,
			"Production build has no publishable editorial documents.",
		);
		const home = publishable.find(
			(document) => document.routeKey === "home" && document.locale === "pt-PT",
		);
		assert(home, "The Portuguese production homepage is not publishable.");
		assert(
			readFileSync(outputFor(home), "utf8").trim().length > 0,
			"The production homepage output is empty.",
		);
	}

	if (
		mode === "production" &&
		allowEmptyProduction &&
		publishable.length === 0
	) {
		console.warn(
			"Production guard bypassed by the publishing-mode test harness.",
		);
	}

	console.log(`Editorial build manifest: ${manifestPath}`);
	return manifest;
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	const mode = process.argv[2];
	assert(
		mode === "preview" || mode === "production",
		"Expected preview or production mode",
	);
	createEditorialBuildReport(
		process.cwd(),
		mode,
		process.argv.includes("--allow-empty-production"),
	);
}
