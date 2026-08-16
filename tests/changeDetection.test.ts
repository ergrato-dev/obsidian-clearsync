import { describe, expect, it } from "vitest";
import { classifyChange } from "../src/sync/changeDetection";

const H1 = "hash-1";
const H2 = "hash-2";
const H3 = "hash-3";

describe("classifyChange", () => {
	it("unchanged: local and remote both still match the base", () => {
		expect(classifyChange({ localHash: H1, remoteHash: H1, baseHash: H1 })).toBe("unchanged");
	});

	it("unchanged: nothing has ever existed on either side", () => {
		expect(
			classifyChange({ localHash: undefined, remoteHash: undefined, baseHash: undefined }),
		).toBe("unchanged");
	});

	it("upload: local changed, remote still matches base", () => {
		expect(classifyChange({ localHash: H2, remoteHash: H1, baseHash: H1 })).toBe("upload");
	});

	it("upload: brand new local file, nothing remote yet", () => {
		expect(classifyChange({ localHash: H1, remoteHash: undefined, baseHash: undefined })).toBe(
			"upload",
		);
	});

	it("download: remote changed, local still matches base", () => {
		expect(classifyChange({ localHash: H1, remoteHash: H2, baseHash: H1 })).toBe("download");
	});

	it("download: brand new remote file, nothing local yet", () => {
		expect(classifyChange({ localHash: undefined, remoteHash: H1, baseHash: undefined })).toBe(
			"download",
		);
	});

	it("conflict: both sides changed to different content since the base", () => {
		expect(classifyChange({ localHash: H2, remoteHash: H3, baseHash: H1 })).toBe("conflict");
	});

	it("conflict: created independently on both sides with different content", () => {
		expect(classifyChange({ localHash: H1, remoteHash: H2, baseHash: undefined })).toBe("conflict");
	});

	it("unchanged: created independently on both sides with identical content", () => {
		expect(classifyChange({ localHash: H1, remoteHash: H1, baseHash: undefined })).toBe(
			"unchanged",
		);
	});
});
