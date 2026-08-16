import { describe, expect, it } from "vitest";
import { PluginDataStore } from "../src/storage/PluginDataStore";

interface Shape extends Record<string, unknown> {
	a?: string;
	b?: number;
}

function fakeAccess() {
	let data: unknown;
	return {
		loadData: async () => data,
		saveData: async (next: unknown) => {
			data = next;
		},
	};
}

describe("PluginDataStore", () => {
	it("read() returns {} when nothing was ever saved", async () => {
		const store = new PluginDataStore<Shape>(fakeAccess());
		await expect(store.read()).resolves.toEqual({});
	});

	it("patch() merges instead of overwriting other top-level keys", async () => {
		const store = new PluginDataStore<Shape>(fakeAccess());
		await store.patch({ a: "x" });
		await store.patch({ b: 1 });
		await expect(store.read()).resolves.toEqual({ a: "x", b: 1 });
	});

	it("patch() with undefined clears a key on the next read", async () => {
		const store = new PluginDataStore<Shape>(fakeAccess());
		await store.patch({ a: "x", b: 1 });
		await store.patch({ a: undefined });
		await expect(store.read()).resolves.toEqual({ a: undefined, b: 1 });
	});
});
