# HU-004 — Resolve a Note Merge Conflict

<!--
  What? User story about how sync conflicts are experienced from the user's side.
  Why? The project's core differentiator: auto-merge when safe, intervention only when real.
  Impact? This is the experience that directly attacks current plugins' silent data loss.
-->

---

## Identification

| Field           | Value                         |
| --------------- | ----------------------------- |
| **ID**          | HU-004                        |
| **Title**       | Resolve a note merge conflict |
| **Module**      | Sync Engine / Conflicts       |
| **Priority**    | High                          |
| **Status**      | Planned                       |
| **Related RFs** | RF-003, RF-004                |

---

## Story

**As** a user who edits notes from multiple devices,
**I want** text conflicts to resolve automatically when it's safe, and to be asked to decide only when there's a real clash,
**so that** I don't lose edits or waste time reviewing false conflicts.

---

## Acceptance criteria

### CA-004.1 — Transparent automatic merge

- **Given** I edited a note on two devices without touching the same lines,
- **when** sync runs,
- **then** the note merges automatically without asking me anything.

### CA-004.2 — Automatic merge notification

- **Given** an automatic merge happened,
- **when** I check the log,
- **then** I see it recorded that the note was auto-merged.

### CA-004.3 — Real conflict alert

- **Given** I edited the same line of a note on two devices,
- **when** sync runs,
- **then** I get an unresolved-conflict notification, with both versions available.

### CA-004.4 — Manual resolution

- **Given** I have a real conflict pending,
- **when** I open the conflicted note,
- **then** I can choose which version to keep or manually combine them.

### CA-004.5 — Binary conflict keeps both copies

- **Given** an attachment (image/PDF) changed on both devices,
- **when** sync runs,
- **then** I find both files in my vault, one with a conflicted-copy suffix.

### CA-004.6 — No silent overwrite

- **Given** any type of real conflict exists,
- **when** sync runs,
- **then** no version is ever overwritten without my knowledge.
