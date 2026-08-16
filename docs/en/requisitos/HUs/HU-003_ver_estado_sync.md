# HU-003 — View Sync Status and Progress

<!--
  What? User story about visibility into sync status.
  Why? No failure should ever go unnoticed by the user.
  Impact? Without this, the user discovers data loss days later, when it's too late to react.
-->

---

## Identification

| Field           | Value                         |
| --------------- | ----------------------------- |
| **ID**          | HU-003                        |
| **Title**       | View sync status and progress |
| **Module**      | UI / Status                   |
| **Priority**    | High                          |
| **Status**      | Planned                       |
| **Related RFs** | RF-007                        |

---

## Story

**As** a ClearSync user,
**I want** to see at all times whether my vault is synced, syncing, or has errors,
**so that** I can trust my notes are safe without having to guess.

---

## Acceptance criteria

### CA-003.1 — Status icon in the bottom bar

- **Given** the plugin is active,
- **when** I check Obsidian's status bar,
- **then** I see an icon showing idle/syncing/error.

### CA-003.2 — Accessible log panel

- **Given** I want to see sync history,
- **when** I open ClearSync's log panel,
- **then** I see the latest operations with file, action, result, and timestamp.

### CA-003.3 — Notification on error

- **Given** a network or API error occurs,
- **when** sync fails,
- **then** I receive a visible notification in addition to the log entry.

### CA-003.4 — Persistent notification on conflict

- **Given** there's an unresolved conflict,
- **when** I check the status,
- **then** the notification stays visible until I resolve the conflict.

### CA-003.5 — No silent failures

- **Given** any sync operation fails,
- **when** I check the log,
- **then** I always find a record of that failure, never an information gap.
