# RF-007 — Sync Status and Log Visible in the UI

<!--
  What? Functional requirement defining how the user sees sync status at all times.
  Why? No failure should go unnoticed — this is one of the central complaints against current plugins.
  Impact? Without this, the user discovers data loss days later, when it's too late to react.
-->

---

## Identification

| Field        | Value                                 |
| ------------ | ------------------------------------- |
| **ID**       | RF-007                                |
| **Name**     | Sync status and log visible in the UI |
| **Module**   | UI / Status                           |
| **Priority** | High                                  |
| **Status**   | In progress — `SyncStatus`/`SyncLog`/Settings panel implemented and tested; the log stays empty until a real Sync Engine exists to call `logSyncEvent()` |
| **Date**     | August 2026                           |

---

## Description

The user must be able to see at all times whether sync is active, in progress, completed, failed, or paused, plus a recent history of sync events and conflicts.

---

## Inputs

None — this is a read-only view over the Sync Engine's internal state.

---

## Process

1. The Sync Engine emits status events (`idle`, `syncing`, `error`, `conflict`) during each cycle.
2. Obsidian's status bar icon reflects the current state.
3. A dedicated panel (or modal) shows the log of the last N operations: file, action (uploaded/downloaded/merged/conflict), timestamp, result.
4. On error or conflict, a notification (Obsidian `Notice`) is shown in addition to being logged.

---

## Outputs

| Scenario            | Result                                                             |
| ------------------- | ------------------------------------------------------------------ |
| Successful sync     | Icon shows idle state, entry logged                                |
| Network/API error   | Icon shows error state, notification shown, error detail logged    |
| Unresolved conflict | Icon shows attention state, persistent notification until resolved |

---

## APIs / Involved components

- Obsidian StatusBar API, Notice API, Settings UI (log panel)

---

## Business rules

- RN-001: No sync failure occurs without leaving a visible trace in the log (RNF-003.1).
- RN-002: The log is kept locally with a reasonable entry limit (rotation); it doesn't grow indefinitely.
