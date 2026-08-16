# RF-006 — Initial Setup and Vault Linking

<!--
  What? Functional requirement defining the guided first-run configuration flow.
  Why? Reduce setup friction (RNF-003.4) without skipping critical security steps.
  Impact? A confusing onboarding leads users to misconfigure encryption and lose access to their data.
-->

---

## Identification

| Field        | Value                              |
| ------------ | -------------------------------------- |
| **ID**       | RF-006                                 |
| **Name**     | Initial setup and vault linking          |
| **Module**   | Configuration                              |
| **Priority** | High                                         |
| **Status**   | Planned                                        |
| **Date**     | August 2026                                      |

---

## Description

Guided flow for a new user to connect their Dropbox account, define their encryption password, and link an Obsidian vault to sync for the first time.

---

## Inputs

| Field                    | Type   | Required | Validation                             |
| ---------------------------| ------ | -------- | ------------------------------------------- |
| Encryption password           | Text   | Yes      | Set and confirmed (RF-005)                     |
| Remote Dropbox folder          | Text   | Yes      | Create new or select existing                    |

---

## Process

1. The user opens the plugin's Settings for the first time.
2. Runs RF-001 (connect Dropbox).
3. Sets the vault encryption password, with confirmation.
4. Chooses or creates the remote Dropbox folder where the synced vault will live.
5. If the remote folder already has content (an existing vault from another device), the plugin offers "link to existing vault" (initial download) or "new vault" (upload the current local vault).
6. The first full sync runs with the chosen state.

---

## Outputs

| Scenario                                             | Result                                                              |
| --------------------------------------------------------| --------------------------------------------------------------------------|
| Setup complete                                            | The plugin becomes active, automatic sync enabled                          |
| Existing remote vault + different encryption password     | Explicit decryption error (RF-005); setup doesn't complete until resolved  |

---

## APIs / Involved components

- Settings UI, RF-001, RF-005, Dropbox API (list/create folder)

---

## Business rules

- RN-001: Automatic sync can't be enabled without completing all three steps: Dropbox, encryption, folder.
- RN-002: Linking to an existing remote vault requires verifying the encryption password before proceeding.
