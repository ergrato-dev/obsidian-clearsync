---
name: security-review
description: >
  OWASP-aligned security checklist for reviewing ClearSync code changes, covering
  encryption, token handling, path safety, and conflict-resolution integrity. Use
  when the user asks for a "security review", "revisión de seguridad", or before
  merging any change that touches auth, crypto, or the sync pipeline.
---

Review the change against `docs/{es,en}/conceptos/owasp-top-10.md` and the security
constraints in `docs/{es,en}/requisitos/restricciones.md` (section 6, RS-001..004).

## Checklist

- **A02 Cryptographic Failures** — is any vault content written to disk or sent over
  the network unencrypted at any pipeline step? Is the encryption key ever logged,
  cached beyond the active session, or derivable without the user's password?
  (RF-005, RT-005)
- **A03 Injection / path traversal** — are file paths/names coming from the remote
  provider normalized and validated against the vault root before being passed to
  `app.vault.create()`/`modify()`? A malicious or corrupted remote listing must never
  be able to write outside the vault.
- **A05 Security Misconfiguration** — does the OAuth flow request the minimum Dropbox
  scope needed (not full-account access)? Are default settings (e.g. exclusion
  patterns) safe out of the box?
- **A07 Authentication Failures** — no embedded client secret, Authorization Code +
  PKCE only, tokens stored via `this.saveData()` never in plain exportable config
  (RS-001, RS-002).
- **A08 Data Integrity Failures** — does every conflict path (RF-003, RF-004) either
  auto-merge safely or preserve both versions? Is there any code path that could
  silently overwrite a file with an unresolved conflict?
- **No telemetry** — does the change introduce any outbound call that isn't the sync
  provider's API? (RS-003)
- **No hardcoded secrets** — scan the diff for embedded keys, tokens, or passwords,
  including in test fixtures.

## Output

List findings as `file:line — issue — why it matters (OWASP category) — suggested
fix`. If nothing is found, say so explicitly — don't pad the review with
style-only nitpicks unrelated to security.
