# HU-006 — Restore a Previous Version of a Note

<!--
  What? User story about undoing an unwanted merge or conflict resolution.
  Why? Auto-merge can produce a technically clean but unwanted result.
  Impact? Without this, a low-risk automatic merge could feel irreversible and erode trust.
-->

---

## Identification

| Field           | Value                                |
| --------------- | ------------------------------------ |
| **ID**          | HU-006                               |
| **Title**       | Restore a previous version of a note |
| **Module**      | Conflicts / Recovery                 |
| **Priority**    | Medium                               |
| **Status**      | Planned                              |
| **Related RFs** | RF-010                               |

---

## Story

**As** a user unhappy with the result of an automatic merge or conflict resolution,
**I want** to restore a previously known version of the note,
**so that** I can undo an unwanted result without losing my work.

---

## Acceptance criteria

### CA-006.1 — View available versions

- **Given** I check the sync log or a conflicted copy,
- **when** I look up a specific note,
- **then** I can see previous versions available to restore.

### CA-006.2 — Restore with one click

- **Given** I found the version I want to recover,
- **when** I choose "restore this version",
- **then** my current note is replaced with that version.

### CA-006.3 — Restoration syncs normally

- **Given** I restored a version,
- **when** the next sync cycle runs,
- **then** that change propagates to my other devices as a normal edit.

### CA-006.4 — Conflicted copies aren't lost

- **Given** I restored a version from a conflicted copy,
- **when** I check my vault,
- **then** the remaining conflicted copies still exist until I delete them.
