---
name: new-sync-provider
description: >
  Checklist for implementing a new SyncProvider (e.g. WebDAV, S3, Google Drive) in
  ClearSync, respecting the Strategy pattern interface and the project's security/RNF
  constraints. Use when the user asks to "add a new sync provider", "implement WebDAV
  support", "agregar un proveedor de sync", or similar.
---

ClearSync's MVP supports Dropbox only (RT-004), behind a `SyncProvider` interface
designed for exactly this kind of extension (RNF-004.4). Before writing code:

## Before implementing

1. Confirm a corresponding RF exists and is approved (RO-003) — if not, run the
   `new-rf` skill first to document it (scope, auth model, provider-specific
   constraints).
2. Read `docs/{es,en}/referencia-tecnica/architecture.md` and `sync-engine.md` to
   understand the `SyncProvider` contract and where encryption/hashing happen in the
   pipeline — the new provider must plug into that pipeline unchanged, not bypass it.

## Implementation checklist

- [ ] Implement the full `SyncProvider` interface (upload, download, listChanges,
      delete, etc.) — no partial implementations that leak provider-specific calls
      into Sync Engine, Crypto Layer, or Conflict Resolver (Strategy pattern, RT-004).
- [ ] Auth flow uses OAuth2 (or the provider's equivalent) with no embedded secrets,
      following the same pattern as RF-001 (RS-001).
- [ ] All I/O goes through the provider's HTTP API — never Node.js `fs` directly
      (RT-002, keeps the door open for RF-012 mobile support).
- [ ] Rate-limit/backoff handling equivalent to RF-009 — check the provider's specific
      rate-limit response format (headers, status codes) and adapt, don't assume
      Dropbox's exact semantics.
- [ ] Content encryption (RF-005) happens **before** this provider ever sees the
      content — the provider never receives plain text, regardless of which cloud
      service it targets (RS-004, threat model: no cloud provider is trusted).
- [ ] Unit tests covering upload/download/error paths, meeting the 85% minimum
      coverage bar (RNF-005.1).
- [ ] Update `docs/{es,en}/referencia-tecnica/architecture.md` to list the new
      provider alongside `DropboxProvider`.

## After implementing

Update the relevant RF's "Estado" field from "Planificado" to "Implementado" in both
`docs/es/` and `docs/en/`, per the project's requirement-tracking convention.
