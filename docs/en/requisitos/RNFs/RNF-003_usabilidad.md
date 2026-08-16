# RNF-003 — Usability

<!--
  What? Non-functional requirement about user experience and language accessibility.
  Why? Avoid silent failures and language barriers, two recurring complaints against current sync plugins.
  Impact? Without clear feedback, users lose trust that their data is actually synced correctly.
-->

---

## Identification

| Field        | Value        |
| ------------ | ------------ |
| **ID**       | RNF-003      |
| **Name**     | Usability    |
| **Category** | Usability/UX |
| **Priority** | High         |
| **Status**   | Planned      |
| **Date**     | August 2026  |

---

## Requirements

### RNF-003.1 — Status feedback

Users can always see whether sync is in progress, completed, or has failed. No failure ever passes silently (RF-007).

### RNF-003.2 — Spanish/English i18n

The entire interface (Settings, notifications, status messages) goes through the i18n system, with no hardcoded strings (RF-011, RI-003).

### RNF-003.3 — Clear conflict messages

When auto-merge fails, the user sees which file is in conflict, what changed, and clear resolution options.

### RNF-003.4 — Minimal viable setup

Linking Dropbox and starting to sync should take few steps: authorize OAuth and confirm the vault folder.
