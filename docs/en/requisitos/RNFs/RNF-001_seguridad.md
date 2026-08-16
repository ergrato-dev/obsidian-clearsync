# RNF-001 — Security

<!--
  What? Non-functional requirement defining the plugin's security standards.
  Why? Guarantee vault content stays protected even against an untrusted cloud provider.
  Impact? This is the #1 reported deficiency against existing sync plugins — without it, ClearSync adds nothing new.
-->

---

## Identification

| Field        | Value                       |
| ------------ | ----------------------------- |
| **ID**       | RNF-001                       |
| **Name**     | Security                      |
| **Category** | Information security          |
| **Priority** | Critical                      |
| **Status**   | Planned                       |
| **Date**     | August 2026                   |

---

## Requirements

### RNF-001.1 — End-to-end encryption
Vault content must be encrypted locally with **AES-256-GCM** before upload, with a key derived from the user's password via **PBKDF2** or **scrypt**. Unencrypted content is never uploaded. See RF-005, RT-005.

### RNF-001.2 — OAuth token management
Dropbox tokens are stored via Obsidian's `this.saveData()`, never in plain text in exportable configuration without encryption, and never logged.

### RNF-001.3 — No telemetry
The plugin sends no usage data or analytics to third-party services (RS-003).

### RNF-001.4 — Input validation
Every configuration input (encryption password, exclusion patterns, OAuth credentials) is validated before use.

### RNF-001.5 — Threat model
The cloud provider (Dropbox or a future one) is assumed **untrusted**; it must never receive plain-text vault content (RS-004).

### RNF-001.6 — OWASP alignment
Every security decision is checked against [`docs/en/conceptos/owasp-top-10.md`](../../conceptos/owasp-top-10.md) before implementation.
