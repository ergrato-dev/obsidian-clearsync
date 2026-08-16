# RF-008 — Selective File/Folder Exclusion

<!--
  What? Functional requirement letting the user exclude vault content from the sync process.
  Why? Not all vault content needs (or should) be synced — heavy attachments, local config, etc.
  Impact? Without this, sync is all-or-nothing, forcing the upload of unnecessary or sensitive content.
-->

---

## Identification

| Field        | Value                           |
| ------------ | ------------------------------- |
| **ID**       | RF-008                          |
| **Name**     | Selective file/folder exclusion |
| **Module**   | Configuration                   |
| **Priority** | Medium                          |
| **Status**   | Planned                         |
| **Date**     | August 2026                     |

---

## Description

The user must be able to exclude specific folders or file patterns from the sync process (e.g. heavy attachment folders, local templates, part of `.obsidian/`).

---

## Inputs

| Field                      | Type        | Required | Validation                              |
| -------------------------- | ----------- | -------- | --------------------------------------- |
| List of exclusion patterns | Text (glob) | No       | Valid glob syntax, editable in Settings |

---

## Process

1. The user adds exclusion patterns in Settings (e.g. `attachments/videos/**`, `*.excalidraw`).
2. The Sync Engine filters these patterns before computing hashes (RF-002) or transferring files.
3. Files already synced that become excluded stay in the local vault but stop syncing (they are not auto-deleted remotely).

---

## Outputs

| Scenario        | Result                                            |
| --------------- | ------------------------------------------------- |
| Pattern applied | Matching files are skipped on the next sync cycle |
| Invalid pattern | Settings shows a syntax error before saving       |

---

## APIs / Involved components

- Settings UI, Sync Engine (scope filter)

---

## Business rules

- RN-001: `.obsidian/` (local vault configuration) is excluded by default unless the user explicitly includes it.
- RN-002: Excluding a file doesn't delete it remotely; the user must delete it manually if that's their intent.
