import { readdir, readFile, writeFile } from "node:fs/promises";

const directories = [new URL("../src/content/pages/", import.meta.url), new URL("../src/content/config/", import.meta.url)];
for (const directory of directories) {
for (const file of await readdir(directory)) {
	if (!file.endsWith(".json")) continue;
	const path = new URL(file, directory);
	const value = JSON.parse(await readFile(path, "utf8"));
	const visit = (node) => {
		if (Array.isArray(node)) return node.map(visit);
		if (!node || typeof node !== "object") return node;
		const result = {};
		for (const [key, child] of Object.entries(node)) {
			if (key === "pt") result["pt-PT"] = visit(child);
			else result[key] = visit(child);
		}
		if (Object.hasOwn(result, "pt-PT"))
			result["pt-BR"] = structuredClone(result["pt-PT"]);
		return result;
	};
	await writeFile(path, `${JSON.stringify(visit(value), null, "\t")}\n`);
}
}
