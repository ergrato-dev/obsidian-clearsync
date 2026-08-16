# Architectural Patterns Used in ClearSync

<!--
  What? The software design patterns structuring the plugin.
  Why? Justify architecture decisions with shared vocabulary, not just "because it felt right".
  Impact? Without these patterns, Sync Engine would end up coupled to Dropbox and RT-004/RNF-004.4 would break in practice.
-->

---

## Strategy — `SyncProvider`

The sync provider (Dropbox in the MVP) is implemented behind a `SyncProvider` interface with a common contract (`upload`, `download`, `listChanges`, `delete`, etc.). The Sync Engine only knows that interface, never Dropbox's concrete API.

**Why:** allows adding WebDAV/S3/Google Drive (future RF) by implementing a new `SyncProvider`, without touching Sync Engine, Crypto Layer, or Conflict Resolver (RT-004, RNF-004.4).

## Adapter — Dropbox API translation

`DropboxProvider` acts as an adapter between Dropbox API v2's specific semantics (pagination cursors, its own `content_hash`, particular error codes) and the generic `SyncProvider` contract expected by the rest of the system.

**Why:** isolates the details of a specific external API in a single module, instead of leaking them across the whole codebase.

## Observer — Vault events

The Sync Engine subscribes to Obsidian's `app.vault.on('create' | 'modify' | 'delete' | 'rename', callback)` events to react to local changes without constantly polling the filesystem.

**Why:** it's the native mechanism exposed by the Obsidian Plugin API — reusing it avoids reinventing file-level change detection (RT-002).

## Repository — local state (Hash Cache / Sync Log)

Access to the Hash Cache and Sync Log (RF-002, RF-007) is encapsulated behind a dedicated persistence module, instead of Sync Engine calling `this.saveData()` directly.

**Why:** allows changing the local storage mechanism in the future (e.g. moving from `saveData()` to IndexedDB if the log grows large) without touching Sync Engine's business logic (RNF-005.3).
