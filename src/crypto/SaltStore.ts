// RF-005 — persists the PBKDF2 salt (not secret on its own, unlike the password)
// through the shared PluginDataStore, same Repository pattern as TokenStore/HashCache.
//
// IMPORTANT (found while implementing RF-006, see AUDITORIA.md): this local store is a
// *cache*, not the source of truth, for any device other than the one that created the
// vault. The derived key depends on password + salt — if two devices each generate
// their own random salt for the same password, they derive *different* keys and can
// never decrypt each other's content. For "link to existing vault" (HU-002 CA-002.4),
// the salt must be fetched from the remote vault and written here via `set()` — never
// via `getOrCreate()`, which fabricates a new local salt when none exists yet.
// `getOrCreate()` is only correct on the "new vault" path (RF-006 CA-002.6), where this
// device is the first to ever set a password. Remote salt storage/fetch needs a
// SyncProvider and isn't implemented yet.
import type { PluginDataStore } from "../storage/PluginDataStore";
import type { PluginDataShape } from "../storage/schema";
import { generateSalt } from "./salt";

function toBase64(bytes: Uint8Array<ArrayBuffer>): string {
	return btoa(String.fromCharCode(...bytes));
}

function fromBase64(base64: string): Uint8Array<ArrayBuffer> {
	return new Uint8Array(
		atob(base64)
			.split("")
			.map((char) => char.charCodeAt(0)),
	);
}

export class SaltStore {
	constructor(private readonly dataStore: PluginDataStore<PluginDataShape>) {}

	/** Returns the existing salt, or generates and persists a new one on first run. */
	async getOrCreate(): Promise<Uint8Array<ArrayBuffer>> {
		const data = await this.dataStore.read();
		if (data.encryptionSalt) return fromBase64(data.encryptionSalt);

		const salt = generateSalt();
		await this.dataStore.patch({ encryptionSalt: toBase64(salt) });
		return salt;
	}

	/** Seeds this device's local cache from a salt fetched elsewhere (the remote vault,
	 * once a SyncProvider can fetch it) — the "link to existing vault" path. */
	async set(salt: Uint8Array<ArrayBuffer>): Promise<void> {
		await this.dataStore.patch({ encryptionSalt: toBase64(salt) });
	}

	/** RF-006 — lets callers tell "first-ever password setup" (CA-002.2/CA-002.3, needs
	 * confirmation + warning) apart from "re-enter password this session" (no salt to
	 * generate, nothing to confirm against) without generating a salt as a side effect. */
	async has(): Promise<boolean> {
		const data = await this.dataStore.read();
		return data.encryptionSalt !== undefined;
	}
}
