# OWASP Top 10 Applied to ClearSync

<!--
  What? Mapping of the OWASP Top 10 (2021) to the domain of an encrypted sync client plugin.
  Why? Every security decision should be checked against a recognized checklist, not just intuition.
  Impact? Most OWASP categories assume a backend — they need reinterpreting here for a pure client (RO-004).
-->

---

## A01 — Broken Access Control

There's no proprietary backend with roles/permissions to break (RO-004). The equivalent here: access to decrypted content depends solely on the user's encryption password (RF-005). Mitigation: the key is never derived or cached in a way that survives without the active password.

## A02 — Cryptographic Failures

**The project's most relevant category.** Mitigated by RF-005: AES-256-GCM, key derivation with PBKDF2/scrypt, unique salt per vault, unencrypted content is never uploaded (RT-005, RS-004). See `docs/en/referencia-tecnica/sync-engine.md` for exactly where encryption happens in the pipeline.

## A03 — Injection

No SQL or shell on the client. Real attack surface: file names/paths received from the remote provider could enable path traversal when writing to the local Vault. Mitigation: every remote path is normalized and validated against the vault scope before being used in `app.vault.create()`/`modify()`.

## A04 — Insecure Design

Structurally mitigated by the documentation-first workflow (RO-003): no RF is implemented without specifying its threat model. The project's core threat model — "the cloud provider is untrusted" (RS-004) — is an explicit design decision, not a later patch.

## A05 — Security Misconfiguration

Relevant to the scope of permissions requested from the Dropbox app: the minimum necessary scope must be requested (e.g. `files.content.write`/`files.content.read` over the app's folder), never full account access, following least privilege.

## A06 — Vulnerable and Outdated Components

Mitigated by RH-001/002 (pnpm, minimal dependencies) and keeping the lockfile up to date. Recommended: Dependabot or equivalent enabled on the repo once `package.json` exists.

## A07 — Identification and Authentication Failures

Mitigated by RF-001: OAuth2 + PKCE (no embedded client secret), no Implicit Grant, tokens never hardcoded or logged (RS-001), renewal via refresh token.

## A08 — Software and Data Integrity Failures

Mitigated by RF-002 (content hashing to detect changes) and RF-003/RF-004 (no conflict is ever resolved by silently overwriting). Future work: sign/verify release artifacts before publishing to the community plugins directory.

## A09 — Security Logging and Monitoring Failures

Adapted to the client context: there's no centralized monitoring (no server, RO-004), but there is a local, user-visible log (RF-007) serving the same purpose — no sync operation happens without leaving a trace.

## A10 — Server-Side Request Forgery (SSRF)

Not applicable — there is no server-side component in the project (RO-004).
