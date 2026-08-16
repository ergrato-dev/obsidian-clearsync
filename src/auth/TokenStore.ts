// RF-001 — persists Dropbox tokens through the shared PluginDataStore (RS-002: only
// storage mechanism used is Obsidian's saveData(), never logged, never duplicated
// elsewhere).
import type { PluginDataStore } from "../storage/PluginDataStore";
import type { PluginDataShape } from "../storage/schema";
import type { DropboxTokens } from "./DropboxTokens";

export class TokenStore {
	constructor(private readonly dataStore: PluginDataStore<PluginDataShape>) {}

	async get(): Promise<DropboxTokens | undefined> {
		const data = await this.dataStore.read();
		return data.dropboxAuth;
	}

	async set(tokens: DropboxTokens): Promise<void> {
		await this.dataStore.patch({ dropboxAuth: tokens });
	}

	/** RN-003 — disconnecting removes tokens from local storage immediately. */
	async clear(): Promise<void> {
		await this.dataStore.patch({ dropboxAuth: undefined });
	}
}
