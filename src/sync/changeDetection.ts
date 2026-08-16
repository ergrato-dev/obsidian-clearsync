// RF-002 — classifies a file's sync status from the 4-row table in
// docs/{es,en}/referencia-tecnica/sync-engine.md, comparing the current local/remote
// content hashes against the last commonly-synced hash (HashCacheEntry.baseHash).
//
// `undefined` means "no hash on that side" — either the file doesn't exist there yet,
// or (local/remote hasn't been read). This lets new-file creation fall out of the same
// four-way comparison without special-casing it: see tests/changeDetection.test.ts.
//
// NOT covered here: deletion propagation. Hash comparison alone can't distinguish "file
// never existed on this side" from "file was deleted here" — that needs its own future
// RF built on top of this one (tracked in AUDITORIA.md).

export type ChangeStatus = "unchanged" | "upload" | "download" | "conflict";

export function classifyChange(params: {
	localHash: string | undefined;
	remoteHash: string | undefined;
	baseHash: string | undefined;
}): ChangeStatus {
	const { localHash, remoteHash, baseHash } = params;

	// Fast path: if both sides already agree, it's a no-op regardless of history —
	// including two devices independently creating identical content with no shared
	// base yet. Checking history first (as an earlier version of this function did)
	// misclassifies that case as a conflict; caught by
	// tests/changeDetection.test.ts.
	if (localHash === remoteHash) return "unchanged";

	const localChanged = localHash !== baseHash;
	const remoteChanged = remoteHash !== baseHash;

	if (!localChanged) return "download";
	if (!remoteChanged) return "upload";
	return "conflict";
}
