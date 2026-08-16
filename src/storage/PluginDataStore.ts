// Repository pattern (docs/{es,en}/conceptos/patrones-arquitectonicos.md) — the single
// module that reads/writes the plugin's data.json, so independent features (settings,
// Dropbox tokens, future hash cache/sync log) never clobber each other's keys by each
// calling saveData() with a partial view of the object.

export interface RawDataAccess {
	loadData(): Promise<unknown>;
	saveData(data: unknown): Promise<void>;
}

export class PluginDataStore<TShape extends object> {
	constructor(private readonly access: RawDataAccess) {}

	async read(): Promise<Partial<TShape>> {
		return ((await this.access.loadData()) ?? {}) as Partial<TShape>;
	}

	async patch(partial: Partial<TShape>): Promise<void> {
		const current = await this.read();
		await this.access.saveData({ ...current, ...partial });
	}
}
