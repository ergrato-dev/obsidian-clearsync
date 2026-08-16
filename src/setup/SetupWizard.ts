// RF-006 — initial setup wizard state machine. Pure logic, no Obsidian/network I/O:
// SettingsTab drives this with the plugin's real connection/encryption/settings state
// (RF-001 dropboxAuth, RF-005 encryption, ClearSyncSettings.remoteFolder).
export type SetupStep = "dropbox" | "encryption" | "folder" | "done";

export interface SetupWizardState {
	dropboxConnected: boolean;
	encryptionUnlocked: boolean;
	remoteFolder: string;
}

export class SetupWizard {
	constructor(private readonly state: SetupWizardState) {}

	get currentStep(): SetupStep {
		if (!this.state.dropboxConnected) return "dropbox";
		if (!this.state.encryptionUnlocked) return "encryption";
		if (!this.state.remoteFolder.trim()) return "folder";
		return "done";
	}

	/** RF-006 RN-001 — automatic sync can't be enabled until all three steps are done. */
	isComplete(): boolean {
		return this.currentStep === "done";
	}
}
