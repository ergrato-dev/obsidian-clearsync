# Sync Engine — Detection and Resolution Algorithm

<!--
  What? Detail of the hashing, conflict detection, merge, and backoff algorithm.
  Why? This is the project's technical core differentiator — it must be documented before being coded (RO-003).
  Impact? A design mistake here (e.g. hashing encrypted content) breaks text merging or causes false conflicts.
-->

---

## Data structures

**Hash Cache entry** (one per file, persisted locally via `saveData()`):

```
{
  path: string
  baseHash: string       // last commonly-synced hash (local == remote)
  lastSyncedAt: number    // epoch timestamp
}
```

**Sync Log entry** (RF-007):

```
{
  timestamp: number
  path: string
  action: "uploaded" | "downloaded" | "merged" | "conflict" | "restored"
  result: "ok" | "error"
  detail?: string
}
```

## Change detection (RF-002)

1. For each file within scope (excluding RF-008 patterns), compute `localHash = SHA-256(plain-text content)` via Web Crypto `subtle.digest`.
2. Obtain `remoteHash` — computed the same way after downloading content/metadata from the provider, or via a hash provided by the API if trustworthy (must be validated against Dropbox API v2's `content_hash`, which uses its own algorithm distinct from SHA-256 — **do not assume direct compatibility**; recompute locally after download if needed).
3. Compare `localHash`, `remoteHash` against the Hash Cache's `baseHash`:

| localHash == baseHash | remoteHash == baseHash | Result                          |
| -------------------------| ---------------------------| -------------------------------------|
| Yes                        | Yes                           | No changes — skipped                    |
| No                         | Yes                           | Local change — upload                    |
| Yes                        | No                            | Remote change — download                  |
| No                         | No                            | Real conflict — see merge/binary flow      |

## Three-way merge (RF-003)

Plain-text extensions only (`.md`, `.txt`):

1. Retrieve `baseContent` (last commonly-synced version, cached locally or reconstructible).
2. Run a line-by-line diff3 between `baseContent`, `localContent`, `remoteContent`.
3. If no modified hunk overlaps between local and remote → apply the merge, the result becomes the new synced version.
4. If there's overlap → mark as an unresolved conflict (RF-003.4), don't touch the local file until the user decides.

## Binary conflicts (RF-004)

For files not supported by diff3:

1. Keep the remote version under its original name.
2. Save the local version as `name (conflicted copy {deviceId} {timestampISO}).ext`.
3. Log both paths in the Sync Log.

## Backoff on rate-limiting (RF-009)

HTTP wrapper around every `SyncProvider` call:

- 429 with a `Retry-After` header → wait exactly that long.
- 429 without the header → exponential backoff with jitter: `min(baseDelay * 2^attempt + jitter, maxDelay)`.
- 5xx → same exponential backoff, up to `maxRetries` (configurable, default to be set during implementation).
- Retries exhausted → visible failure (RF-007), the rest of the cycle continues with other files.

## Note on encryption and hashing

The sync-integrity hash (RF-002) is computed **over plain-text content**, never over encrypted content — encryption (RF-005) happens at a later pipeline step, exclusively for remote transport/storage. Hashing the encrypted content would produce different hashes for identical content each time (since each encryption uses a different nonce/IV), breaking "no changes" detection.
