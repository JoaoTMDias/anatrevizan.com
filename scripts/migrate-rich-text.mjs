import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const directory = new URL("../src/content/pages/", import.meta.url);
const markdown = (paragraphs, locale) =>
	(paragraphs ?? [])
		.map((paragraph) => paragraph?.[locale])
		.filter((text) => typeof text === "string" && text !== "")
		.join("\n\n");
const localizedRichText = (paragraphs) => ({
	pt: markdown(paragraphs, "pt"),
	en: markdown(paragraphs, "en"),
});
const textFromRoot = (root) =>
	(root?.children ?? [])
		.map((node) =>
			(node?.children ?? [])
				.map((child) => (typeof child?.text === "string" ? child.text : ""))
				.join(""),
		)
		.filter(Boolean)
		.join("\n\n");
const migrate = (parent, key) => {
	if (Array.isArray(parent?.[key])) parent[key] = localizedRichText(parent[key]);
	else if (parent?.[key]?.pt?.type === "root")
		parent[key] = {
			pt: textFromRoot(parent[key].pt),
			en: textFromRoot(parent[key].en),
		};
};

for (const file of (await readdir(directory)).filter((name) => name.endsWith(".json"))) {
	const path = join(directory.pathname, file);
	const document = JSON.parse(await readFile(path, "utf8"));
	switch (document._template) {
		case "about":
			migrate(document.about, "narrative");
			break;
		case "consultingService":
			migrate(document.consultingService, "introParagraphs");
			migrate(document.consultingService, "differentiatorParagraphs");
			break;
		case "academicService":
			migrate(document.academicService, "introParagraphs");
			break;
		case "events":
			migrate(document.speakingPage, "bioParagraphs");
			break;
		case "privacy":
		case "terms":
		case "cookies": {
			const page = document[`${document._template}Page`];
			for (const section of page?.sections ?? []) migrate(section, "paragraphs");
			break;
		}
	}
	await writeFile(path, `${JSON.stringify(document, null, 2)}\n`);
}
