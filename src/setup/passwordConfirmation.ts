// RF-006 / HU-002 CA-002.2 — an empty password never "matches" an empty confirmation;
// both must be the same non-empty value.
export function passwordsMatch(password: string, confirmation: string): boolean {
	return password.length > 0 && password === confirmation;
}
