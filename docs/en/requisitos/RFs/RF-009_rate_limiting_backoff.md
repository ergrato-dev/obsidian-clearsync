# RF-009 — Dropbox API Rate-Limiting and Backoff Handling

<!--
  What? Functional requirement about how the plugin reacts to Dropbox rate limits or transient errors.
  Why? An aggressive retry worsens rate-limiting and can lock the user out of the API for longer.
  Impact? Without backoff, a large vault with many files can fail in a cascade during the first full sync.
-->

---

## Identification

| Field        | Value                                             |
| ------------ | ------------------------------------------------------ |
| **ID**       | RF-009                                                  |
| **Name**     | Dropbox API rate-limiting and backoff handling            |
| **Module**   | Sync Engine / Resilience                                     |
| **Priority** | Medium                                                          |
| **Status**   | Planned                                                            |
| **Date**     | August 2026                                                          |

---

## Description

When facing rate-limit responses (429) or transient errors (5xx) from the Dropbox API, the plugin must retry with exponential backoff instead of failing or retrying aggressively.

---

## Inputs

Dropbox API HTTP responses during the sync cycle.

---

## Process

1. Every Dropbox API request goes through a wrapper that intercepts 429/5xx codes.
2. On 429, the `Retry-After` header is honored if present; otherwise, exponential backoff with jitter is applied.
3. On 5xx, the request is retried up to a configured maximum, with exponential backoff.
4. If retries are exhausted, the operation fails visibly (RF-007), never silently.
5. The rest of the sync cycle isn't blocked by a single retrying file — other files continue when possible.

---

## Outputs

| Scenario                | Result                                                                    |
| ---------------------------| ---------------------------------------------------------------------------|
| Transient rate-limit          | Sync still completes, with delay, no user intervention needed                 |
| Persistent API failure          | Visible error in log/status; that file's sync is paused until the next cycle    |

---

## APIs / Involved components

- SyncProvider (Dropbox implementation), HTTP layer with retry/backoff

---

## Business rules

- RN-001: A 429 is never retried without backoff — it would worsen the rate-limit.
- RN-002: Max retry count and base backoff are configurable, with sensible defaults documented in `docs/{es,en}/referencia-tecnica/sync-engine.md`.
