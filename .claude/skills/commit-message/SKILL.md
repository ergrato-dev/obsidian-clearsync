---
name: commit-message
description: >
  Generates a Conventional Commits message with a What/Why/Impact body for ClearSync,
  per RO-002. Use when the user asks to "write a commit message", "commit this",
  "generar un commit", or before creating a commit in this repo.
---

Follow RO-002 (`docs/{es,en}/requisitos/restricciones.md`): every commit uses
Conventional Commits, with a body covering **What**, **Why**, and **Impact** — not
just a summary of the diff.

## Format

```
<type>(<scope>): <imperative summary, ≤72 chars>

What: <what changed, one or two sentences>
Why: <why this change was needed — the actual motivation, not "to improve X">
Impact: <what this unblocks, fixes, or changes for users/contributors>
```

`<type>`: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `security`.
`<scope>` (optional): the module — `sync-engine`, `crypto`, `settings-ui`,
`dropbox-provider`, `docs`, etc.

## Rules

- Code changes: reference the RF/RNF the change implements or fixes, e.g.
  `Impact: implements RF-003 automatic three-way merge.`
- Docs-only changes: still use `docs:` type, still fill What/Why/Impact — a docs
  change has a reason too, not just a description of what got added.
- Never mention that an AI generated the commit inside the subject line — that
  belongs in the trailer (`Co-Authored-By:`), not the message body.
- Keep the subject imperative ("add", not "added"/"adds").
