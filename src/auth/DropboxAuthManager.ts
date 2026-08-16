// RF-001 — orchestrates the full connect/disconnect/refresh flow. pkce.ts,
// dropboxOAuth.ts, CallbackServer.ts and TokenStore.ts each have their own unit tests;
// this glue (real network, real browser window) is exercised manually per
// docs/{es,en}/setup/desarrollo.md — same rationale as SettingsTab.ts (see
// vitest.config.ts coverage excludes).
import { requestUrl } from "obsidian";
import { generateCodeChallenge, generateCodeVerifier, generateState } from "./pkce";
import {
	buildAuthorizeUrl,
	exchangeCodeForTokens,
	fetchAccountEmail,
	refreshAccessToken,
	type HttpRequester,
} from "./dropboxOAuth";
import { waitForAuthorizationCode } from "./CallbackServer";
import type { TokenStore } from "./TokenStore";
import type { DropboxTokens } from "./DropboxTokens";
import { DROPBOX_CLIENT_ID, DROPBOX_REDIRECT_PORT, DROPBOX_REDIRECT_URI } from "./dropboxConfig";

const REFRESH_MARGIN_MS = 60_000;

/** CA-001.6 — thrown when the refresh token itself is no longer valid; callers should
 * surface `settings.account.sessionExpired` and prompt reconnection. */
export class DropboxSessionExpiredError extends Error {
	constructor() {
		super("Dropbox session expired; the user must reconnect.");
		this.name = "DropboxSessionExpiredError";
	}
}

const obsidianRequester: HttpRequester = async ({ url, method, headers, body }) => {
	const response = await requestUrl({ url, method, headers, body, throw: false });
	return { status: response.status, json: () => response.json };
};

export class DropboxAuthManager {
	constructor(private readonly tokenStore: TokenStore) {}

	async isConnected(): Promise<boolean> {
		return (await this.tokenStore.get()) !== undefined;
	}

	/** RF-001 steps 1-8: PKCE, system browser, local callback, token exchange. */
	async connect(): Promise<DropboxTokens> {
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		const state = generateState();

		const callback = waitForAuthorizationCode({
			port: DROPBOX_REDIRECT_PORT,
			expectedState: state,
		});
		const authorizeUrl = buildAuthorizeUrl({
			clientId: DROPBOX_CLIENT_ID,
			codeChallenge,
			state,
			redirectUri: DROPBOX_REDIRECT_URI,
		});
		window.open(authorizeUrl, "_blank");

		const code = await callback.promise;
		const tokens = await exchangeCodeForTokens(
			{ code, codeVerifier, clientId: DROPBOX_CLIENT_ID, redirectUri: DROPBOX_REDIRECT_URI },
			obsidianRequester,
		);
		const accountEmail = await fetchAccountEmail(tokens.accessToken, obsidianRequester);

		const stored: DropboxTokens = { ...tokens, accountEmail };
		await this.tokenStore.set(stored);
		return stored;
	}

	/** RN-003 — removes tokens immediately, no confirmation round-trip to Dropbox needed. */
	async disconnect(): Promise<void> {
		await this.tokenStore.clear();
	}

	/** RN-002 — refreshes automatically; callers should invoke this before any Dropbox API use. */
	async ensureFreshAccessToken(): Promise<string> {
		const tokens = await this.tokenStore.get();
		if (!tokens) throw new Error("Dropbox is not connected.");
		if (tokens.expiresAt > Date.now() + REFRESH_MARGIN_MS) return tokens.accessToken;

		try {
			const refreshed = await refreshAccessToken(
				{ refreshToken: tokens.refreshToken, clientId: DROPBOX_CLIENT_ID },
				obsidianRequester,
			);
			const stored: DropboxTokens = { ...refreshed, accountEmail: tokens.accountEmail };
			await this.tokenStore.set(stored);
			return stored.accessToken;
		} catch {
			// CA-001.6 — the refresh token itself was revoked/expired: clear local state so
			// Settings falls back to "not connected" and prompts the user to reconnect.
			await this.tokenStore.clear();
			throw new DropboxSessionExpiredError();
		}
	}
}
