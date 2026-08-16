import { describe, expect, it } from "vitest";
import { passwordsMatch } from "../src/setup/passwordConfirmation";

describe("passwordsMatch", () => {
	it("matches identical non-empty passwords", () => {
		expect(passwordsMatch("hunter2", "hunter2")).toBe(true);
	});

	it("rejects differing passwords", () => {
		expect(passwordsMatch("hunter2", "hunter3")).toBe(false);
	});

	it("rejects two empty strings — an empty password is never valid", () => {
		expect(passwordsMatch("", "")).toBe(false);
	});
});
