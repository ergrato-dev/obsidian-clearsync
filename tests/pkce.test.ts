import { describe, expect, it } from "vitest";
import { generateCodeChallenge, generateCodeVerifier, generateState } from "../src/auth/pkce";

describe("generateCodeVerifier", () => {
	it("produces a verifier within RFC 7636's 43-128 char range using only unreserved chars", () => {
		const verifier = generateCodeVerifier();
		expect(verifier.length).toBeGreaterThanOrEqual(43);
		expect(verifier.length).toBeLessThanOrEqual(128);
		expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
	});

	it("is not deterministic across calls", () => {
		expect(generateCodeVerifier()).not.toBe(generateCodeVerifier());
	});
});

describe("generateState", () => {
	it("produces a non-empty hex string that differs across calls", () => {
		const a = generateState();
		const b = generateState();
		expect(a).toMatch(/^[0-9a-f]+$/);
		expect(a).not.toBe(b);
	});
});

describe("generateCodeChallenge", () => {
	it("matches the RFC 7636 appendix B test vector", async () => {
		const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
		const challenge = await generateCodeChallenge(verifier);
		expect(challenge).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
	});

	it("produces a URL-safe string with no padding", async () => {
		const challenge = await generateCodeChallenge(generateCodeVerifier());
		expect(challenge).not.toMatch(/[+/=]/);
	});
});
