// RF-001 — PKCE (RFC 7636) helpers. No client secret is ever used (RN-001);
// `code_challenge`/`code_verifier` are the only mechanism proving the token exchange
// comes from the same client that started the flow.

const VERIFIER_LENGTH = 64; // RFC 7636 requires 43-128 characters
const UNRESERVED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

export function generateCodeVerifier(): string {
	const bytes = new Uint8Array(VERIFIER_LENGTH);
	crypto.getRandomValues(bytes);
	let verifier = "";
	for (const byte of bytes) {
		verifier += UNRESERVED_CHARS[byte % UNRESERVED_CHARS.length];
	}
	return verifier;
}

/** CSRF/callback-correlation token, sent as OAuth `state` and checked on the redirect. */
export function generateState(): string {
	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function base64UrlEncode(bytes: ArrayBuffer): string {
	const binary = String.fromCharCode(...new Uint8Array(bytes));
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
	const data = new TextEncoder().encode(verifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return base64UrlEncode(digest);
}
