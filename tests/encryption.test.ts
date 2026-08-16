import { describe, expect, it } from "vitest";
import { decrypt, encrypt, DecryptionError } from "../src/crypto/encryption";
import { deriveKey } from "../src/crypto/deriveKey";
import { generateSalt } from "../src/crypto/salt";

async function testKey(): Promise<CryptoKey> {
	return deriveKey("test-password", generateSalt());
}

describe("encrypt/decrypt", () => {
	it("round-trips string content", async () => {
		const key = await testKey();
		const payload = await encrypt("El veloz murciélago hindú comía feliz cardillo.", key);
		const decrypted = await decrypt(payload, key);
		expect(new TextDecoder().decode(decrypted)).toBe(
			"El veloz murciélago hindú comía feliz cardillo.",
		);
	});

	it("round-trips ArrayBuffer content", async () => {
		const key = await testKey();
		const original = new TextEncoder().encode("binary-ish content").buffer;
		const payload = await encrypt(original, key);
		const decrypted = await decrypt(payload, key);
		expect(new Uint8Array(decrypted)).toEqual(new Uint8Array(original));
	});

	it("uses a fresh IV each time, producing different ciphertext for identical content", async () => {
		const key = await testKey();
		const a = await encrypt("same content", key);
		const b = await encrypt("same content", key);
		expect(a.iv).not.toEqual(b.iv);
		expect(new Uint8Array(a.ciphertext)).not.toEqual(new Uint8Array(b.ciphertext));
	});

	it("throws DecryptionError when the ciphertext was tampered with (GCM auth tag)", async () => {
		const key = await testKey();
		const payload = await encrypt("integrity matters", key);
		const tampered = new Uint8Array(payload.ciphertext);
		tampered[0] = tampered[0]! ^ 0xff;
		await expect(decrypt({ ciphertext: tampered.buffer, iv: payload.iv }, key)).rejects.toThrow(
			DecryptionError,
		);
	});

	it("never throws a raw DOMException — always the typed DecryptionError", async () => {
		const key = await testKey();
		const payload = await encrypt("x", key);
		const wrongIv = new Uint8Array(payload.iv).fill(0);
		try {
			await decrypt({ ciphertext: payload.ciphertext, iv: wrongIv }, key);
			expect.unreachable("expected decrypt to throw");
		} catch (error) {
			expect(error).toBeInstanceOf(DecryptionError);
		}
	});
});
