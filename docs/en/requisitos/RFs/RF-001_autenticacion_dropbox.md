# RF-001 — Dropbox Authentication

<!--
  What? Functional requirement defining how the plugin obtains authorized access to the user's Dropbox account.
  Why? Without secure authorization there is no way to read/write files in the user's Dropbox.
  Impact? A poorly implemented auth flow (e.g. an embedded client secret) compromises the whole account, not just the vault.
-->

---

## Identification

| Field        | Value                  |
| ------------ | ---------------------- |
| **ID**       | RF-001                 |
| **Name**     | Dropbox Authentication |
| **Module**   | Authentication         |
| **Priority** | High                   |
| **Status**   | Planned                |
| **Date**     | August 2026            |

---

## Description

The plugin must let the user authorize access to their Dropbox account via **OAuth2 with PKCE** (no embedded client secret, suitable for client apps). After authorizing, the plugin obtains and securely stores an `access_token` and a `refresh_token` to operate the Dropbox API on the user's behalf.

---

## Inputs

| Field                            | Type                 | Required | Notes                                           |
| -------------------------------- | -------------------- | -------- | ----------------------------------------------- |
| "Connect Dropbox" button         | Action               | Yes      | Triggers the OAuth2 flow from Settings          |
| `code_verifier`/`code_challenge` | Internally generated | —        | PKCE, never visible or configurable by the user |

---

## Process

1. The user clicks "Connect Dropbox" in the Settings panel.
2. The plugin generates `code_verifier` and `code_challenge` (PKCE) locally.
3. The plugin opens the system browser to Dropbox's authorization URL with the `code_challenge`.
4. The user signs in and authorizes the app in Dropbox.
5. Dropbox redirects to a local callback URL with the `authorization code`.
6. The plugin exchanges the `code` + `code_verifier` for `access_token` and `refresh_token` (without exposing a client secret).
7. Tokens are stored via Obsidian's `this.saveData()` (RS-002).
8. The plugin uses the `refresh_token` to automatically renew the `access_token` when it expires.

---

## Outputs

| Scenario                           | Result                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------- |
| Successful connection              | Settings shows "Connected as {email}" and unlocks the rest of the setup |
| User cancels/rejects authorization | Settings stays "Not connected", no blocking error                       |
| Token expired and refresh fails    | Settings shows "Session expired, reconnect" and pauses sync             |

---

## APIs / Involved components

- Dropbox OAuth2 (`/oauth2/authorize`, `/oauth2/token`)
- Obsidian: `this.saveData()`/`this.loadData()`, system browser launch

---

## Business rules

- RN-001: Implicit Grant is never used, and no client secret is ever embedded — Authorization Code + PKCE only.
- RN-002: The `refresh_token` renews the session without asking the user to reauthorize, unless explicitly revoked by the user or Dropbox.
- RN-003: If the user disconnects Dropbox from Settings, tokens are immediately removed from local storage.
