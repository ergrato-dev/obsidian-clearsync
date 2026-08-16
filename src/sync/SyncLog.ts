// RF-007 — persists the sync operation log through the shared PluginDataStore, same
// Repository pattern as HashCache/TokenStore. RN-002: rotated to the most recent
// MAX_ENTRIES, oldest dropped first, so it never grows unbounded.
import type { PluginDataStore } from "../storage/PluginDataStore";
import type { PluginDataShape } from "../storage/schema";
import type { SyncLogEntry } from "./types";

export const MAX_LOG_ENTRIES = 100;

export class SyncLog {
	constructor(private readonly dataStore: PluginDataStore<PluginDataShape>) {}

	/** Most recent last. */
	async all(): Promise<SyncLogEntry[]> {
		const data = await this.dataStore.read();
		return data.syncLog ?? [];
	}

	/** RN-001 — the intended single entry point: every sync operation, success or
	 * failure, gets appended here (see logSyncEvent.ts for the paired Notice). */
	async append(entry: SyncLogEntry): Promise<void> {
		const current = await this.all();
		const next = [...current, entry].slice(-MAX_LOG_ENTRIES);
		await this.dataStore.patch({ syncLog: next });
	}

	async clear(): Promise<void> {
		await this.dataStore.patch({ syncLog: [] });
	}
}
