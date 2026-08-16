import type { LocalePreference } from "../i18n";

export interface ClearSyncSettings {
	language: LocalePreference;
	/** RF-008. `.obsidian/**` excluded by default per RN-001/CA-005.3. */
	excludePatterns: string[];
	/** RF-006 — remote Dropbox folder chosen/created during setup. */
	remoteFolder: string;
	/** RF-006 RN-001 — gated by SetupWizard.isComplete(); no Sync Engine reads this yet. */
	autoSyncEnabled: boolean;
}

export const DEFAULT_SETTINGS: ClearSyncSettings = {
	language: "auto",
	excludePatterns: [".obsidian/**"],
	remoteFolder: "",
	autoSyncEnabled: false,
};
