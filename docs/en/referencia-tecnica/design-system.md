# Design System — Settings UI

<!--
  What? How the visual design constraints (RD-001..003) apply inside the plugin.
  Why? Distinguish brand identity (public assets) from correct plugin behavior inside Obsidian.
  Impact? Forcing a dark theme inside the Settings panel, ignoring the user's theme, is an anti-pattern that breaks Obsidian's native experience.
-->

---

## Scope of RD-001..003

The visual design constraints (`docs/en/requisitos/restricciones.md`, section 3) split into two distinct scopes:

| Scope                           | Where it applies                                     | How it applies                                                                                             |
| ------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Brand identity**              | `assets/banner.svg`, plugin icon, README screenshots | Fixed flat dark theme, violet accent `#7c3aed`, no gradients (RD-001, RD-002)                              |
| **Settings UI inside Obsidian** | The plugin's configuration panel                     | Respects the user's active theme (light or dark) via Obsidian's CSS variables — **never forces dark mode** |

A plugin that ignores the host theme and forces its own dark theme inside the Settings panel breaks Obsidian's visual coherence and is a poor community-plugin practice.

## Settings UI — components

Built with Obsidian's native `Setting` API (`PluginSettingTab`), which already inherits the active theme automatically:

- **Account section** — Dropbox connection status, connect/disconnect button (RF-001).
- **Encryption section** — set/change encryption password, loss-of-access warning (RF-005, RF-006).
- **Sync section** — remote folder, exclusion patterns (RF-008), "Sync now" button.
- **Language section** — Automatic/Español/English selector (RF-011).
- **Log panel** — sync operation history (RF-007), using Obsidian's semantic color variables (`--text-success`, `--text-error`, `--text-warning`) for status, never hardcoded colors.

## Status bar icon

A simple monochrome icon (idle/syncing/error/conflict) using `currentColor`/Obsidian's variables to inherit the active theme's text color — the brand's violet accent (`#7c3aed`) is reserved for elements that are actually "brand" (e.g. a badge icon in the README), not the functional UI inside Obsidian.

## Typography

The entire Settings UI uses the active Obsidian theme's typography (inherited, no custom `font-family`) — this satisfies RD-003 (sans-serif) because virtually every Obsidian theme defaults to sans-serif, and the plugin must not impose a different font than the rest of the app.
