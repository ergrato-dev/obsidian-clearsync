# RF-011 — Spanish/English User Interface (i18n)

<!--
  What? Functional requirement defining the plugin's bilingual UI support.
  Why? A sync plugin is used daily — a language barrier is constant friction, not a one-time cost.
  Impact? Without i18n from v1, adding languages later means refactoring the entire existing UI.
-->

---

## Identification

| Field        | Value                                 |
| ------------ | ------------------------------------- |
| **ID**       | RF-011                                |
| **Name**     | Spanish/English user interface (i18n) |
| **Module**   | UI / i18n                             |
| **Priority** | Medium                                |
| **Status**   | Planned                               |
| **Date**     | August 2026                           |

---

## Description

The entire visible plugin interface (Settings, notifications, status messages, log) must be available in Spanish and English, with automatic selection based on Obsidian's language and a manual override.

---

## Inputs

| Field                         | Type      | Required | Notes                                  |
| ----------------------------- | --------- | -------- | -------------------------------------- |
| Language selector in Settings | Selection | No       | Options: Automatic / Español / English |

---

## Process

1. By default, the plugin detects Obsidian's configured language and uses es/en accordingly; any other language falls back to English.
2. The user can manually force es/en from Settings, overriding automatic detection.
3. All visible strings resolve through an i18n dictionary (`en.json`/`es.json`), never hardcoded in UI code.

---

## Outputs

| Scenario                           | Result                                                    |
| ---------------------------------- | --------------------------------------------------------- |
| Obsidian's language set to Spanish | Plugin UI shows Spanish automatically                     |
| Manual override to English         | Plugin UI shows English regardless of Obsidian's language |

---

## APIs / Involved components

- Internal i18n system, Settings UI

---

## Business rules

- RN-001: No UI string is hardcoded outside the i18n system (RI-003).
- RN-002: A missing translation key falls back to English as default; the raw key is never shown to the user.
