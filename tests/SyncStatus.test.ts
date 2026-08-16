import { describe, expect, it } from "vitest";
import { SyncStatus } from "../src/sync/SyncStatus";

describe("SyncStatus", () => {
	it("starts idle", () => {
		expect(new SyncStatus().current).toBe("idle");
	});

	it("set() updates current and notifies listeners", () => {
		const status = new SyncStatus();
		const seen: string[] = [];
		status.subscribe((state) => seen.push(state));
		status.set("syncing");
		status.set("error");
		expect(status.current).toBe("error");
		expect(seen).toEqual(["idle", "syncing", "error"]);
	});

	it("subscribe() fires immediately with the current state", () => {
		const status = new SyncStatus();
		status.set("conflict");
		const seen: string[] = [];
		status.subscribe((state) => seen.push(state));
		expect(seen).toEqual(["conflict"]);
	});

	it("unsubscribe stops further notifications", () => {
		const status = new SyncStatus();
		const seen: string[] = [];
		const unsubscribe = status.subscribe((state) => seen.push(state));
		unsubscribe();
		status.set("syncing");
		expect(seen).toEqual(["idle"]);
	});
});
