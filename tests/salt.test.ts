import { describe, expect, it } from "vitest";
import { generateSalt } from "../src/crypto/salt";
import { SALT_LENGTH_BYTES } from "../src/crypto/params";

describe("generateSalt", () => {
	it(`produces ${SALT_LENGTH_BYTES} random bytes`, () => {
		expect(generateSalt()).toHaveLength(SALT_LENGTH_BYTES);
	});

	it("is not deterministic across calls", () => {
		expect(generateSalt()).not.toEqual(generateSalt());
	});
});
