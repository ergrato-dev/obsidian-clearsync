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
		await dataStore.patch({ settings: { language: "en", excludePatterns: [] } });

		await new SaltStore(dataStore).getOrCreate();

		const data = await dataStore.read();
		expect(data.settings).toEqual({ language: "en", excludePatterns: [] });
		expect(typeof data.encryptionSalt).toBe("string");
	});
});
