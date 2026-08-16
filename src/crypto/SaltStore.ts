// RF-005 — persists the PBKDF2 salt (not secret on its own, unlike the password)
// through the shared PluginDataStore, same Repository pattern as TokenStore/HashCache.
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
}
