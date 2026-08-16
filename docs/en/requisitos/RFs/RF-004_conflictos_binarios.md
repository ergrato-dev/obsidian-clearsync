# RF-004 — Binary/Attachment Conflict Resolution

<!--
  What? Functional requirement about what happens when a non-mergeable file (image, PDF, etc.) conflicts.
  Why? A binary can't be merged line by line; no version may ever be lost.
  Impact? Silently overwriting an attachment is one of the most common complaints against current sync plugins.
-->

---

## Identification

| Field        | Value                                       |
| ------------ | ----------------------------------------------- |
| **ID**       | RF-004                                            |
| **Name**     | Binary/attachment conflict resolution               |
| **Module**   | Sync Engine / Conflicts                              |
| **Priority** | High                                                    |
| **Status**   | Planned                                                  |
| **Date**     | August 2026                                                |

---

## Description

When a binary or attachment file (image, PDF, etc.) changed on both sides since the last common sync, the plugin never overwrites silently: it keeps both versions using the "conflicted copy" convention.

---

## Inputs

| Field                     | Type | Required | Notes |
| ---------------------------- | ---- | -------- | ----- |
| Local version of the file       | Data | Yes      | —     |
| Remote version of the file      | Data | Yes      | —     |

---

## Process

1. A real conflict is detected on a file not supported by three-way merge (not plain text).
2. The plugin keeps the remote file under its original name.
3. The other version is saved as a copy with suffix `name (conflicted copy {device} {timestamp}).ext`.
4. Both files remain visible in the vault; the user decides which to keep.
5. The conflict is logged in the sync log (RF-007).

---

## Outputs

| Scenario         | Result                                                                |
| -------------------- | --------------------------------------------------------------------------- |
| Binary conflict        | Two files visible in the vault, user notified, neither one is lost           |

---

## APIs / Involved components

- Conflict Resolver
- Obsidian Vault API (creating a file under a new name)

---

## Business rules

- RN-001: A binary file in conflict is never discarded without leaving both copies accessible.
- RN-002: The conflicted-copy suffix includes a device identifier and a timestamp so the user understands the conflict's origin.
