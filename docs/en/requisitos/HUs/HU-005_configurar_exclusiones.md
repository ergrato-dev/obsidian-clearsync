# HU-005 — Configure Sync Exclusions

<!--
  What? User story about excluding folders/files from the sync process.
  Why? Not all vault content needs to (or should) be synced.
  Impact? Without exclusion control, the user is forced to upload unnecessary or sensitive content.
-->

---

## Identification

| Field           | Value                     |
| --------------- | ------------------------- |
| **ID**          | HU-005                    |
| **Title**       | Configure sync exclusions |
| **Module**      | Configuration             |
| **Priority**    | Medium                    |
| **Status**      | Planned                   |
| **Related RFs** | RF-008                    |

---

## Story

**As** a user with heavy or sensitive folders in my vault,
**I want** to exclude folders or file patterns from sync,
**so that** I control what content gets uploaded to the cloud.

---

## Acceptance criteria

### CA-005.1 — Add exclusion pattern

- **Given** I'm in Settings > ClearSync,
- **when** I add a pattern like `attachments/videos/**`,
- **then** it gets saved in the exclusion list.

### CA-005.2 — Syntax validation

- **Given** I enter an invalid glob pattern,
- **when** I try to save it,
- **then** I see a syntax error before it's applied.

### CA-005.3 — Local config excluded by default

- **Given** I haven't touched the exclusion settings,
- **when** I check the list,
- **then** `.obsidian/` is already excluded by default.

### CA-005.4 — Excluded files aren't uploaded

- **Given** I added an exclusion pattern,
- **when** the next sync runs,
- **then** matching files aren't transferred.

### CA-005.5 — Excluding doesn't delete what's already synced

- **Given** I exclude a folder that was already synced,
- **when** I check the remote,
- **then** the previously uploaded files remain there until I delete them manually.
