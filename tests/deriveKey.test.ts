import { describe, expect, it } from "vitest";
import { deriveKey } from "../src/crypto/deriveKey";
import { encrypt, decrypt, DecryptionError } from "../src/crypto/encryption";
import { generateSalt } from "../src/crypto/salt";

describe("deriveKey", () => {
	it("produces a non-extractable AES-GCM key usable for encrypt/decrypt", async () => {
		const salt = generateSalt();
		const key = await deriveKey("correct horse battery staple", salt);
		expect(key.extractable).toBe(false);
		expect(key.algorithm.name).toBe("AES-GCM");

		const payload = await encrypt("hello vault", key);
		await expect(decrypt(payload, key)).resolves.toBeInstanceOf(ArrayBuffer);
	});

	it("re-derives the same usable key from the same password + salt (second device, HU-002 CA-002.4)", async () => {
		const salt = generateSalt();
		const keyA = await deriveKey("shared-password", salt);
		const keyB = await deriveKey("shared-password", salt);

		const payload = await encrypt("shared content", keyA);
		const decrypted = await decrypt(payload, keyB);
		expect(new TextDecoder().decode(decrypted)).toBe("shared content");
	});

	it("derives an unusable key from a different password (HU-002 CA-002.5)", async () => {
		const salt = generateSalt();
		const rightKey = await deriveKey("right-password", salt);
		const wrongKey = await deriveKey("wrong-password", salt);

		const payload = await encrypt("secret", rightKey);
		await expect(decrypt(payload, wrongKey)).rejects.toThrow(DecryptionError);
	});

	it("derives a different key from the same password with a different salt", async () => {
		const keyA = await deriveKey("same-password", generateSalt());
		const keyB = await deriveKey("same-password", generateSalt());

		const payload = await encrypt("secret", keyA);
		await expect(decrypt(payload, keyB)).rejects.toThrow(DecryptionError);
	});
});
