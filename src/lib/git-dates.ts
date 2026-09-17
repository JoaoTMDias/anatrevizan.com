import { execFileSync } from "node:child_process";

const cache = new Map<string, string | undefined>();

export function gitLastModified(relativePath: string): string | undefined {
	if (cache.has(relativePath)) return cache.get(relativePath);
	try {
		const value = execFileSync(
			"git",
			["log", "-1", "--format=%cI", "--", relativePath],
			{ encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
		).trim();
		const result =
			value && !Number.isNaN(Date.parse(value)) ? value : undefined;
		cache.set(relativePath, result);
		return result;
	} catch {
		cache.set(relativePath, undefined);
		return undefined;
	}
}
