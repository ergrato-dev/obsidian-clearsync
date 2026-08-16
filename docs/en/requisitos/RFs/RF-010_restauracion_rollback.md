# RF-010 — Restore/Rollback From a Conflicted Version

<!--
  What? Functional requirement letting the user undo the result of an unwanted merge or conflict resolution.
  Why? Auto-merge (RF-003) can produce a technically "clean" but semantically unwanted result.
  Impact? Without this, a low-risk automatic merge could feel irreversible and erode trust.
-->

---

## Identification

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| **ID**       | RF-010                                     |
| **Name**     | Restore/rollback from a conflicted version |
| **Module**   | Conflicts / Recovery                       |
| **Priority** | Medium                                     |
| **Status**   | Planned                                    |
| **Date**     | August 2026                                |

---

## Description

If an automatic merge (RF-003) or a manual conflict resolution produced an unwanted result, the user must be able to restore a previously known version of the file.

---

## Inputs

| Field                              | Type      | Required | Notes                                                              |
| ---------------------------------- | --------- | -------- | ------------------------------------------------------------------ |
| File + previous version to restore | Selection | Yes      | Available from the sync log (RF-007) or conflicted copies (RF-004) |

---

## Process

1. The user opens the sync log (RF-007) or sees a conflicted copy (RF-004) and chooses "restore this version".
2. The plugin overwrites the current file with the selected version.
3. This is treated as a new local change, synced normally in the next cycle (RF-002).
4. The restoration is logged as an explicit operation.

---

## Outputs

| Scenario           | Result                                      |
| ------------------ | ------------------------------------------- |
| Successful restore | File updated locally, syncs as a new change |

---

## APIs / Involved components

- Settings UI / sync log, Vault API (file write)

---

## Business rules

- RN-001: Restoring a version never auto-deletes remaining conflicted copies — the user cleans those up manually if desired.
- RN-002: Restoration is always an explicit user action, never automatic.
