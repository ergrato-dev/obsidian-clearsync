import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["src/main.ts", "src/settings/SettingsTab.ts"],
			thresholds: {
				lines: 85,
				branches: 85,
				functions: 85,
				statements: 85,
			},
		},
	},
});
