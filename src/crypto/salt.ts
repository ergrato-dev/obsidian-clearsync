import { SALT_LENGTH_BYTES } from "./params";

export function generateSalt(): Uint8Array<ArrayBuffer> {
	const salt = new Uint8Array(SALT_LENGTH_BYTES);
	crypto.getRandomValues(salt);
	return salt;
}
