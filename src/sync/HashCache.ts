// RF-002 — persists the per-file hash cache (HashCacheEntry) through the shared
// PluginDataStore, same Repository pattern as TokenStore (see
// docs/{es,en}/conceptos/patrones-arquitectonicos.md).
import type { PluginDataStore } from "../storage/PluginDataStore";
import type { PluginDataShape } from "../storage/schema";
import type { HashCacheEntry } from "./types";

export class HashCache {
	constructor(private readonly dataStore: PluginDataStore<PluginDataShape>) {}

	async get(path: string): Promise<HashCacheEntry | undefined> {
		const data = await this.dataStore.read();
		return data.hashCache?.[path];
	}

	async all(): Promise<Record<string, HashCacheEntry>> {
		const data = await this.dataStore.read();
		return data.hashCache ?? {};
	}

	async set(entry: HashCacheEntry): Promise<void> {
		const data = await this.dataStore.read();
		await this.dataStore.patch({ hashCache: { ...data.hashCache, [entry.path]: entry } });
	}

	async remove(path: string): Promise<void> {
		const data = await this.dataStore.read();
		if (!data.hashCache || !(path in data.hashCache)) return;
		const hashCache = { ...data.hashCache };
		delete hashCache[path];
		await this.dataStore.patch({ hashCache });
	}
}
