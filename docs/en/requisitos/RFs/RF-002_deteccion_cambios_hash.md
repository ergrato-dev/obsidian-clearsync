# RF-002 — Content-Hash Change Detection

<!--
  What? Functional requirement defining how the plugin detects which files changed since the last sync.
  Why? mtime is unreliable across filesystems and devices; content hashing is the only deterministic signal.
  Impact? Without this, we repeat bug #1 of current plugins: false conflicts or missed changes.
-->

---

## Identification

| Field        | Value                         |
| ------------ | ----------------------------- |
| **ID**       | RF-002                        |
| **Name**     | Content-hash change detection |
| **Module**   | Sync Engine                   |
| **Priority** | High                          |
| **Status**   | Planned                       |
| **Date**     | August 2026                   |

---

## Description

The plugin must detect which vault files changed since the last sync by computing a **content hash (SHA-256)** per file, instead of relying on filesystem metadata (`mtime`).

---

## Inputs

| Field                 | Type | Required | Notes                                            |
| --------------------- | ---- | -------- | ------------------------------------------------ |
| Vault files           | Data | Yes      | Via Obsidian's Vault API, within RF-008's scope  |
| Last known hash state | Data | Yes      | Persisted locally after the last successful sync |

---

## Process

1. At the start of a sync cycle, the plugin walks the vault files within the configured scope (RF-008).
2. For each file, it computes the SHA-256 of its content.
3. It compares the current hash against the last known hash stored locally for that file.
4. Changed locally, not remotely → file pending upload.
5. Changed remotely, not locally → file pending download.
6. Changed on both sides relative to the last common hash → real conflict (see RF-003/RF-004).
7. Unchanged on both sides → skipped, no network traffic generated.

---

## Outputs

| Scenario                | Result                                     |
| ----------------------- | ------------------------------------------ |
| No changes              | Sync cycle finishes with no transfers      |
| One-directional changes | Synced without user intervention           |
| Changes on both sides   | Triggers the conflict flow (RF-003/RF-004) |

---

## APIs / Involved components

- Web Crypto API (`subtle.digest`) for SHA-256
- Obsidian Vault API (file reads)
- Sync Engine (local hash state)

---

## Business rules

- RN-001: `mtime` is never used as the sole change signal (RT-006).
- RN-002: The sync-integrity hash is computed over plain-text content, so merging (RF-003) operates on real text; encryption (RF-005) happens later, on the transport pipeline.
