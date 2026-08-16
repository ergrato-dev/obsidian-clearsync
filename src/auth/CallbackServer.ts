// RF-001 — local HTTP listener that catches Dropbox's OAuth redirect. Desktop-only
// (RNF-004.1, manifest.json isDesktopOnly): uses Node's `http` module, available in
// Obsidian's desktop runtime but not on mobile (RF-012 is future work).
import { createServer, type Server } from "node:http";

const SUCCESS_HTML =
	'<!doctype html><html><body style="font-family:sans-serif">ClearSync: Dropbox connected. You can close this tab.</body></html>';
const ERROR_HTML =
	'<!doctype html><html><body style="font-family:sans-serif">ClearSync: authorization failed. You can close this tab and try again.</body></html>';

export interface AuthorizationCallback {
	promise: Promise<string>;
	close: () => void;
}

export function waitForAuthorizationCode(params: {
	port: number;
	expectedState: string;
	timeoutMs?: number;
}): AuthorizationCallback {
	let resolveCode: (code: string) => void;
	let rejectCode: (error: Error) => void;

	const server: Server = createServer((req, res) => {
		const url = new URL(req.url ?? "/", `http://localhost:${params.port}`);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");
		const error = url.searchParams.get("error");

		if (error) {
			res.writeHead(400, { "Content-Type": "text/html" }).end(ERROR_HTML);
			rejectCode(new Error(`Dropbox returned an error: ${error}`));
			return;
		}
		if (!code || state !== params.expectedState) {
			res.writeHead(400, { "Content-Type": "text/html" }).end(ERROR_HTML);
			rejectCode(new Error("Missing authorization code or state mismatch."));
			return;
		}
		res.writeHead(200, { "Content-Type": "text/html" }).end(SUCCESS_HTML);
		resolveCode(code);
	});

	let timer: ReturnType<typeof setTimeout>;
	const close = (): void => {
		clearTimeout(timer);
		server.close();
	};

	const promise = new Promise<string>((resolve, reject) => {
		resolveCode = (code) => {
			close();
			resolve(code);
		};
		rejectCode = (error) => {
			close();
			reject(error);
		};
		server.listen(params.port);
		timer = setTimeout(
			() => rejectCode(new Error("Timed out waiting for Dropbox authorization.")),
			params.timeoutMs ?? 120_000,
		);
	});

	return { promise, close };
}
