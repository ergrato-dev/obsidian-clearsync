# Development Environment Setup

<!--
  What? How to set up a local environment to develop and test ClearSync inside Obsidian.
  Why? Any new contributor should get the plugin running in dev mode without guessing steps.
  Impact? Without this, every contributor reinvents their own manual testing flow, with inconsistent results.
-->

> This document describes the intended flow for once code exists (`RO-003`: we're still in the documentation phase). It will be updated with exact steps once implementation starts.

---

## Prerequisites

- Node.js (current LTS)
- **pnpm** (RH-001 — the only allowed package manager)
- An [Obsidian](https://obsidian.md) install with a test vault (never use your real vault for development)

## Clone and prepare

```bash
git clone https://github.com/ergrato-dev/obsidian-clearsync.git
cd obsidian-clearsync
pnpm install
```

## Link the plugin to a test vault

Obsidian loads plugins from `<vault>/.obsidian/plugins/<plugin-id>/`. The standard community-plugin flow is to symlink the build folder to that path:

```bash
ln -s "$(pwd)/dist" "/path/to/your-test-vault/.obsidian/plugins/clearsync"
```

## Development mode (watch + rebuild)

```bash
pnpm run dev
```

This runs esbuild in watch mode, regenerating `main.js` in `dist/` on every change. To see changes reflected:

- Manually reload Obsidian (`Ctrl/Cmd + R` with the developer console open), or
- Install the community **Hot Reload** plugin in your test vault, which auto-reloads plugins when it detects changes in `dist/`.

## Tests and coverage

```bash
pnpm test          # runs the Vitest suite
pnpm run coverage   # generates a coverage report — must be ≥85% (RNF-005.1)
```

## Lint and format

```bash
pnpm run lint    # ESLint
pnpm run format   # Prettier
```

## Before opening a PR

1. `pnpm run lint && pnpm test` must pass with no errors.
2. If the change implements an RF, that RF must already exist and be approved under `docs/{es,en}/requisitos/RFs/` (RO-003).
3. The commit follows Conventional Commits with a What/Why/Impact body (RO-002) — see the `commit-message` skill under `.claude/skills/`.
