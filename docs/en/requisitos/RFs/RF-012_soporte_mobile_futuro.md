# RF-012 — Mobile Support (Future)

<!--
  What? Functional requirement documenting the intent and scope of mobile support, without implementing it in v1.
  Why? Explicitly record a planned expansion so v1 decisions don't block it.
  Impact? Without documenting this, v1 decisions (e.g. using Node fs directly) could close the door on mobile without anyone noticing until it's too late.
-->

---

## Identification

| Field        | Value                          |
| ------------ | ---------------------------------- |
| **ID**       | RF-012                             |
| **Name**     | Mobile support (future)              |
| **Module**   | Mobile (future)                        |
| **Priority** | Low                                       |
| **Status**   | Future — not implemented in v1               |
| **Date**     | August 2026                                    |

---

## Description

Extend ClearSync to work on Obsidian mobile (iOS/Android), where the Obsidian Plugin API is more restricted (no Node.js access, background execution limits).

---

## Inputs

Not applicable — not implemented in v1.

---

## Process (high-level, to detail when planned)

1. Audit which parts of the Sync Engine/Crypto Layer depend on APIs unavailable on mobile.
2. Adapt background sync to iOS/Android limitations (no persistent process).
3. Validate encryption/hashing performance on low-end mobile devices.

---

## Outputs

Not applicable — this RF documents future intent and scope, not current behavior.

---

## APIs / Involved components

To be defined when implementation is planned.

---

## Business rules

- RN-001: No v1 decision may require direct Node.js/fs access, precisely so this future RF isn't blocked (RT-002, RNF-004.2).
