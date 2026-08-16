// RF-009 — wraps any HttpRequester (see auth/dropboxOAuth.ts) with retry/backoff on
// 429/5xx. RN-002: maxRetries/base delay are configurable, with the defaults from
// docs/{es,en}/referencia-tecnica/sync-engine.md.
//
// Scope: this only makes a single request resilient. RF-009 step 5 ("the rest of the
// sync cycle isn't blocked by one file retrying") is a property of how a future Sync
// Engine schedules multiple files, not something a single-request wrapper can provide
// — not implemented yet, no orchestrator exists (see RF-002/RF-006 status).
import type { HttpRequester, HttpResponse } from "../auth/dropboxOAuth";
import {
	computeBackoffDelay,
	parseRetryAfterMs,
	DEFAULT_BACKOFF,
	type BackoffOptions,
} from "./backoff";

export interface WithBackoffOptions extends Partial<BackoffOptions> {
	maxRetries?: number;
	sleep?: (ms: number) => Promise<void>;
	jitterFn?: () => number;
}

const DEFAULT_MAX_RETRIES = 5;
const defaultSleep = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

function getHeader(response: HttpResponse, name: string): string | undefined {
	if (!response.headers) return undefined;
	const lowerName = name.toLowerCase();
	for (const [key, value] of Object.entries(response.headers)) {
		if (key.toLowerCase() === lowerName) return value;
	}
	return undefined;
}

function isRetryable(status: number): boolean {
	return status === 429 || status >= 500;
}

export function withBackoff(
	request: HttpRequester,
	options: WithBackoffOptions = {},
): HttpRequester {
	const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
	const sleep = options.sleep ?? defaultSleep;
	const backoffOptions: BackoffOptions = {
		baseDelayMs: options.baseDelayMs ?? DEFAULT_BACKOFF.baseDelayMs,
		maxDelayMs: options.maxDelayMs ?? DEFAULT_BACKOFF.maxDelayMs,
	};

	return async (requestOptions) => {
		let response: HttpResponse;
		for (let attempt = 0; ; attempt++) {
			response = await request(requestOptions);
			if (!isRetryable(response.status) || attempt === maxRetries) {
				// RF-009 step 4 — retries exhausted (or nothing to retry): return as-is,
				// the caller's own status check produces a visible failure (RF-007).
				return response;
			}

			const retryAfterMs =
				response.status === 429 ? parseRetryAfterMs(getHeader(response, "Retry-After")) : undefined;
			const delay = retryAfterMs ?? computeBackoffDelay(attempt, backoffOptions, options.jitterFn);
			await sleep(delay);
		}
	};
}
