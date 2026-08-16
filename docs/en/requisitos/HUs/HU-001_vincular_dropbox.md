# HU-001 — Link Dropbox Account

<!--
  What? User story about connecting the Dropbox account from the plugin.
  Why? It's the mandatory first step for ClearSync to operate at all.
  Impact? Without a clear, trustworthy connection flow, the user can't move on to any other plugin flow.
-->

---

## Identification

| Field         | Value               |
| ---------------| ----------------------|
| **ID**         | HU-001                 |
| **Title**      | Link Dropbox account     |
| **Module**     | Authentication              |
| **Priority**   | High                          |
| **Status**     | Planned                         |
| **Related RFs**| RF-001                            |

---

## Story

**As** an Obsidian user,
**I want** to connect my Dropbox account from the plugin settings,
**so that** ClearSync can sync my vault without me handling tokens manually.

---

## Acceptance criteria

### CA-001.1 — Connect button visible
- **Given** I open Settings > ClearSync with no active connection,
- **when** I look at the account section,
- **then** I find a clearly visible "Connect Dropbox" button.

### CA-001.2 — Browser authorization flow
- **Given** I click "Connect Dropbox",
- **when** the flow starts,
- **then** my system browser opens on Dropbox's authorization page.

### CA-001.3 — Connection confirmation
- **Given** I authorize the app in Dropbox,
- **when** I return to Obsidian,
- **then** Settings shows "Connected as {email}".

### CA-001.4 — Cancellation with no blocking error
- **Given** I cancel authorization in Dropbox,
- **when** I return to Obsidian,
- **then** Settings stays "Not connected" with no alarming error message.

### CA-001.5 — Explicit disconnection
- **Given** I'm already connected,
- **when** I click "Disconnect",
- **then** my tokens are removed locally and sync stops.

### CA-001.6 — Reconnection after expiration
- **Given** my session expired and automatic refresh failed,
- **when** I open Settings,
- **then** I see "Session expired, reconnect" with a button to reauthorize.
