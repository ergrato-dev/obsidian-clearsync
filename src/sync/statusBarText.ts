import type { SyncState } from "./SyncStatus";

const LABELS: Record<SyncState, string> = {
	idle: "idle",
	syncing: "syncing…",
	error: "error",
	conflict: "conflict",
};

export function statusBarText(state: SyncState): string {
	return `ClearSync: ${LABELS[state]}`;
}
