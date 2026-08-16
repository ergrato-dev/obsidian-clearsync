# RNF-006 — Availability and Resilience

<!--
  What? Non-functional requirement about behavior under network or provider API failures.
  Why? A connection or Dropbox failure must never result in vault data loss or corruption.
  Impact? User trust in a sync tool depends entirely on it never losing data.
-->

---

## Identification

| Field        | Value                        |
| ------------ | ------------------------------ |
| **ID**       | RNF-006                        |
| **Name**     | Availability and Resilience    |
| **Category** | Reliability                    |
| **Priority** | High                           |
| **Status**   | Planned                        |
| **Date**     | August 2026                    |

---

## Requirements

### RNF-006.1 — Disconnection tolerance
If the network fails mid-sync, the local vault state is never corrupted; sync retries on reconnection.

### RNF-006.2 — API failure recovery
Dropbox errors (429, 5xx) are handled with backoff (RNF-002.4) and never permanently stop the plugin.

### RNF-006.3 — No data loss
On any failure, preserving the local file version takes priority over overwriting it with an uncertain remote version.

### RNF-006.4 — Recovery from conflict
RF-010 allows restoring a previous version if auto-merge produced an undesired result.
