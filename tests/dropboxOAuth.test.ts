import { describe, expect, it, vi } from "vitest";
import {
	buildAuthorizeUrl,
	exchangeCodeForTokens,
	fetchAccountEmail,
	refreshAccessToken,
	type HttpRequester,
} from "../src/auth/dropboxOAuth";

describe("buildAuthorizeUrl", () => {
	it("includes PKCE, offline access, and state params (RN-001, RN-002)", () => {
		const url = new URL(
			buildAuthorizeUrl({
				clientId: "abc123",
				codeChallenge: "challenge",
				state: "xyz",
				redirectUri: "http://localhost:53134/callback",
			}),
		);
		expect(url.origin + url.pathname).toBe("https://www.dropbox.com/oauth2/authorize");
		expect(url.searchParams.get("client_id")).toBe("abc123");
		expect(url.searchParams.get("response_type")).toBe("code");
		expect(url.searchParams.get("code_challenge")).toBe("challenge");
		expect(url.searchParams.get("code_challenge_method")).toBe("S256");
		expect(url.searchParams.get("token_access_type")).toBe("offline");
		expect(url.searchParams.get("state")).toBe("xyz");
		expect(url.searchParams.get("redirect_uri")).toBe("http://localhost:53134/callback");
	});
});

function fakeRequester(status: number, body: unknown): HttpRequester {
	return vi.fn().mockResolvedValue({ status, json: () => body });
}

describe("exchangeCodeForTokens", () => {
	it("parses a successful token response", async () => {
		const request = fakeRequester(200, {
			access_token: "at",
			refresh_token: "rt",
			expires_in: 14400,
		});
		const tokens = await exchangeCodeForTokens(
			{
				code: "c",
				codeVerifier: "v",
				clientId: "id",
				redirectUri: "http://localhost:53134/callback",
			},
			request,
		);
		expect(tokens.accessToken).toBe("at");
		expect(tokens.refreshToken).toBe("rt");
		expect(tokens.expiresAt).toBeGreaterThan(Date.now());
	});

	it("throws if Dropbox omits refresh_token (offline access not granted)", async () => {
		const request = fakeRequester(200, { access_token: "at", expires_in: 14400 });
		await expect(
			exchangeCodeForTokens(
				{
					code: "c",
					codeVerifier: "v",
					clientId: "id",
					redirectUri: "http://localhost:53134/callback",
				},
				request,
			),
		).rejects.toThrow(/refresh_token/);
	});

	it("throws on a non-200 response", async () => {
		const request = fakeRequester(400, { error: "invalid_grant" });
		await expect(
			exchangeCodeForTokens(
				{
					code: "c",
					codeVerifier: "v",
					clientId: "id",
					redirectUri: "http://localhost:53134/callback",
				},
				request,
			),
		).rejects.toThrow(/400/);
	});
});

describe("refreshAccessToken", () => {
	it("keeps the original refresh_token when Dropbox doesn't rotate it (RN-002)", async () => {
		const request = fakeRequester(200, { access_token: "at2", expires_in: 14400 });
		const tokens = await refreshAccessToken(
			{ refreshToken: "rt-original", clientId: "id" },
			request,
		);
		expect(tokens.accessToken).toBe("at2");
		expect(tokens.refreshToken).toBe("rt-original");
	});

	it("throws on a non-200 response", async () => {
		const request = fakeRequester(401, { error: "invalid_grant" });
		await expect(
			refreshAccessToken({ refreshToken: "rt", clientId: "id" }, request),
		).rejects.toThrow(/401/);
	});
});

describe("fetchAccountEmail", () => {
	it("returns the account email on success", async () => {
		const request = fakeRequester(200, { email: "user@example.com" });
		await expect(fetchAccountEmail("at", request)).resolves.toBe("user@example.com");
	});

	it("throws on a non-200 response", async () => {
		const request = fakeRequester(401, {});
		await expect(fetchAccountEmail("bad-token", request)).rejects.toThrow(/401/);
	});
});
