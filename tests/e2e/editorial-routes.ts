import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isLocaleComplete } from "../../src/lib/bilingual";
import { type RouteKey, routeMap } from "../../src/lib/routing";

const pagesDirectory = join(process.cwd(), "src/content/pages");
const pages = readdirSync(pagesDirectory)
	.filter((file) => file.endsWith(".json"))
	.map((file) =>
		JSON.parse(readFileSync(join(pagesDirectory, file), "utf8")),
	) as Array<{ routeKey: RouteKey } & Record<string, unknown>>;

export const publishedRoutes = pages.flatMap((page) => {
	const localized = routeMap[page.routeKey];
	return [
		{ locale: "pt-PT" as const, path: localized["pt-PT"] },
		...(isLocaleComplete(page, "en")
			? [{ locale: "en" as const, path: localized.en }]
			: []),
	];
});

export const unpublishedEnglishRoutes = pages.flatMap((page) =>
	isLocaleComplete(page, "en") ? [] : [routeMap[page.routeKey].en],
);
