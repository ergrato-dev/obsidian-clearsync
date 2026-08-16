// RF-002 — content hashing (SHA-256), the basis of change detection. Never mtime
// (RT-006): mtime differs across filesystems/devices and causes false conflicts.
// Hashed over plain-text content, before encryption (RF-005) — see the note in
// docs/{es,en}/referencia-tecnica/sync-engine.md.

export async function hashContent(content: string | ArrayBuffer): Promise<string> {
	const data = typeof content === "string" ? new TextEncoder().encode(content) : content;
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
