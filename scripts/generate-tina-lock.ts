import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const generated = resolve("tina/__generated__");
const readJson = async (name: string) =>
	JSON.parse(await readFile(resolve(generated, name), "utf8"));

const lock = {
	schema: await readJson("_schema.json"),
	lookup: await readJson("_lookup.json"),
	graphql: await readJson("_graphql.json"),
};

if (
	!Array.isArray(lock.schema.collections) ||
	!lock.lookup.Publication ||
	lock.graphql.kind !== "Document"
)
	throw new Error(
		"Generated Tina schema is incomplete; tina-lock.json was not changed",
	);

await writeFile(
	resolve("tina/tina-lock.json"),
	`${JSON.stringify(lock, null, "\t")}\n`,
	"utf8",
);
console.log(
	`Tina lock generated with ${lock.schema.collections.length} collections.`,
);
