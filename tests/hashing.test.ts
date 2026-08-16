import { describe, expect, it } from "vitest";
import { hashContent } from "../src/sync/hashing";

describe("hashContent", () => {
	it("matches the known SHA-256 vector for an empty string", async () => {
		await expect(hashContent("")).resolves.toBe(
			"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
		);
	});

	it("matches the known SHA-256 vector for 'abc'", async () => {
		await expect(hashContent("abc")).resolves.toBe(
			"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
		);
	});

	it("produces the same hash for equivalent string and ArrayBuffer input", async () => {
		const text = "ClearSync";
		const bytes = new TextEncoder().encode(text).buffer;
		await expect(hashContent(bytes)).resolves.toBe(await hashContent(text));
	});

	it("produces different hashes for different content", async () => {
		await expect(hashContent("a")).resolves.not.toBe(await hashContent("b"));
	});
});
