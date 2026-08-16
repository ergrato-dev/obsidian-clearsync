import { describe, expect, it } from "vitest";
import { resolveVaultLinkMode } from "../src/setup/vaultLinkMode";

describe("resolveVaultLinkMode", () => {
	it("resolves to existing when the remote folder already has content (CA-002.4)", () => {
		expect(resolveVaultLinkMode(true)).toBe("existing");
	});

	it("resolves to new when the remote folder is empty (CA-002.6)", () => {
		expect(resolveVaultLinkMode(false)).toBe("new");
	});
});
