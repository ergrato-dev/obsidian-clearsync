import { describe, expect, it } from "vitest";
import { formatLogEntry } from "../src/sync/formatLogEntry";

describe("formatLogEntry", () => {
	it("marks a successful entry with a check", () => {
		const text = formatLogEntry({
			timestamp: Date.parse("2026-08-16T12:00:00Z"),
			path: "note.md",
			action: "uploaded",
			result: "ok",
		});
		expect(text).toContain("✓");
		expect(text).toContain("uploaded");
		expect(text).toContain("note.md");
	});

	it("marks a failed entry with a cross", () => {
		const text = formatLogEntry({
			timestamp: Date.now(),
			path: "note.md",
			action: "conflict",
			result: "error",
		});
		expect(text).toContain("✗");
	});
});
