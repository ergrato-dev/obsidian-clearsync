// RF-005 / RT-005 — derives a non-extractable AES-256-GCM key from the user's
// encryption password via PBKDF2. The password is never persisted (RS-001); only the
// salt is (see SaltStore) — the same password + salt always re-derives the same key,
// which is how a second device joins an existing vault (HU-002 CA-002.4/CA-002.5).
import { AES_KEY_LENGTH_BITS, PBKDF2_ITERATIONS } from "./params";

export async function deriveKey(
	password: string,
	salt: Uint8Array<ArrayBuffer>,
): Promise<CryptoKey> {
	const passwordKey = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveKey"],
	);
	return crypto.subtle.deriveKey(
		{ name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
		passwordKey,
		{ name: "AES-GCM", length: AES_KEY_LENGTH_BITS },
		false, // non-extractable — key material can never be read back out or logged
		["encrypt", "decrypt"],
	);
}
