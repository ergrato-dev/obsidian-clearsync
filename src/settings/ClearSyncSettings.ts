import type { LocalePreference } from "../i18n";

export interface ClearSyncSettings {
	language: LocalePreference;
	/** RF-008. `.obsidian/**` excluded by default per RN-001/CA-005.3. */
	excludePatterns: string[];
}

export const DEFAULT_SETTINGS: ClearSyncSettings = {
	language: "auto",
	excludePatterns: [".obsidian/**"],
};
