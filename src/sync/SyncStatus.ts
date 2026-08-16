// RF-007 — current sync status, observed by the status bar (RF-007 step 2). Pure
// in-memory state, not persisted: every plugin load starts "idle" again; only the log
// itself (SyncLog) is durable.
export type SyncState = "idle" | "syncing" | "error" | "conflict";

export type SyncStatusListener = (state: SyncState) => void;

export class SyncStatus {
	private state: SyncState = "idle";
	private readonly listeners = new Set<SyncStatusListener>();

	get current(): SyncState {
		return this.state;
	}

	set(state: SyncState): void {
		this.state = state;
		for (const listener of this.listeners) listener(state);
	}

	/** Fires immediately with the current state, then on every change. Returns an
	 * unsubscribe function (matches Obsidian's Component.register() signature). */
	subscribe(listener: SyncStatusListener): () => void {
		this.listeners.add(listener);
		listener(this.state);
		return () => this.listeners.delete(listener);
	}
}
