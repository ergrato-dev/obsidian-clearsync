# HU-002 — Complete Initial Vault Setup

<!--
  What? User story about the first-run setup wizard (Dropbox + encryption + remote folder).
  Why? Reduce setup friction without skipping critical security steps.
  Impact? A confusing onboarding leads users to misconfigure encryption and lose access to their own data.
-->

---

## Identification

| Field         | Value                          |
| ----------------| ---------------------------------|
| **ID**          | HU-002                             |
| **Title**       | Complete initial vault setup          |
| **Module**      | Configuration                            |
| **Priority**    | High                                        |
| **Status**      | Planned                                       |
| **Related RFs** | RF-005, RF-006                                   |

---

## Story

**As** a new plugin user,
**I want** to complete an initial setup wizard (Dropbox + encryption + remote folder),
**so that** I can start syncing my vault securely without confusing steps.

---

## Acceptance criteria

### CA-002.1 — Guided wizard
- **Given** I install the plugin for the first time,
- **when** I open Settings,
- **then** I see a step-by-step wizard: connect Dropbox, set encryption password, choose remote folder.

### CA-002.2 — Encryption password confirmation
- **Given** I'm setting my encryption password,
- **when** I enter and confirm it,
- **then** the wizard validates both fields match before proceeding.

### CA-002.3 — Loss-of-access warning
- **Given** I'm setting the encryption password,
- **when** I confirm it,
- **then** I see an explicit warning that losing it means losing access to the remote content.

### CA-002.4 — Link to existing vault
- **Given** the chosen remote folder already contains a vault synced from another device,
- **when** I select it,
- **then** the wizard offers "link to existing vault" instead of creating a new one.

### CA-002.5 — Wrong-password error when linking
- **Given** I link to an existing remote vault with an encryption password different from the original,
- **when** the plugin tries to decrypt the first file,
- **then** I see an explicit error and setup doesn't complete.

### CA-002.6 — Activation after completing all steps
- **Given** I completed Dropbox, encryption, and remote folder,
- **when** I finish the wizard,
- **then** automatic sync becomes enabled.
