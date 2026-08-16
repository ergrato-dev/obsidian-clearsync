// RF-007 — the one intended entry point for logging a sync operation: always appends
// to SyncLog, and for error/conflict outcomes also raises a Notice. RN-001 ("no
// failure without a visible trace") depends on both happening together, so this is
// the only place that should call SyncLog.append() — calling it directly elsewhere
// would let RN-001 be silently skipped for that call site.
import { Notice } from "obsidian";
import type { SyncLog } from "./SyncLog";
import type { SyncLogEntry } from "./types";

export async function logSyncEvent(syncLog: SyncLog, entry: SyncLogEntry): Promise<void> {
	await syncLog.append(entry);
	if (entry.result === "error" || entry.action === "conflict") {
		const detail = entry.detail ? ` (${entry.detail})` : "";
		new Notice(`ClearSync: ${entry.action} — ${entry.path}${detail}`);
	}
}
