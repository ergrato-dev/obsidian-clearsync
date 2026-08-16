# RNF-004 — Compatibility and Portability

<!--
  What? Non-functional requirement about cross-platform support and readiness for future mobile.
  Why? Avoid v1 technical decisions that would block the mobile support already documented as a future RF.
  Impact? Rewriting I/O later to support mobile is costly if it isn't designed well from the start.
-->

---

## Identification

| Field        | Value                        |
| ------------ | ------------------------------ |
| **ID**       | RNF-004                        |
| **Name**     | Compatibility and Portability  |
| **Category** | Compatibility                  |
| **Priority** | Medium                         |
| **Status**   | Planned                        |
| **Date**     | August 2026                    |

---

## Requirements

### RNF-004.1 — Cross-platform desktop
The plugin behaves identically on Windows, macOS and Linux via Obsidian desktop.

### RNF-004.2 — No OS-specific APIs
All I/O goes through Obsidian's `Vault`/`Adapter`, never direct Node `fs`, so future mobile portability isn't blocked (RT-002, RF-012).

### RNF-004.3 — Minimum supported Obsidian version
`minAppVersion` is defined and documented in `manifest.json`.

### RNF-004.4 — Provider-extensible architecture
The decoupled `SyncProvider` interface allows adding WebDAV/S3/Google Drive without breaking the core (see RT-004).
