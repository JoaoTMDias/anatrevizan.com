import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const script = join(process.cwd(), "scripts/sync-orcid.ts");

const runWithoutCredentials = (mode: "build" | "strict") => {
	const directory = mkdtempSync(join(tmpdir(), "orcid-sync-mode-"));
	const snapshot = join(directory, "src/content/publications");
	mkdirSync(snapshot, { recursive: true });
	const seed = join(snapshot, "snapshot.md");
	writeFileSync(seed, "preserved", "utf8");
	const env = { ...process.env };
	delete env.ORCID_CLIENT_ID;
	delete env.ORCID_CLIENT_SECRET;
	const result = spawnSync(
		process.execPath,
		["--experimental-strip-types", script, `--mode=${mode}`],
		{ cwd: directory, env, encoding: "utf8" },
	);
	return { result, seed };
};

describe("ORCID synchronization modes", () => {
	it("build mode keeps the committed snapshot and succeeds without credentials", () => {
		const { result, seed } = runWithoutCredentials("build");
		expect(result.status).toBe(0);
		expect(result.stderr).toContain("using committed Markdown snapshot");
		expect(readFileSync(seed, "utf8")).toBe("preserved");
	});

	it("strict mode fails without credentials and does not alter files", () => {
		const { result, seed } = runWithoutCredentials("strict");
		expect(result.status).toBe(1);
		expect(result.stderr).toContain(
			"ORCID_CLIENT_ID and ORCID_CLIENT_SECRET are required",
		);
		expect(readFileSync(seed, "utf8")).toBe("preserved");
	});
});
