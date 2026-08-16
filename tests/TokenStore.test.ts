import { describe, expect, it } from "vitest";
import { PluginDataStore } from "../src/storage/PluginDataStore";
import { TokenStore } from "../src/auth/TokenStore";
import type { PluginDataShape } from "../src/storage/schema";
import type { DropboxTokens } from "../src/auth/DropboxTokens";

function fakeAccess() {
	let data: unknown;
	return {
		loadData: async () => data,
		saveData: async (next: unknown) => {
			data = next;
		},
	};
}

const sampleTokens: DropboxTokens = {
	accessToken: "at",
	refreshToken: "rt",
	expiresAt: Date.now() + 1000,
	accountEmail: "user@example.com",
};

describe("TokenStore", () => {
	it("returns undefined when nothing was ever stored", async () => {
		const store = new TokenStore(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await expect(store.get()).resolves.toBeUndefined();
	});

	it("round-trips tokens through set/get", async () => {
		const store = new TokenStore(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await store.set(sampleTokens);
		await expect(store.get()).resolves.toEqual(sampleTokens);
	});

	it("clear() removes tokens (RN-003) without touching other persisted keys", async () => {
		const access = fakeAccess();
		const dataStore = new PluginDataStore<PluginDataShape>(access);
		await dataStore.patch({
			settings: { language: "en", excludePatterns: [], remoteFolder: "", autoSyncEnabled: false },
		});

		const store = new TokenStore(dataStore);
		await store.set(sampleTokens);
		await store.clear();

		await expect(store.get()).resolves.toBeUndefined();
		const remaining = await dataStore.read();
		expect(remaining.settings).toEqual({
			language: "en",
			excludePatterns: [],
			remoteFolder: "",
			autoSyncEnabled: false,
		});
	});
});
