// RF-005 — orchestrates salt + key derivation + encrypt/decrypt behind one API. The
// derived CryptoKey lives only in memory (non-extractable, RS-001) — `unlock()` must
// be called again (e.g. on plugin reload) before encrypting/decrypting anything.
import type { SaltStore } from "./SaltStore";
import { deriveKey } from "./deriveKey";
import { decrypt, encrypt, type EncryptedPayload } from "./encryption";

export class EncryptionNotUnlockedError extends Error {
	constructor() {
		super("Encryption key not set — call unlock() with the vault password first.");
		this.name = "EncryptionNotUnlockedError";
	}
}

export class EncryptionManager {
	private key: CryptoKey | undefined;

	constructor(private readonly saltStore: SaltStore) {}

	/** RF-006 setup step: derives and holds the key for this session. */
	async unlock(password: string): Promise<void> {
		const salt = await this.saltStore.getOrCreate();
		this.key = await deriveKey(password, salt);
	}

	isUnlocked(): boolean {
		return this.key !== undefined;
	}

	async encryptContent(plaintext: string | ArrayBuffer): Promise<EncryptedPayload> {
		if (!this.key) throw new EncryptionNotUnlockedError();
		return encrypt(plaintext, this.key);
	}

	/** Throws DecryptionError (see encryption.ts) on a wrong password or corrupted data. */
	async decryptContent(payload: EncryptedPayload): Promise<ArrayBuffer> {
		if (!this.key) throw new EncryptionNotUnlockedError();
		return decrypt(payload, this.key);
	}
}
