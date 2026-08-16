import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import type ClearSyncPlugin from "../main";
import { resolveLocale, translate, type LocalePreference } from "../i18n";
import type { DropboxTokens } from "../auth/DropboxTokens";
import { SetupWizard } from "../setup/SetupWizard";
import { passwordsMatch } from "../setup/passwordConfirmation";

type Translate = (key: string) => string;

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
		const t: Translate = (key) => translate(key, locale);

		containerEl.createEl("h2", { text: "ClearSync" });

		const tokens = await this.plugin.tokenStore.get();
		const wizard = new SetupWizard({
			dropboxConnected: tokens !== undefined,
			encryptionUnlocked: this.plugin.encryption.isUnlocked(),
			remoteFolder: this.plugin.settings.remoteFolder,
		});

		// RF-006 — guided setup until all three steps are done (RN-001); normal settings
		// sections afterward. Re-shown on every reload's "encryption" step because the
		// derived key never persists across sessions (RS-001).
		if (!wizard.isComplete()) {
			new Setting(containerEl).setHeading().setName(t("settings.setup.title"));
			switch (wizard.currentStep) {
				case "dropbox":
					this.renderAccountSection(containerEl, t, tokens);
					break;
				case "encryption":
					await this.renderEncryptionStep(containerEl, t);
					break;
				case "folder":
					this.renderFolderStep(containerEl, t);
					break;
			}
			return;
		}

		new Setting(containerEl).setDesc(t("settings.setup.complete"));
		this.renderAccountSection(containerEl, t, tokens);
		this.renderFolderStep(containerEl, t);
		this.renderLanguageSection(containerEl, t);
	}

	private renderAccountSection(
		containerEl: HTMLElement,
		t: Translate,
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

		setting.setDesc(t("settings.setup.stepDropboxDesc"));
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

	private async renderEncryptionStep(containerEl: HTMLElement, t: Translate): Promise<void> {
		const hasExistingPassword = await this.plugin.encryption.hasExistingPassword();

		if (hasExistingPassword) {
			// Returning session on a device that already set a password (RF-005 RS-001:
			// the derived key isn't persisted, so this runs again on every reload).
			let password = "";
			new Setting(containerEl)
				.setName(t("settings.setup.encryptionTitle"))
				.setDesc(t("settings.setup.encryptionUnlockDesc"))
				.addText((text) => {
					text.inputEl.type = "password";
					text.onChange((value) => (password = value));
				})
				.addButton((button) =>
					button
						.setButtonText(t("settings.setup.encryptionUnlockButton"))
						.setCta()
						.onClick(async () => {
							await this.plugin.encryption.unlock(password);
							this.display();
						}),
				);
			return;
		}

		// CA-002.2/CA-002.3 — first-ever password: confirmation + explicit loss-of-access warning.
		let password = "";
		let confirmation = "";
		new Setting(containerEl)
			.setName(t("settings.setup.encryptionTitle"))
			.setDesc(t("settings.setup.encryptionWarning"));
		new Setting(containerEl).addText((text) => {
			text.setPlaceholder(t("settings.setup.encryptionPasswordPlaceholder"));
			text.inputEl.type = "password";
			text.onChange((value) => (password = value));
		});
		new Setting(containerEl)
			.addText((text) => {
				text.setPlaceholder(t("settings.setup.encryptionConfirmPlaceholder"));
				text.inputEl.type = "password";
				text.onChange((value) => (confirmation = value));
			})
			.addButton((button) =>
				button
					.setButtonText(t("settings.setup.encryptionConfirmButton"))
					.setCta()
					.onClick(async () => {
						if (!passwordsMatch(password, confirmation)) {
							new Notice(t("settings.setup.encryptionMismatch"));
							return;
						}
						await this.plugin.encryption.unlock(password);
						this.display();
					}),
			);
	}

	private renderFolderStep(containerEl: HTMLElement, t: Translate): void {
		// RF-006 step 4/5 (link to existing vault vs new) needs a live SyncProvider to list
		// the remote folder — not implemented yet (see src/setup/vaultLinkMode.ts). This
		// step only records the chosen folder name.
		let folder = this.plugin.settings.remoteFolder;
		new Setting(containerEl)
			.setName(t("settings.setup.folderTitle"))
			.setDesc(t("settings.setup.folderStepDesc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.setup.folderPlaceholder"));
				text.setValue(folder);
				text.onChange((value) => (folder = value));
			})
			.addButton((button) =>
				button
					.setButtonText(t("settings.setup.folderConfirmButton"))
					.setCta()
					.onClick(async () => {
						if (!folder.trim()) return;
						this.plugin.settings.remoteFolder = folder.trim();
						await this.plugin.saveSettings();
						this.display();
					}),
			);
	}

	private renderLanguageSection(containerEl: HTMLElement, t: Translate): void {
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
