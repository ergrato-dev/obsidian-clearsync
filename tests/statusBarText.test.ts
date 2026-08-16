import { describe, expect, it } from "vitest";
import { statusBarText } from "../src/sync/statusBarText";

describe("statusBarText", () => {
	it("formats every SyncState", () => {
		expect(statusBarText("idle")).toBe("ClearSync: idle");
		expect(statusBarText("syncing")).toBe("ClearSync: syncing…");
		expect(statusBarText("error")).toBe("ClearSync: error");
		expect(statusBarText("conflict")).toBe("ClearSync: conflict");
	});
});
