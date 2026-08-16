import type { ClearSyncSettings } from "../settings/ClearSyncSettings";
import type { DropboxTokens } from "../auth/DropboxTokens";

/** Shape of the single JSON object ClearSync persists via Plugin.saveData(). */
export interface PluginDataShape {
	settings: ClearSyncSettings;
	dropboxAuth?: DropboxTokens;
}
