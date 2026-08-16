import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			// Excluded: real-network/real-browser/real-Obsidian-API glue with no
			// meaningful logic to assert on beyond mocking everything it calls — see
			// each file's top comment. Everything they call (pkce, dropboxOAuth,
			// CallbackServer, TokenStore, PluginDataStore) is fully unit tested.
			exclude: [
				"src/main.ts",
				"src/settings/SettingsTab.ts",
				"src/auth/DropboxAuthManager.ts",
				"src/sync/logSyncEvent.ts",
			],
			thresholds: {
				lines: 85,
				branches: 85,
				functions: 85,
				statements: 85,
			},
		},
	},
});
