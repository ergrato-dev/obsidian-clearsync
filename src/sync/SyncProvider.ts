// Strategy-pattern contract — see docs/{es,en}/referencia-tecnica/architecture.md and
// docs/{es,en}/conceptos/patrones-arquitectonicos.md. DropboxProvider (RF-001, RF-009)
// implements this interface; no other module may depend on a concrete provider (RT-004).

export interface RemoteFileMetadata {
	path: string;
	contentHash: string;
	modifiedAt: number;
}

export interface SyncProvider {
	readonly id: string;
	isConnected(): boolean;
	listChanges(cursor?: string): Promise<{ files: RemoteFileMetadata[]; nextCursor?: string }>;
	download(path: string): Promise<ArrayBuffer>;
	upload(path: string, content: ArrayBuffer): Promise<RemoteFileMetadata>;
	delete(path: string): Promise<void>;
}
