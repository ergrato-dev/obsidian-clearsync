# HU-007 — Change the Interface Language

<!--
  What? User story about the plugin's bilingual UI support.
  Why? A sync plugin is used daily — a language barrier is constant friction.
  Impact? Without this, part of the Spanish-speaking community uses a tool they don't fully understand.
-->

---

## Identification

| Field         | Value                            |
| ----------------| -------------------------------------|
| **ID**          | HU-007                                 |
| **Title**       | Change the interface language              |
| **Module**      | UI / i18n                                     |
| **Priority**    | Medium                                          |
| **Status**      | Planned                                            |
| **Related RFs** | RF-011                                                |

---

## Story

**As** a user who prefers Spanish or English,
**I want** the plugin interface to respect Obsidian's language or let me choose it manually,
**so that** I can use the plugin comfortably in my own language.

---

## Acceptance criteria

### CA-007.1 — Automatic detection
- **Given** Obsidian is set to Spanish,
- **when** I open Settings > ClearSync,
- **then** the entire plugin interface appears in Spanish.

### CA-007.2 — Manual override
- **Given** I want to force a language different from Obsidian's,
- **when** I change the language selector in Settings,
- **then** the plugin interface changes immediately without restarting Obsidian.

### CA-007.3 — Fallback to English
- **Given** Obsidian is set to an unsupported language (e.g. French),
- **when** I open the plugin,
- **then** the interface shows in English by default.

### CA-007.4 — No raw keys visible
- **Given** a translation is missing for a specific string,
- **when** that text is displayed,
- **then** I see the English text as fallback, never an untranslated technical key.
