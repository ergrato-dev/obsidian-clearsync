# Obsidian Plugin API Surface Used — ClearSync

<!--
  What? Which specific parts of the Obsidian Plugin API the plugin uses (or will use).
  Why? Bound the API surface so nothing depends on anything outside what's documented (RT-002).
  Impact? Using an API not listed here without updating this document breaks RO-003's traceability.
-->

> Note: exact class/method names must be verified against the `obsidian.d.ts` of the Obsidian version current at implementation time — this document fixes intent, not final code.

---

## Plugin lifecycle

| API                                 | Use in ClearSync                                                       |
| --------------------------------------| ------------------------------------------------------------------------- |
| `Plugin.onload()`                        | Registers the Settings tab, status bar item, Vault listeners, starts Sync Engine |
| `Plugin.onunload()`                       | Cleanly stops listeners and any in-progress sync                              |
| `this.saveData()` / `this.loadData()`       | Persists OAuth tokens (RS-002), hash cache, exclusion configuration              |

## Vault

| API                                       | Use in ClearSync                                                     |
| ---------------------------------------------| ---------------------------------------------------------------------- |
| `app.vault.getFiles()` / `getAbstractFileByPath()` | Initial vault walk for the first sync (RF-002, RF-006)                    |
| `app.vault.read()` / `app.vault.cachedRead()`  | Reading content to hash/encrypt                                          |
| `app.vault.create()` / `modify()` / `delete()` | Applying remote changes locally, creating conflicted copies (RF-004)       |
| `app.vault.on('create' \| 'modify' \| 'delete' \| 'rename', callback)` | Reactive triggers for the Sync Engine (Observer pattern) |

## UI

| API                            | Use in ClearSync                                        |
| -----------------------------------| -------------------------------------------------------------|
| `PluginSettingTab` + `Setting`       | Settings panel: account, encryption, exclusions, language, log (RF-006, RF-008, RF-011) |
| `Plugin.addStatusBarItem()`           | Idle/syncing/error/conflict status icon (RF-007)                |
| `Notice`                               | Error/conflict notifications (RF-007)                             |

## Network

| API                    | Use in ClearSync                                                                |
| ---------------------------| --------------------------------------------------------------------------------------|
| `requestUrl()`                | Calls to the Dropbox API — avoids the CORS restrictions of standard `fetch` inside Obsidian (RF-001, RF-009) |

## Manifest and compatibility

| Field (`manifest.json`) | Use                                                                    |
| ----------------------------| ---------------------------------------------------------------------------|
| `id`                          | `clearsync`                                                                  |
| `minAppVersion`                | Minimum supported Obsidian version (RNF-004.3), to be pinned during implementation |
| `isDesktopOnly`                 | `true` in v1 (RNF-004.1, RF-012 is future work)                                |

## Explicitly out of scope

- No access to Node.js `fs`/`path`/`child_process` — all I/O goes through `Vault`/`Adapter` (RT-002).
- No direct `fetch()` for Dropbox calls — Obsidian's `requestUrl()` is used instead.
