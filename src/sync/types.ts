// Data structures from docs/{es,en}/referencia-tecnica/sync-engine.md.

/** One entry per file, persisted locally via Plugin.saveData(). */
export interface HashCacheEntry {
	path: string;
	/** Last hash synced in common between local and remote (RF-002). */
	baseHash: string;
	lastSyncedAt: number;
}

export type SyncAction = "uploaded" | "downloaded" | "merged" | "conflict" | "restored";

/** RF-007 sync log entry. */
export interface SyncLogEntry {
	timestamp: number;
	path: string;
	action: SyncAction;
	result: "ok" | "error";
	detail?: string;
}
