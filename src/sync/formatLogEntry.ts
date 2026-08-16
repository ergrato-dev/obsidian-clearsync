import type { SyncLogEntry } from "./types";

export function formatLogEntry(entry: SyncLogEntry): string {
	const date = new Date(entry.timestamp).toLocaleString();
	const status = entry.result === "error" ? "✗" : "✓";
	return `${status} ${entry.action} — ${entry.path} (${date})`;
}
