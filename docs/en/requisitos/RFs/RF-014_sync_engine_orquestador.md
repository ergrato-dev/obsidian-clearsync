# RF-014 — Sync Engine: Sync Cycle Orchestrator (v0.1, No Conflict Resolution)

<!--
  What? Functional requirement defining the cycle that connects RF-002/005/007/009/013 into a real sync.
  Why? It's the missing piece for v0.1 to stop being disconnected infrastructure and actually sync files.
  Impact? Without this, no v0.1 RF has an observable effect — the user can configure everything and nothing syncs.
-->

---

## Identification

| Field        | Value                                                               |
| ------------ | ------------------------------------------------------------------- |
| **ID**       | RF-014                                                              |
| **Name**     | Sync Engine: sync cycle orchestrator (v0.1, no conflict resolution) |
| **Module**   | Sync Engine                                                         |
| **Priority** | High                                                                |
| **Status**   | Planned                                                             |
| **Date**     | August 2026                                                         |

---

## Description

Orchestrates a full sync cycle: walks the vault, classifies each file against remote state (RF-002), encrypts/decrypts content (RF-005), uploads/downloads via a `SyncProvider` (RF-013), and logs every operation (RF-007). **v0.1 scope:** files classified as `conflict` are detected and left untouched, never auto-merged — automatic text resolution (RF-003) and binary handling (RF-004) are roadmap v0.2. In v0.1 the cycle is triggered manually (a Settings button), not run in the background.

---

## Inputs

| Field                        | Type   | Required | Notes                                                                             |
| ---------------------------- | ------ | -------- | --------------------------------------------------------------------------------- |
| A `SyncProvider` instance    | Object | Yes      | `DropboxProvider` (RF-013)                                                        |
| `HashCache`                  | Object | Yes      | RF-002                                                                            |
| Unlocked `EncryptionManager` | Object | Yes      | RF-005 — the cycle doesn't start if `isUnlocked()` is false                       |
| `SyncLog`/`SyncStatus`       | Object | Yes      | RF-007                                                                            |
| Vault files                  | Data   | Yes      | Via `app.vault.getFiles()`, scoped with the default `.obsidian/**` exclusion only |

---

## Process

1. `syncStatus.set("syncing")`.
2. Walks `app.vault.getFiles()` within scope (only the default `.obsidian/**` exclusion in v0.1 — full configurable patterns are RF-008, roadmap v0.3).
3. For each file, computes `localHash` (RF-002 `hashContent`).
4. Calls `syncProvider.listChanges()` to get remote state (handling the pagination cursor for large vaults).
5. Per file, fetches `baseHash` from `HashCache` and classifies with `classifyChange({localHash, remoteHash, baseHash})` (RF-002).
6. **`upload`**: encrypts content (`encryption.encryptContent`) → `syncProvider.upload()` → updates `HashCache` → `logSyncEvent(action: "uploaded", result: "ok")`.
7. **`download`**: `syncProvider.download()` → decrypts (`encryption.decryptContent`; on `DecryptionError`, `logSyncEvent` with `result: "error"` and a wrong-password detail) → writes via the Vault API → updates `HashCache` → `logSyncEvent("downloaded")`.
8. **`conflict`**: v0.1 doesn't merge — `logSyncEvent(action: "conflict", result: "error", detail: "pending merge — v0.2")` and continues with the remaining files without aborting the cycle (the first time RF-009 step 5 actually applies).
9. **`unchanged`**: skipped without logging, to avoid noise.
10. When done: `syncStatus.set("idle")`, or `"error"` if something unrecoverable happened outside step 8's per-file handling.

---

## Outputs

| Scenario                               | Result                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| Full cycle with no conflicts           | All files synced, `syncStatus` back to `"idle"`, log updated                       |
| Conflicted file(s) detected            | Left untouched, logged as pending, the rest of the cycle continues                 |
| Encryption not unlocked                | The cycle doesn't start; prompts to unlock (reuses RF-006's step)                  |
| Persistent network failure on one file | That file fails and gets logged (RF-009 step 4); the cycle continues with the rest |

---

## APIs / Involved components

- `SyncProvider`/`DropboxProvider` (RF-013), `HashCache`/`classifyChange`/`hashContent` (RF-002), `EncryptionManager` (RF-005), `SyncLog`/`SyncStatus`/`logSyncEvent` (RF-007), Obsidian Vault API (`getFiles`, `read`, `create`/`modify`)

---

## Business rules

- RN-001: No file classified as `conflict` is ever auto-overwritten in v0.1 — the only allowed action is leaving it untouched and logging it. RF-003/RF-004 resolve it in v0.2.
- RN-002: An error on one individual file (e.g. a network failure on its upload) doesn't abort the whole cycle — it's logged and the rest continue.
- RN-003: The cycle doesn't run automatically in v0.1 — it's triggered manually from Settings. Background automatic sync (using the `autoSyncEnabled` flag already added in RF-006) remains an undocumented future RF.
