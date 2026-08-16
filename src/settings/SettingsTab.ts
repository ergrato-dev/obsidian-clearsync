import { App, PluginSettingTab, Setting } from "obsidian";
import type ClearSyncPlugin from "../main";
import { resolveLocale, translate, type LocalePreference } from "../i18n";

export class ClearSyncSettingTab extends PluginSettingTab {
	plugin: ClearSyncPlugin;

	constructor(app: App, plugin: ClearSyncPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// TODO(RF-011): confirm the exact Obsidian API for reading the app's active
		// locale at implementation time (see docs/{es,en}/referencia-tecnica/api-plugin-obsidian.md).
		const systemLocale = window.localStorage.getItem("language") ?? "en";
		const locale = resolveLocale(this.plugin.settings.language, systemLocale);
		const t = (key: string) => translate(key, locale);

		containerEl.createEl("h2", { text: "ClearSync" });

		// RF-001 — connect/disconnect Dropbox. Not implemented yet.
		new Setting(containerEl)
			.setName(t("settings.account.title"))
			.setDesc(t("settings.account.notConnected"))
			.addButton((button) => button.setButtonText(t("settings.account.connect")).setDisabled(true));

		// RF-011 — language override.
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
}
