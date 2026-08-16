import { describe, expect, it } from "vitest";
import { PluginDataStore } from "../src/storage/PluginDataStore";
import { SaltStore } from "../src/crypto/SaltStore";
import type { PluginDataShape } from "../src/storage/schema";

function fakeAccess() {
	let data: unknown;
	return {
		loadData: async () => data,
		saveData: async (next: unknown) => {
			data = next;
		},
	};
}

describe("SaltStore", () => {
	it("generates and persists a salt on first call", async () => {
		const access = fakeAccess();
		const store = new SaltStore(new PluginDataStore<PluginDataShape>(access));
		const salt = await store.getOrCreate();
		expect(salt).toHaveLength(16);

		const raw = (await access.loadData()) as PluginDataShape;
		expect(typeof raw.encryptionSalt).toBe("string");
	});

	it("returns the same salt on subsequent calls instead of regenerating it", async () => {
		const store = new SaltStore(new PluginDataStore<PluginDataShape>(fakeAccess()));
		const first = await store.getOrCreate();
		const second = await store.getOrCreate();
		expect(second).toEqual(first);
	});

	it("does not clobber other persisted keys (settings, dropboxAuth)", async () => {
		const access = fakeAccess();
		const dataStore = new PluginDataStore<PluginDataShape>(access);
		await dataStore.patch({
			settings: { language: "en", excludePatterns: [], remoteFolder: "", autoSyncEnabled: false },
		});

		await new SaltStore(dataStore).getOrCreate();

		const data = await dataStore.read();
		expect(data.settings).toEqual({
			language: "en",
			excludePatterns: [],
			remoteFolder: "",
			autoSyncEnabled: false,
		});
		expect(typeof data.encryptionSalt).toBe("string");
	});

	it("has() is false before any salt exists, and does not create one as a side effect", async () => {
		const access = fakeAccess();
		const store = new SaltStore(new PluginDataStore<PluginDataShape>(access));
		await expect(store.has()).resolves.toBe(false);
		expect(await access.loadData()).toBeUndefined();
	});

	it("has() is true after getOrCreate() or set()", async () => {
		const store = new SaltStore(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await store.getOrCreate();
		await expect(store.has()).resolves.toBe(true);
	});

	it("set() seeds a salt fetched elsewhere (link-to-existing-vault path)", async () => {
		const remoteSalt = new Uint8Array(16).fill(7);
		const store = new SaltStore(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await store.set(remoteSalt);
		await expect(store.getOrCreate()).resolves.toEqual(remoteSalt);
	});
});
