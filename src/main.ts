import { Plugin } from "obsidian";
import { ClearSyncSettingTab } from "./settings/SettingsTab";
import { DEFAULT_SETTINGS, type ClearSyncSettings } from "./settings/ClearSyncSettings";

export default class ClearSyncPlugin extends Plugin {
	declare settings: ClearSyncSettings;
	statusBarItem!: HTMLElement;

	async onload(): Promise<void> {
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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
