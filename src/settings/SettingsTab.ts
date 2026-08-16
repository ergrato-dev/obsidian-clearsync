import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import type ClearSyncPlugin from "../main";
import { resolveLocale, translate, type LocalePreference } from "../i18n";
import type { DropboxTokens } from "../auth/DropboxTokens";

export class ClearSyncSettingTab extends PluginSettingTab {
	plugin: ClearSyncPlugin;

	constructor(app: App, plugin: ClearSyncPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		void this.render();
	}

	private async render(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();

		// TODO(RF-011): confirm the exact Obsidian API for reading the app's active
		// locale at implementation time (see docs/{es,en}/referencia-tecnica/api-plugin-obsidian.md).
		const systemLocale = window.localStorage.getItem("language") ?? "en";
		const locale = resolveLocale(this.plugin.settings.language, systemLocale);
		const t = (key: string) => translate(key, locale);

		containerEl.createEl("h2", { text: "ClearSync" });

		const tokens = await this.plugin.tokenStore.get();
		this.renderAccountSection(containerEl, t, tokens);

		new Setting(containerEl).setName(t("settings.language.title")).addDropdown((dropdown) =>
			dropdown
				.addOption("auto", t("settings.language.auto"))
				.addOption("es", "Español")
				.addOption("en", "English")
				.setValue(this.plugin.settings.language)
				.onChange(async (value) => {
					this.plugin.settings.language = value as LocalePreference;
					await this.plugin.saveSettings();
					this.display();
				}),
		);
	}

	private renderAccountSection(
		containerEl: HTMLElement,
		t: (key: string) => string,
		tokens: DropboxTokens | undefined,
	): void {
		const setting = new Setting(containerEl).setName(t("settings.account.title"));

		// RF-001 / HU-001
		if (tokens) {
			setting.setDesc(
				t("settings.account.connectedAs").replace("{email}", tokens.accountEmail ?? "?"),
			);
			setting.addButton((button) =>
				button.setButtonText(t("settings.account.disconnect")).onClick(async () => {
					await this.plugin.dropboxAuth.disconnect(); // RN-003
					new Notice(t("settings.account.disconnected"));
					this.display();
				}),
			);
			return;
		}

		setting.setDesc(t("settings.account.notConnected"));
		setting.addButton((button) =>
			button
				.setButtonText(t("settings.account.connect"))
				.setCta()
				.onClick(async () => {
					button.setDisabled(true).setButtonText(t("settings.account.connecting"));
					try {
						await this.plugin.dropboxAuth.connect();
					} catch {
						// CA-001.4 — cancellation/failure stays non-alarming, no stack trace shown.
						new Notice(t("settings.account.connectFailed"));
					}
					this.display();
				}),
		);
	}
}
