# RF-013 — DropboxProvider Implementation

<!--
  What? Functional requirement defining the concrete SyncProvider implementation for Dropbox.
  Why? RF-001/002/005/006/007/009 are already built but none of them moves a real file yet — the piece that actually talks to the Dropbox API is missing.
  Impact? Without this, all of v0.1 (RF-001,002,005,006,007,009) stays as unconnected infrastructure; the plugin doesn't sync anything for real.
-->

---

## Identification

| Field        | Value                          |
| ------------ | ------------------------------ |
| **ID**       | RF-013                         |
| **Name**     | DropboxProvider implementation |
| **Module**   | Sync Engine / Provider         |
| **Priority** | High                           |
| **Status**   | Planned                        |
| **Date**     | August 2026                    |

---

## Description

Concrete implementation of the `SyncProvider` interface (`src/sync/SyncProvider.ts`, RT-004) against Dropbox API v2: listing remote changes, uploading, downloading, and deleting files. Authenticates with RF-001's tokens, and every HTTP call goes through RF-009's backoff wrapper. It never decides what to sync or resolves conflicts — that's RF-014's (Sync Engine) job; `DropboxProvider` only executes the remote operations it's asked to run (Strategy pattern, see `docs/en/conceptos/patrones-arquitectonicos.md`).

---

## Inputs

| Field                        | Type | Required | Notes                                                      |
| ---------------------------- | ---- | -------- | ---------------------------------------------------------- |
| Valid access token           | Data | Yes      | Via `DropboxAuthManager.ensureFreshAccessToken()` (RF-001) |
| Base remote folder           | Text | Yes      | `settings.remoteFolder` (RF-006)                           |
| Pagination cursor (optional) | Text | No       | Returned by `listChanges()`, used on the next call         |

---

## Process

1. Every `DropboxProvider` method (`listChanges`, `upload`, `download`, `delete`) first calls `dropboxAuth.ensureFreshAccessToken()` to get a valid access token (RF-001 RN-002).
2. `listChanges(cursor?)` uses `/files/list_folder` (first call) or `/files/list_folder/continue` (with a cursor) to enumerate files under the remote folder, returning `path`, Dropbox's own `content_hash`, and `modifiedAt` per file, plus a cursor for the next call.
3. `upload(path, content)` uses `/files/upload` with content already encrypted (RF-005) by Sync Engine — it never encrypts or decrypts on its own. Large files (`/files/upload_session/*`) are left for when a size threshold is defined during implementation.
4. `download(path)` uses `/files/download` and returns the encrypted `ArrayBuffer` as-is — decryption happens in Sync Engine (RF-005), not this module.
5. `delete(path)` uses `/files/delete_v2`.
6. Every call goes through `withBackoff` (RF-009) — `DropboxProvider` never calls the Dropbox API without that wrapper.

---

## Outputs

| Scenario                                            | Result                                                                              |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Successful operation                                | Returns the data/confirmation expected by the `SyncProvider` interface              |
| Token expired with no possible refresh              | Propagates `DropboxSessionExpiredError` (RF-001) — Sync Engine decides how to react |
| Rate-limit (429) or transient error (5xx)           | Handled transparently by `withBackoff` (RF-009), invisible to the caller            |
| Persistent network failure after exhausting retries | Fails visibly — Sync Engine logs it via RF-007                                      |

---

## APIs / Involved components

- Dropbox API v2: `files/list_folder`, `files/list_folder/continue`, `files/upload`, `files/download`, `files/delete_v2`
- `DropboxAuthManager` (RF-001), `withBackoff` (RF-009)

---

## Business rules

- RN-001: `DropboxProvider` never decides what to sync or resolves conflicts — it only executes the remote read/write operations Sync Engine (RF-014) asks for.
- RN-002: Content it uploads/downloads is always passed through as-is — it never encrypts or decrypts (that's RF-005/RF-014's responsibility).
- RN-003: Dropbox's own `content_hash` is never used as the source of truth for change classification (see the RT-006 note in `docs/en/referencia-tecnica/sync-engine.md`) — at most, an optional optimization to avoid unnecessary downloads, if implemented.
