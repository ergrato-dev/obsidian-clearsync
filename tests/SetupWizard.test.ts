import { describe, expect, it } from "vitest";
import { SetupWizard } from "../src/setup/SetupWizard";

describe("SetupWizard", () => {
	it("starts at the dropbox step when nothing is done", () => {
		const wizard = new SetupWizard({
			dropboxConnected: false,
			encryptionUnlocked: false,
			remoteFolder: "",
		});
		expect(wizard.currentStep).toBe("dropbox");
		expect(wizard.isComplete()).toBe(false);
	});

	it("moves to encryption once Dropbox is connected", () => {
		const wizard = new SetupWizard({
			dropboxConnected: true,
			encryptionUnlocked: false,
			remoteFolder: "",
		});
		expect(wizard.currentStep).toBe("encryption");
	});

	it("moves to folder once encryption is unlocked", () => {
		const wizard = new SetupWizard({
			dropboxConnected: true,
			encryptionUnlocked: true,
			remoteFolder: "",
		});
		expect(wizard.currentStep).toBe("folder");
	});

	it("treats a blank/whitespace-only folder as not chosen yet", () => {
		const wizard = new SetupWizard({
			dropboxConnected: true,
			encryptionUnlocked: true,
			remoteFolder: "   ",
		});
		expect(wizard.currentStep).toBe("folder");
	});

	it("is done and complete once all three steps hold (RN-001)", () => {
		const wizard = new SetupWizard({
			dropboxConnected: true,
			encryptionUnlocked: true,
			remoteFolder: "Vault",
		});
		expect(wizard.currentStep).toBe("done");
		expect(wizard.isComplete()).toBe(true);
	});
});
