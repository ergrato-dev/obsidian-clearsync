# RF-005 — End-to-End Content Encryption

<!--
  What? Functional requirement defining encryption of vault content before it's uploaded to the cloud.
  Why? The cloud provider must never be able to read the user's notes under any scenario.
  Impact? This is the project's most critical security requirement — without it, ClearSync doesn't fix deficiency #1.
-->

---

## Identification

| Field        | Value                          |
| ------------ | ---------------------------------- |
| **ID**       | RF-005                             |
| **Name**     | End-to-end content encryption       |
| **Module**   | Security / Encryption                |
| **Priority** | Critical                               |
| **Status**   | Planned                                  |
| **Date**     | August 2026                                |

---

## Description

All vault content is encrypted locally before being uploaded to the sync provider, and decrypted locally on download. The cloud provider never receives or stores plain text.

---

## Inputs

| Field                         | Type   | Required | Validation                                             |
| -------------------------------- | ------ | -------- | ------------------------------------------------------------ |
| Plain-text file content            | Data   | Yes      | —                                                                |
| Vault encryption password          | Text   | Yes      | Defined by the user in RF-006, distinct from the Dropbox password |

---

## Process

1. During initial setup (RF-006), the user defines a vault encryption password.
2. The plugin derives an AES-256 key from that password via **PBKDF2** or **scrypt**, with a unique salt stored locally.
3. Before uploading a file, its content is encrypted with **AES-256-GCM** using the derived key.
4. The encrypted file (plus its nonce/IV) is uploaded to Dropbox.
5. On download, the plugin decrypts locally using the same derived key.
6. If the encryption password doesn't match (e.g. a vault linked from another device with a different password), decryption fails explicitly and the user is notified — corrupted content is never shown silently.

---

## Outputs

| Scenario                                      | Result                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Successful encryption/decryption                     | Sync is transparent to the user                                                        |
| Wrong encryption password on a new device            | Explicit error "Could not decrypt: check your encryption password", sync paused        |

---

## APIs / Involved components

- Web Crypto API (AES-GCM, PBKDF2)
- Crypto Layer (dedicated module — see `docs/{es,en}/referencia-tecnica/architecture.md`)

---

## Business rules

- RN-001: The encryption password is never sent to Dropbox nor stored in plain text (RS-001).
- RN-002: File names and folder structure are evaluated for encryption/obfuscation if the provider exposes them via its API (to be defined during implementation, RT-005).
- RN-003: Losing the encryption password means losing access to the remote content — the plugin warns about this explicitly during initial setup.
