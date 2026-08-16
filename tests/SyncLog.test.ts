import { describe, expect, it } from "vitest";
import { PluginDataStore } from "../src/storage/PluginDataStore";
import { SyncLog, MAX_LOG_ENTRIES } from "../src/sync/SyncLog";
import type { PluginDataShape } from "../src/storage/schema";
import type { SyncLogEntry } from "../src/sync/types";

function fakeAccess() {
	let data: unknown;
	return {
		loadData: async () => data,
		saveData: async (next: unknown) => {
			data = next;
		},
	};
}

function entry(overrides: Partial<SyncLogEntry> = {}): SyncLogEntry {
	return { timestamp: Date.now(), path: "note.md", action: "uploaded", result: "ok", ...overrides };
}

describe("SyncLog", () => {
	it("all() returns [] when nothing was ever logged", async () => {
		const log = new SyncLog(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await expect(log.all()).resolves.toEqual([]);
	});

	it("append() adds entries in order", async () => {
		const log = new SyncLog(new PluginDataStore<PluginDataShape>(fakeAccess()));
		const first = entry({ path: "a.md" });
		const second = entry({ path: "b.md" });
		await log.append(first);
		await log.append(second);
		await expect(log.all()).resolves.toEqual([first, second]);
	});

	it("rotates to the most recent MAX_LOG_ENTRIES (RN-002)", async () => {
		const log = new SyncLog(new PluginDataStore<PluginDataShape>(fakeAccess()));
		for (let i = 0; i < MAX_LOG_ENTRIES + 10; i++) {
			await log.append(entry({ path: `file-${i}.md` }));
		}
		const all = await log.all();
		expect(all).toHaveLength(MAX_LOG_ENTRIES);
		expect(all[0]!.path).toBe("file-10.md");
		expect(all.at(-1)!.path).toBe(`file-${MAX_LOG_ENTRIES + 9}.md`);
	});

	it("clear() empties the log", async () => {
		const log = new SyncLog(new PluginDataStore<PluginDataShape>(fakeAccess()));
		await log.append(entry());
		await log.clear();
		await expect(log.all()).resolves.toEqual([]);
	});

	it("does not clobber other persisted keys (settings)", async () => {
		const access = fakeAccess();
		const dataStore = new PluginDataStore<PluginDataShape>(access);
		await dataStore.patch({
			settings: { language: "en", excludePatterns: [], remoteFolder: "", autoSyncEnabled: false },
		});

		await new SyncLog(dataStore).append(entry());

		const data = await dataStore.read();
		expect(data.settings).toEqual({
			language: "en",
			excludePatterns: [],
			remoteFolder: "",
			autoSyncEnabled: false,
		});
		expect(data.syncLog).toHaveLength(1);
	});
});
