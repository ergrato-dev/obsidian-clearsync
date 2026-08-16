# RF-003 — Automatic Three-Way Merge for Text Files

<!--
  What? Functional requirement defining automatic conflict resolution for text notes.
  Why? A real conflict shouldn't always require manual intervention, without falling into silent last-write-wins.
  Impact? This is ClearSync's main differentiator against the silent data loss of current plugins.
-->

---

## Identification

| Field        | Value                                    |
| ------------ | ---------------------------------------- |
| **ID**       | RF-003                                   |
| **Name**     | Automatic three-way merge for text files |
| **Module**   | Sync Engine / Merge                      |
| **Priority** | High                                     |
| **Status**   | Planned                                  |
| **Date**     | August 2026                              |

---

## Description

When a text file (`.md`) changed both locally and remotely since the last common synced version, the plugin attempts an automatic three-way merge (common base + local version + remote version) before asking for user intervention.

---

## Inputs

| Field                  | Type | Required | Notes                         |
| ---------------------- | ---- | -------- | ----------------------------- |
| Base version           | Data | Yes      | Last content synced in common |
| Current local version  | Data | Yes      | —                             |
| Current remote version | Data | Yes      | —                             |

---

## Process

1. A real conflict is detected (RF-002, step 6).
2. If the extension is `.md`/plain text, a line-by-line three-way merge runs over base/local/remote.
3. If there are no overlapping modified hunks on both sides, the merge is applied automatically and the result syncs without intervention.
4. If there is real overlap (same block modified differently on both sides), the file is flagged as an unresolved conflict and the user is notified (RF-007), with both versions available.
5. The user manually resolves the non-mergeable conflict from the UI.

---

## Outputs

| Scenario                 | Result                                                                       |
| ------------------------ | ---------------------------------------------------------------------------- |
| Clean merge (no overlap) | File updated and synced; non-blocking informational notification             |
| Real conflict (overlap)  | Persistent notification; the file is not overwritten until manually resolved |

---

## APIs / Involved components

- Conflict Resolver (diff3 algorithm)
- Sync Engine, Settings UI (notification)

---

## Business rules

- RN-001: Automatic merge only applies to plain-text files (`.md`, `.txt`); binaries are never auto-merged (see RF-004).
- RN-002: An unresolved overlapping version is never silently overwritten (RNF-001, RNF-003).
- RN-003: The auto-merge result is logged in the sync log (RF-007) for traceability.
