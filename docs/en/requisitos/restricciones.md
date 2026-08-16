# Project Constraints — ClearSync

<!--
  What? Document defining the technical, organizational and security constraints of the project.
  Why? Establish the non-negotiable limits and conditions under which the plugin is built.
  Impact? Violating a constraint can compromise security, portability, or community adoption of the plugin.
-->

---

## 1. Technology Constraints

### RT-001 — Language and typing
The plugin must be built in **TypeScript** in strict mode (`strict: true`). No untyped JavaScript is allowed.

### RT-002 — Platform
The plugin must be implemented exclusively on top of the **Obsidian Plugin API** (`obsidian.d.ts`). No access to Node.js/filesystem APIs outside those exposed by Obsidian's `Vault`/`Adapter` is allowed, to avoid compromising future mobile portability (RF-012).

### RT-003 — Bundler
The build must use **esbuild**, following the standard pattern of the Obsidian community plugins (`esbuild.config.mjs`).

### RT-004 — MVP sync provider
The MVP must support **Dropbox only** (API v2, OAuth2 + PKCE) behind the `SyncProvider` interface. No other providers are implemented in v1; they remain as future RFs without blocking the interface.

### RT-005 — Encryption
End-to-end encryption must be implemented with **AES-256-GCM**, with a key derived from the user's password via **PBKDF2** or **scrypt** (Web Crypto API, no custom crypto libraries). Uploading unencrypted vault content is not allowed.

### RT-006 — Change detection
Change detection must be based on **content hashing** (e.g. SHA-256), never solely on `mtime`. See `docs/{es,en}/referencia-tecnica/sync-engine.md`.

---

## 2. Tooling and Environment Constraints

### RH-001 — Package manager
Dependencies must be managed exclusively with **pnpm**. `npm` or `yarn` are prohibited.

### RH-002 — Linter and formatter
**ESLint** + **Prettier**, standard Obsidian community plugin configuration.

### RH-003 — Testing
**Vitest** for unit tests, mandatory for: hashing logic, three-way merge, encryption/decryption, conflict handling. Minimum coverage **85%**, enforced in CI (see RNF-005.1).

---

## 3. Visual Design Constraints

### RD-001 — No gradients
Gradients are prohibited in any asset or UI element (banner, icons, Settings UI). Backgrounds and colors are always solid and flat.

### RD-002 — Dark theme by default
The project's visual identity (brand assets, Settings UI) uses a flat dark background as its base, with a single solid accent color (violet `#7c3aed`) — no unjustified multi-color palettes.

### RD-003 — Sans-serif typography only
Only **sans-serif** typefaces are allowed in any project asset or UI. Serif or ornamental fonts are prohibited; monospace is allowed only in code blocks.

---

## 4. Language Constraints

### RI-001 — Code in English
Variables, functions, classes, code file/folder names, internal endpoints, commit messages and branch names: **English**.

### RI-002 — Bilingual documentation (Spanish + English)
Public-facing documentation (`docs/`, README) must be maintained in **both Spanish and English**, mirrored under `docs/es/` and `docs/en/`. Internal agent instructions and engineering logs (`CLAUDE.md`, `AUDITORIA.md`, `BITACORA.md`) remain Spanish-only.

### RI-003 — Bilingual UI (i18n)
The entire visible plugin interface (Settings, notifications, status messages) must support **Spanish and English** from v1, with no hardcoded strings outside the i18n system. See RF-011 and RNF-003.

---

## 5. Organizational Constraints

### RO-001 — Open source project
**MIT** license. Must be compatible with the official Obsidian community plugins directory.

### RO-002 — Conventional Commits
All commits follow **Conventional Commits**, with a body including What, Why and Impact.

### RO-003 — Documentation before code
No RF is implemented without its corresponding document in `docs/{es,en}/requisitos/` reviewed and approved first.

### RO-004 — No proprietary backend
The plugin is a pure client; no proprietary infrastructure is operated. The "server" is the user's own cloud account (Dropbox or a future provider).

---

## 6. Security Constraints

### RS-001 — No hardcoded secrets
OAuth tokens and derived keys are never hardcoded nor logged.

### RS-002 — Token storage
Dropbox tokens are stored using the plugin's local storage mechanism (Obsidian's `this.saveData()`), never in plain text visible in exportable configuration without encryption.

### RS-003 — No telemetry
The plugin does not send usage data or analytics to third-party services.

### RS-004 — Confidentiality against the cloud provider
The sync provider (Dropbox or other) must never receive unencrypted vault content — the threat model assumes the cloud provider is not trusted.
