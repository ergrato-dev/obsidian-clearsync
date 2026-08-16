import type { ClearSyncSettings } from "../settings/ClearSyncSettings";
import type { DropboxTokens } from "../auth/DropboxTokens";
import type { HashCacheEntry } from "../sync/types";

/** Shape of the single JSON object ClearSync persists via Plugin.saveData(). */
export interface PluginDataShape {
	settings: ClearSyncSettings;
	dropboxAuth?: DropboxTokens;
	/** RF-002 — keyed by vault-relative path. */
	hashCache?: Record<string, HashCacheEntry>;
}
