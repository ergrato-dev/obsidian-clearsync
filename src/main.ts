import { Plugin } from "obsidian";
import { ClearSyncSettingTab } from "./settings/SettingsTab";
import { DEFAULT_SETTINGS, type ClearSyncSettings } from "./settings/ClearSyncSettings";
import { PluginDataStore } from "./storage/PluginDataStore";
import type { PluginDataShape } from "./storage/schema";
import { TokenStore } from "./auth/TokenStore";
import { DropboxAuthManager } from "./auth/DropboxAuthManager";
import { HashCache } from "./sync/HashCache";

export default class ClearSyncPlugin extends Plugin {
	declare settings: ClearSyncSettings;
	statusBarItem!: HTMLElement;
	dataStore!: PluginDataStore<PluginDataShape>;
	tokenStore!: TokenStore;
	dropboxAuth!: DropboxAuthManager;
	hashCache!: HashCache;

	async onload(): Promise<void> {
		this.dataStore = new PluginDataStore<PluginDataShape>(this);
		this.tokenStore = new TokenStore(this.dataStore);
		this.dropboxAuth = new DropboxAuthManager(this.tokenStore);
		// RF-002 — not yet driven by a Sync Engine loop; RF-002 ships the hashing/
		// classification engine and its cache, wiring to a live vault scan is future work.
		this.hashCache = new HashCache(this.dataStore);

		await this.loadSettings();

		// RF-007 — status bar reflects idle/syncing/error/conflict once Sync Engine exists.
		this.statusBarItem = this.addStatusBarItem();
		this.statusBarItem.setText("ClearSync: idle");

		this.addSettingTab(new ClearSyncSettingTab(this.app, this));
	}

	onunload(): void {
		// Sync Engine teardown hooks in here once implemented (RF-002+).
	}

	async loadSettings(): Promise<void> {
		const data = await this.dataStore.read();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data.settings);
	}

	async saveSettings(): Promise<void> {
		await this.dataStore.patch({ settings: this.settings });
	}
}
