// RF-005 — AES-256-GCM encrypt/decrypt. Never uploads unencrypted content (RT-005,
// RS-004); decryption failure is always explicit, never silently corrupted output
// (RF-005 step 6, HU-002 CA-002.5).
import { IV_LENGTH_BYTES } from "./params";

export interface EncryptedPayload {
	ciphertext: ArrayBuffer;
	iv: Uint8Array<ArrayBuffer>;
}

export class DecryptionError extends Error {
	constructor() {
		super("Could not decrypt: wrong encryption password or corrupted data.");
		this.name = "DecryptionError";
	}
}

export async function encrypt(
	plaintext: string | ArrayBuffer,
	key: CryptoKey,
): Promise<EncryptedPayload> {
	const data = typeof plaintext === "string" ? new TextEncoder().encode(plaintext) : plaintext;
	const iv = new Uint8Array(IV_LENGTH_BYTES);
	crypto.getRandomValues(iv);
	const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
	return { ciphertext, iv };
}

export async function decrypt(payload: EncryptedPayload, key: CryptoKey): Promise<ArrayBuffer> {
	try {
		return await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: payload.iv },
			key,
			payload.ciphertext,
		);
	} catch {
		// GCM authentication tag mismatch (wrong key or corrupted ciphertext) throws a
		// generic OperationError — normalize it to a typed, explicit failure.
		throw new DecryptionError();
	}
}
