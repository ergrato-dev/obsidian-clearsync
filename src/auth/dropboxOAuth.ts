// RF-001 — Dropbox OAuth2 (Authorization Code + PKCE) request builders and response
// parsers. The HTTP call itself is injected (`HttpRequester`) so this stays testable
// without a network or Obsidian's requestUrl (see
// docs/{es,en}/referencia-tecnica/api-plugin-obsidian.md). Rate-limit/backoff (RF-009)
// is not applied here yet — it wraps the shared HTTP layer once implemented.
import type { DropboxTokens } from "./DropboxTokens";

export interface HttpResponse {
	status: number;
	json: () => unknown;
}

export type HttpRequester = (options: {
	url: string;
	method: "GET" | "POST";
	headers?: Record<string, string>;
	body?: string;
}) => Promise<HttpResponse>;

const AUTHORIZE_URL = "https://www.dropbox.com/oauth2/authorize";
const TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const ACCOUNT_URL = "https://api.dropboxapi.com/2/users/get_current_account";

export function buildAuthorizeUrl(params: {
	clientId: string;
	codeChallenge: string;
	state: string;
	redirectUri: string;
}): string {
	const query = new URLSearchParams({
		client_id: params.clientId,
		response_type: "code",
		code_challenge: params.codeChallenge,
		code_challenge_method: "S256",
		// Required to receive a refresh_token (RN-002).
		token_access_type: "offline",
		state: params.state,
		redirect_uri: params.redirectUri,
	});
	return `${AUTHORIZE_URL}?${query.toString()}`;
}

interface DropboxTokenApiResponse {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}

function parseTokenResponse(
	body: DropboxTokenApiResponse,
	fallbackRefreshToken?: string,
): DropboxTokens {
	const refreshToken = body.refresh_token ?? fallbackRefreshToken;
	if (!refreshToken) {
		throw new Error("Dropbox did not return a refresh_token (token_access_type=offline required).");
	}
	return {
		accessToken: body.access_token,
		refreshToken,
		expiresAt: Date.now() + body.expires_in * 1000,
	};
}

export async function exchangeCodeForTokens(
	params: { code: string; codeVerifier: string; clientId: string; redirectUri: string },
	request: HttpRequester,
): Promise<DropboxTokens> {
	const body = new URLSearchParams({
		code: params.code,
		grant_type: "authorization_code",
		client_id: params.clientId,
		code_verifier: params.codeVerifier,
		redirect_uri: params.redirectUri,
	});
	const response = await request({
		url: TOKEN_URL,
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: body.toString(),
	});
	if (response.status !== 200) {
		throw new Error(`Dropbox token exchange failed with status ${response.status}`);
	}
	return parseTokenResponse(response.json() as DropboxTokenApiResponse);
}

/** RN-002 — renews the access token without asking the user to reauthorize. */
export async function refreshAccessToken(
	params: { refreshToken: string; clientId: string },
	request: HttpRequester,
): Promise<DropboxTokens> {
	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: params.refreshToken,
		client_id: params.clientId,
	});
	const response = await request({
		url: TOKEN_URL,
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: body.toString(),
	});
	if (response.status !== 200) {
		throw new Error(`Dropbox token refresh failed with status ${response.status}`);
	}
	return parseTokenResponse(response.json() as DropboxTokenApiResponse, params.refreshToken);
}

export async function fetchAccountEmail(
	accessToken: string,
	request: HttpRequester,
): Promise<string> {
	const response = await request({
		url: ACCOUNT_URL,
		method: "POST",
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (response.status !== 200) {
		throw new Error(`Dropbox account lookup failed with status ${response.status}`);
	}
	return (response.json() as { email: string }).email;
}
