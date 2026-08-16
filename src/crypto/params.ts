// RF-005 / RT-005 — key derivation and cipher parameters.
// 600,000 PBKDF2-HMAC-SHA256 iterations follows OWASP's 2023 minimum guidance
// (docs/{es,en}/conceptos/owasp-top-10.md, A02 Cryptographic Failures).
export const PBKDF2_ITERATIONS = 600_000;
export const SALT_LENGTH_BYTES = 16;
// NIST SP 800-38D recommends a 96-bit (12-byte) IV for AES-GCM.
export const IV_LENGTH_BYTES = 12;
export const AES_KEY_LENGTH_BITS = 256;
