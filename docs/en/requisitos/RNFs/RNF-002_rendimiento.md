# RNF-002 — Performance

<!--
  What? Non-functional requirement about sync efficiency.
  Why? Avoid the excessive battery/CPU usage and full re-scans that hurt alternatives like Livesync.
  Impact? A slow or heavy sync makes users disable the plugin, regardless of how secure the implementation is.
-->

---

## Identification

| Field        | Value       |
| ------------ | ----------- |
| **ID**       | RNF-002     |
| **Name**     | Performance |
| **Category** | Performance |
| **Priority** | High        |
| **Status**   | Planned     |
| **Date**     | August 2026 |

---

## Requirements

### RNF-002.1 — Incremental sync

The vault is never fully re-scanned. Change detection uses content hashing against the last known state (RT-006).

### RNF-002.2 — No UI blocking

Sync operations run asynchronously and never block Obsidian's main thread.

### RNF-002.3 — File size threshold

The plugin warns about or lets the user configure a size threshold for large attachments before uploading them.

### RNF-002.4 — Backoff on rate-limiting

On Dropbox API rate-limit responses, the plugin waits with exponential backoff instead of retrying aggressively (see RF-009).

### RNF-002.5 — Operation batching

Multiple small changes are grouped into a single sync pass instead of one request per file.
