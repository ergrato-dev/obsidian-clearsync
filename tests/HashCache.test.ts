import { describe, expect, it } from "vitest";
import { PluginDataStore } from "../src/storage/PluginDataStore";
import { HashCache } from "../src/sync/HashCache";
import type { PluginDataShape } from "../src/storage/schema";
import type { HashCacheEntry } from "../src/sync/types";

function fakeAccess() {
	let data: unknown;
	return {
		loadData: async () => data,
		saveData: async (next: unknown) => {
			data = next;
		},
	};
}

const entryA: HashCacheEntry = { path: "a.md", baseHash: "hash-a", lastSyncedAt: 1000 };
const entryB: HashCacheEntry = { path: "b.md", baseHash: "hash-b", lastSyncedAt: 2000 };

describe("HashCache", () => {
	it("get() returns undefined for a path that was never cached", async () => {
		const cache = new HashCache(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await expect(cache.get("missing.md")).resolves.toBeUndefined();
	});

	it("all() returns {} when nothing was ever cached", async () => {
		const cache = new HashCache(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await expect(cache.all()).resolves.toEqual({});
	});

	it("round-trips an entry through set/get", async () => {
		const cache = new HashCache(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await cache.set(entryA);
		await expect(cache.get("a.md")).resolves.toEqual(entryA);
	});

	it("set() accumulates multiple entries instead of overwriting the whole cache", async () => {
		const cache = new HashCache(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await cache.set(entryA);
		await cache.set(entryB);
		await expect(cache.all()).resolves.toEqual({ "a.md": entryA, "b.md": entryB });
	});

	it("remove() deletes only the given path", async () => {
		const cache = new HashCache(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await cache.set(entryA);
		await cache.set(entryB);
		await cache.remove("a.md");
		await expect(cache.all()).resolves.toEqual({ "b.md": entryB });
	});

	it("remove() on a missing path is a no-op", async () => {
		const cache = new HashCache(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await cache.set(entryA);
		await cache.remove("missing.md");
		await expect(cache.all()).resolves.toEqual({ "a.md": entryA });
	});

	it("does not clobber other persisted keys (settings, dropboxAuth)", async () => {
		const access = fakeAccess();
		const dataStore = new PluginDataStore<PluginDataShape>(access);
		await dataStore.patch({
			settings: { language: "en", excludePatterns: [], remoteFolder: "", autoSyncEnabled: false },
		});

		const cache = new HashCache(dataStore);
		await cache.set(entryA);

		const data = await dataStore.read();
		expect(data.settings).toEqual({
			language: "en",
			excludePatterns: [],
			remoteFolder: "",
			autoSyncEnabled: false,
		});
		expect(data.hashCache).toEqual({ "a.md": entryA });
	});
});
