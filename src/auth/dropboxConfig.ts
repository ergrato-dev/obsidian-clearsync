// RF-001 — Dropbox app registration constants.
//
// TODO(maintainer): register a "Scoped access" app at
// https://www.dropbox.com/developers/apps with the minimum scopes needed
// (files.content.write, files.content.read — RNF-001.5/A05 least privilege), add
// `DROPBOX_REDIRECT_URI` below to its allowed redirect URIs, then replace
// `DROPBOX_CLIENT_ID`. The App Key is safe to embed publicly — PKCE removes the need
// for a client secret (RN-001).
export const DROPBOX_CLIENT_ID = "REPLACE_WITH_DROPBOX_APP_KEY";

// Dropbox requires an exact, pre-registered redirect URI — the port must be fixed,
// not OS-assigned, so it can be registered in the App Console ahead of time.
export const DROPBOX_REDIRECT_PORT = 53134;
export const DROPBOX_REDIRECT_URI = `http://localhost:${DROPBOX_REDIRECT_PORT}/callback`;
