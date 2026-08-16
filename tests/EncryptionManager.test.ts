import { describe, expect, it } from "vitest";
import { PluginDataStore } from "../src/storage/PluginDataStore";
import { SaltStore } from "../src/crypto/SaltStore";
import { EncryptionManager, EncryptionNotUnlockedError } from "../src/crypto/EncryptionManager";
import { DecryptionError } from "../src/crypto/encryption";
import type { PluginDataShape } from "../src/storage/schema";

function fakeAccess() {
	let data: unknown;
	return {
		loadData: async () => data,
		saveData: async (next: unknown) => {
			data = next;
		},
	};
}

describe("EncryptionManager", () => {
	it("hasExistingPassword() is false before unlock(), true after (RF-006 wizard step)", async () => {
		const manager = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(fakeAccess())),
		);
		await expect(manager.hasExistingPassword()).resolves.toBe(false);
		await manager.unlock("first-password");
		await expect(manager.hasExistingPassword()).resolves.toBe(true);
	});

	it("is not unlocked until unlock() is called", () => {
		const manager = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(fakeAccess())),
		);
		expect(manager.isUnlocked()).toBe(false);
	});

	it("throws EncryptionNotUnlockedError if encrypt/decrypt is called before unlock()", async () => {
		const manager = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(fakeAccess())),
		);
		await expect(manager.encryptContent("x")).rejects.toThrow(EncryptionNotUnlockedError);
		await expect(
			manager.decryptContent({ ciphertext: new ArrayBuffer(0), iv: new Uint8Array() }),
		).rejects.toThrow(EncryptionNotUnlockedError);
	});

	it("round-trips content after unlock()", async () => {
		const manager = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(fakeAccess())),
		);
		await manager.unlock("vault-password");
		expect(manager.isUnlocked()).toBe(true);

		const payload = await manager.encryptContent("note content");
		const decrypted = await manager.decryptContent(payload);
		expect(new TextDecoder().decode(decrypted)).toBe("note content");
	});

	it("a second device unlocking with the same password + persisted salt can decrypt (HU-002 CA-002.4)", async () => {
		const access = fakeAccess();
		const deviceA = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(access)),
		);
		await deviceA.unlock("shared-password");
		const payload = await deviceA.encryptContent("synced note");

		const deviceB = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(access)),
		);
		await deviceB.unlock("shared-password");
		const decrypted = await deviceB.decryptContent(payload);
		expect(new TextDecoder().decode(decrypted)).toBe("synced note");
	});

	it("a wrong password on a second device fails to decrypt explicitly (HU-002 CA-002.5)", async () => {
		const access = fakeAccess();
		const deviceA = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(access)),
		);
		await deviceA.unlock("correct-password");
		const payload = await deviceA.encryptContent("synced note");

		const deviceB = new EncryptionManager(
			new SaltStore(new PluginDataStore<PluginDataShape>(access)),
		);
		await deviceB.unlock("wrong-password");
		await expect(deviceB.decryptContent(payload)).rejects.toThrow(DecryptionError);
	});
});
