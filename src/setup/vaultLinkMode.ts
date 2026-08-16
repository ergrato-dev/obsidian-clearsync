// RF-006 / HU-002 CA-002.4 — decides whether the setup wizard offers "link to existing
// vault" or treats the chosen remote folder as brand new.
//
// NOT YET WIRED: `remoteFolderHasContent` must come from a live SyncProvider listing
// the remote folder — no SyncProvider is implemented yet (RT-004 MVP is Dropbox-only,
// still just an interface). This function only encodes the decision once that answer
// is available. Likewise, verifying the encryption password against the existing
// vault (CA-002.5) needs the remote salt (see the note atop SaltStore.ts) and a
// decrypt attempt against known remote content — also blocked on the same dependency.
export type VaultLinkMode = "existing" | "new";

export function resolveVaultLinkMode(remoteFolderHasContent: boolean): VaultLinkMode {
	return remoteFolderHasContent ? "existing" : "new";
}
